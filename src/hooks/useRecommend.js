import { useState, useEffect, useCallback } from 'react';
import { getRecommendation } from '../services/gemini';
import { useCrowd } from './useCrowd';

export const useRecommend = (sessions) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { crowdState } = useCrowd();

  const fetchRecommendation = useCallback(async (zone) => {
    setLoading(true);
    const context = {
      time: new Date().toISOString(),
      zone: zone || "entrance",
      sessions: sessions.slice(0, 3).map(s => ({ title: s.title, room: s.room, start: s.startTime })),
      crowd: crowdState
    };
    
    // Call Gemini batched
    const result = await getRecommendation(context);
    setRecommendation(result);
    setLoading(false);
  }, [sessions, crowdState]);

  return { recommendation, fetchRecommendation, loading };
};
