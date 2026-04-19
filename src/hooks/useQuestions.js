import { useState, useEffect, useCallback, useRef } from 'react';
import { rankQuestions, getSentiment } from '../services/gemini';
import { formatQuestion } from '../utils/formatQuestion';

// In-memory question store — shared across hook instances via module scope
let _questions = [
  { id: 'q1', text: 'Will Gemini 2.0 support multimodal fine-tuning?', votes: 48, geminiRank: 0.95, clusterId: 'Technical' },
  { id: 'q2', text: 'What is the best architecture for real-time AI apps at scale?', votes: 31, geminiRank: 0.87, clusterId: 'Technical' },
  { id: 'q3', text: 'How do you handle AI bias in consumer products?', votes: 29, geminiRank: 0.82, clusterId: 'Ethics' },
  { id: 'q4', text: 'What skills should developers build as AI matures?', votes: 24, geminiRank: 0.74, clusterId: 'Career' },
];
let _listeners = [];
let _sentiment = 'curious';

const notify = () => _listeners.forEach(fn => fn([..._questions], _sentiment));

export const useQuestions = (sessionId) => {
  const [questions, setQuestions] = useState([..._questions]);
  const [sentiment, setSentiment] = useState(_sentiment);
  const geminiTimer = useRef(null);

  useEffect(() => {
    // Register this component as a listener
    const handler = (qs, sent) => {
      setQuestions(qs);
      setSentiment(sent);
    };
    _listeners.push(handler);

    // Call Gemini sentiment every 30 seconds
    const runSentiment = async () => {
      try {
        const result = await getSentiment(_questions);
        _sentiment = result.sentiment || 'curious';
        notify();
      } catch(e) {}
    };

    // Simulate crowd energy — new question drifts in every 20s for demo wow-factor
    const demoInterval = setInterval(() => {
      const demoQs = [
        'Can Gemini handle real-time video analysis?',
        'How does EventPulse scale to 10,000 attendees?',
        'What is the latency of the Gemini Flash model?',
        'Will this work offline at remote venues?',
        'How do you prevent spam questions from the audience?',
      ];
      const randomQ = demoQs[Math.floor(Math.random() * demoQs.length)];
      const newQ = {
        id: 'q-' + Date.now(),
        text: randomQ,
        votes: Math.floor(Math.random() * 15) + 1,
        geminiRank: Math.random() * 0.6 + 0.3,
        clusterId: ['Technical', 'Career', 'Ethics'][Math.floor(Math.random() * 3)],
      };
      _questions = [..._questions, newQ];
      _questions = _questions
        .map(q => ({ ...q, score: (q.geminiRank || 0) * 0.6 + (q.votes || 0) * 0.4 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8); // keep top 8
      notify();
    }, 20000);

    runSentiment();
    geminiTimer.current = setInterval(runSentiment, 30000);

    return () => {
      _listeners = _listeners.filter(fn => fn !== handler);
      clearInterval(geminiTimer.current);
      clearInterval(demoInterval);
    };
  }, [sessionId]);

  const submitQuestion = useCallback(async (text, uid) => {
    const cleanedText = formatQuestion(text);
    if (!cleanedText) return;

    const newQ = {
      id: 'q-' + Date.now(),
      text: cleanedText,
      votes: 0,
      geminiRank: 0.5,
      clusterId: 'General',
    };

    _questions = [..._questions, newQ];
    notify();

    // Ask Gemini to rank all questions including the new one
    try {
      const ranked = await rankQuestions(_questions, 'AI and technology at live events');
      ranked.forEach(r => {
        const q = _questions.find(q => q.id === r.id);
        if (q) {
          q.geminiRank = r.relevanceScore || 0.5;
          q.clusterId = r.clusterId || q.clusterId;
          q.text = r.cleanedText || q.text;
        }
      });
      _questions = [..._questions]
        .map(q => ({ ...q, score: (q.geminiRank || 0) * 0.6 + (q.votes || 0) * 0.4 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      notify();
    } catch(e) {}
  }, [sessionId]);

  const upvoteQuestion = useCallback((qId) => {
    _questions = _questions.map(q =>
      q.id === qId ? { ...q, votes: (q.votes || 0) + 1 } : q
    ).sort((a, b) => {
      const sa = (a.geminiRank || 0) * 0.6 + (a.votes || 0) * 0.4;
      const sb = (b.geminiRank || 0) * 0.6 + (b.votes || 0) * 0.4;
      return sb - sa;
    });
    notify();
  }, []);

  return { questions, sentiment, submitQuestion, upvoteQuestion };
};