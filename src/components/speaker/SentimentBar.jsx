export const SentimentBar = ({ sentiment = 'neutral' }) => {
  const config = {
    positive: { color: 'bg-emerald-500', label: 'Positive / Engaged' },
    neutral: { color: 'bg-blue-500', label: 'Neutral / Listening' },
    curious: { color: 'bg-amber-500', label: 'Curious / Questioning' },
    frustrated: { color: 'bg-red-500', label: 'Frustrated / Confused' },
  };

  const current = config[sentiment.toLowerCase()] || config['neutral'];

  return (
    <div className="glass-panel p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Live Audience Sentiment</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden flex">
          <div className={`h-full ${current.color} transition-all duration-1000 ease-out w-full`} />
        </div>
        <span className={`text-sm font-bold ${current.color.replace('bg-', 'text-')}`}>
          {current.label}
        </span>
      </div>
    </div>
  );
};
