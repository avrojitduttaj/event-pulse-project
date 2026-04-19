import { useEffect, useRef } from 'react';
import { useRecommend } from '../../hooks/useRecommend';
import { LoadingPulse } from '../shared';

export const RecommendCard = ({ sessions }) => {
  const { recommendation, fetchRecommendation, loading } = useRecommend(sessions);

  useEffect(() => {
    // Initial fetch
    fetchRecommendation("main-hall");
    // Refresh every 5 mins
    const interval = setInterval(() => fetchRecommendation("main-hall"), 300000);
    return () => clearInterval(interval);
  }, [fetchRecommendation]);

  if (loading && !recommendation) return <div className="glass-panel p-4"><LoadingPulse /></div>;
  if (!recommendation) return null;

  const urgColor = recommendation.urgency === 'now' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                   recommendation.urgency === 'soon' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                   'bg-teal-500/20 text-teal-300 border-teal-500/30';

  return (
    <div className="glass-panel p-5 relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
           <svg className="w-5 h-5 text-teal-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           Gemini Recommends
        </h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border uppercase tracking-wider ${urgColor}`}>
          {recommendation.urgency}
        </span>
      </div>
      
      <p className="text-xl font-medium text-white mb-2 leading-tight">
        Go to <span className="text-teal-300">{recommendation.room || "Room B"}</span>
      </p>
      
      <p className="text-gray-400 text-sm mb-4">
        {recommendation.reason}
      </p>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Navigate Here
        </button>
      </div>
    </div>
  );
};
