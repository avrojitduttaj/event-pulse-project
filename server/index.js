import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '../.env.local' });

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_KEY || 'MISSING');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const __isAILive = !(!process.env.VITE_GEMINI_KEY || process.env.VITE_GEMINI_KEY.includes('YOUR_'));

// In-memory Database
let questionsDB = {}; 

const generateSentiment = async (texts) => {
  if (!__isAILive) return "neutral";
  try {
    const prompt = `Rate the overall sentiment from these questions: positive / neutral / curious / frustrated. Return ONLY the single word. Questions: ${JSON.stringify(texts)}`;
    const result = await model.generateContent(prompt);
    let str = result.response.text().trim().toLowerCase();
    if(str.includes('positive')) return 'positive';
    if(str.includes('frustrate')) return 'frustrated';
    if(str.includes('curious')) return 'curious';
    return 'neutral';
  } catch (e) {
     return "neutral";
  }
};

const rankQuestionsViaAI = async (questionsList, topic) => {
   if (!__isAILive || questionsList.length === 0) return;
   try {
     const prompt = `Given this session topic ("${topic}") and these audience questions, return a JSON array. Return only valid JSON, no markdown.
Questions: ${JSON.stringify(questionsList.map(q => ({ id: q.id, text: q.text })))}
Format: JSON array where each object has: { "id": "id-string", "clusterId": "label", "relevanceScore": 0.0 to 1.0 }`;
     const result = await model.generateContent(prompt);
     let txt = result.response.text().trim();
     if (txt.startsWith('```json')) txt = txt.replace(/^```json/, '').replace(/```$/, '').trim();
     if (txt.startsWith('```')) txt = txt.replace(/^```/, '').replace(/```$/, '').trim();
     
     const parsed = JSON.parse(txt);
     return parsed;
   } catch(e) {
     console.error('Failed to rank', e);
     return null;
   }
};

// Evaluate the ranks every 15 seconds to avoid rate limiting
setInterval(async () => {
   for (const sessionId in questionsDB) {
       const qList = Object.values(questionsDB[sessionId]);
       if(qList.length > 0) {
           const ranks = await rankQuestionsViaAI(qList, "General Hackathon");
           if (ranks) {
              ranks.forEach(r => {
                 if(questionsDB[sessionId][r.id]) {
                    questionsDB[sessionId][r.id].geminiRank = r.relevanceScore;
                    questionsDB[sessionId][r.id].clusterId = r.clusterId;
                 }
              });
           }
           
           const texts = qList.map(q => q.text);
           const sent = await generateSentiment(texts.slice(0,20));
           
           io.to(sessionId).emit('questions_update', Object.values(questionsDB[sessionId]));
           io.to(sessionId).emit('sentiment_update', { sentiment: sent });
       }
   }
}, 15000);


io.on('connection', (socket) => {
  socket.on('join_session', (sessionId) => {
    socket.join(sessionId);
    if (!questionsDB[sessionId]) questionsDB[sessionId] = {};
    socket.emit('questions_update', Object.values(questionsDB[sessionId]));
  });

  socket.on('add_question', async (data) => {
    const { sessionId, text, authorUid } = data;
    if (!questionsDB[sessionId]) questionsDB[sessionId] = {};
    
    const newId = 'q_' + Date.now();
    const newQ = { id: newId, text, authorUid, votes: 0, geminiRank: 0.5, ts: Date.now() };
    questionsDB[sessionId][newId] = newQ;
    
    io.to(sessionId).emit('questions_update', Object.values(questionsDB[sessionId]));
  });

  socket.on('vote_question', (data) => {
    const { sessionId, questionId } = data;
    if (questionsDB[sessionId] && questionsDB[sessionId][questionId]) {
      questionsDB[sessionId][questionId].votes += 1;
      io.to(sessionId).emit('questions_update', Object.values(questionsDB[sessionId]));
    }
  });

});

app.get('/api/health', (req, res) => res.json({ status: 'Platform Live' }));

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Live Event Backend listening on port ${PORT}`);
});
