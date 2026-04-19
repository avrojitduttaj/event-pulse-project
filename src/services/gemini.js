import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_KEY || "";
export const __isMock = !apiKey || apiKey.includes("YOUR_");

let genAI, model;

if (!__isMock) {
  genAI = new GoogleGenerativeAI(apiKey);
  // Using Flash for speed and cost-efficiency as requested
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} else {
  console.warn("Gemini API Key missing. Using mock Gemini services.");
}

/**
 * Batched recommendations.
 * Given a user's context (e.g. current location, time) and an array of possible sessions/rooms,
 * returns a recommendation object parsed from JSON.
 */
export const getRecommendation = async ({ time, zone, sessions, crowd }) => {
  if (__isMock) {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        sessionId: "session-1",
        reason: "Near you and 40% full",
        walkMinutes: 5,
        urgency: "soon"
      });
    }, 800));
  }

  try {
    const prompt = `You are an event guide. Given the context below, recommend ONE session the attendee should go to RIGHT NOW. Return only valid JSON, no markdown.

Current time: ${time}
Attendee zone: ${zone}
Crowd density per room (0-100): ${JSON.stringify(crowd)}
Upcoming sessions: ${JSON.stringify(sessions)}

Return format exactly: 
{ "sessionId": "string", "reason": "string (max 12 words)", "walkMinutes": number, "urgency": "now"|"soon"|"later" }`;
    
    const result = await model.generateContent(prompt);
    let txt = result.response.text().trim();
    if (txt.startsWith('```json')) txt = txt.replace(/^```json/, '').replace(/```$/, '').trim();
    if (txt.startsWith('```')) txt = txt.replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(txt);
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return { sessionId: null, reason: "Unable to fetch recommendation.", walkMinutes: 0, urgency: "later" };
  }
};

/**
 * Ranks questions using Gemini array processing.
 */
export const rankQuestions = async (questions, topic) => {
  if (!questions || questions.length === 0) return [];
  if (__isMock) {
    return new Promise(resolve => setTimeout(() => {
      const ranked = [...questions].sort((a,b) => b.votes - a.votes).map(q => ({
        id: q.id,
        cleanedText: q.text + " (cleaned)",
        clusterId: "mock-cluster",
        relevanceScore: Math.random()
      }));
      resolve(ranked);
    }, 1000));
  }
  
  try {
    const prompt = `Given this session topic ("${topic}") and these audience questions, return a JSON array. 
Return only valid JSON, no markdown.

Questions: ${JSON.stringify(questions.map(q => ({ id: q.id, text: q.text })))}

Format: JSON array where each object has:
{ "id": "id-string", "cleanedText": "clean string", "clusterId": "label", "relevanceScore": 0.0 to 1.0 }`;

    const result = await model.generateContent(prompt);
    let txt = result.response.text().trim();
    if (txt.startsWith('```json')) txt = txt.replace(/^```json/, '').replace(/```$/, '').trim();
    if (txt.startsWith('```')) txt = txt.replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(txt);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return questions.map(q => ({ id: q.id, cleanedText: q.text, clusterId: "general", relevanceScore: 0.5 }));
  }
};

/**
 * Predicts sentiment
 */
export const getSentiment = async (questions) => {
  if (!questions || questions.length === 0) return { sentiment: "neutral" };
  if (__isMock) {
    return new Promise(resolve => setTimeout(() => {
      const opts = ["positive", "neutral", "curious", "frustrated"];
      resolve({ sentiment: opts[Math.floor(Math.random() * opts.length)] });
    }, 500));
  }

  try {
    const prompt = `Rate the overall audience sentiment from these questions: positive / neutral / curious / frustrated. Return only valid JSON, no markdown.
Questions: ${JSON.stringify(questions.map(q => q.text))}
Format: { "sentiment": "string" }`;

    const result = await model.generateContent(prompt);
    let txt = result.response.text().trim();
    if (txt.startsWith('```json')) txt = txt.replace(/^```json/, '').replace(/```$/, '').trim();
    if (txt.startsWith('```')) txt = txt.replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(txt);
  } catch (error) {
    return { sentiment: "neutral" };
  }
};
