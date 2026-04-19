export const ScheduleList = ({ schedule, onSelectSession, currentSessionId }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Upcoming Sessions</h2>
      <div className="space-y-3">
        {schedule.map(session => (
          <div 
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`p-4 rounded-xl cursor-pointer transition-all border ${currentSessionId === session.id ? 'bg-teal-500/20 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'glass-panel hover:bg-white/10'}`}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-white text-lg">{session.title}</h3>
              <span className="text-sm font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded">
                {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {session.room}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
