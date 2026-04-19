export const QuestionCard = ({ question, index }) => {
  return (
    <div 
      className="glass-panel p-4 mb-3 transition-transform animation-slide-up hover:scale-[1.01]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-2 min-w-[50px]">
          <svg className="w-5 h-5 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span className="font-bold text-white text-lg leading-none">{question.votes || 0}</span>
        </div>
        
        <div className="flex-1">
          <p className="text-lg text-white font-medium mb-1">
            {question.cleanedText || question.text}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {question.clusterId && (
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                {question.clusterId}
              </span>
            )}
            <span className="text-xs text-gray-500">
              Score: {question.score ? question.score.toFixed(2) : 'New'}
            </span>
            {question.geminiRank > 0.8 && (
               <span className="text-xs text-amber-400 flex items-center gap-1">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                 Hot
               </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
