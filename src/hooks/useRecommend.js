import { useState, useEffect, useCallback, useRef } from 'react';
import { getRecommendation } from '../services/gemini';
import { useCrowd } from './useCrowd';

export const useRecommend = (sessions) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { crowdState } = useCrowd();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchRecommendation = useCallback(async (zone = 'entrance') => {
    if (!sessions || sessions.length === 0) return;
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const safeSessions = (sessions || [])
        .slice(0, 3)
        .map(s => ({
          id: s.id || 'unknown',
          title: String(s.title || '').slice(0, 100),
          room: String(s.room || '').slice(0, 50),
          start: s.startTime || 'TBD'
        }));

      const context = {
        time: new Date().toLocaleTimeString(),
        zone: String(zone).slice(0, 50),
        sessions: safeSessions,
        crowd: crowdState || {}
      };

      const result = await getRecommendation(context);
      if (isMounted.current) setRecommendation(result);
    } catch (err) {
      console.error('Recommendation error:', err);
      if (isMounted.current) {
        setError(err.message);
        setRecommendation({
          reason: 'Head to the least crowded room',
          walkMinutes: 3,
          urgency: 'soon'
        });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [sessions, crowdState]);

  return { recommendation, fetchRecommendation, loading, error };
};