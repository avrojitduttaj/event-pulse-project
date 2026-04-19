import { useQuestions } from '../../hooks/useQuestions';
import { QuestionCard } from './QuestionCard';

export const QuestionFeed = ({ sessionId }) => {
  // Sockets handles everything in real time!
  const { questions } = useQuestions(sessionId);

  if (!questions || questions.length === 0) {
    return <div className="text-center py-12 text-gray-500 italic border border-dashed border-white/10 rounded-xl">No questions yet. Your audience is mesmerized.</div>;
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-white">Top Questions</h2>
        <span className="text-sm text-teal-400 flex items-center gap-1">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div> Live
        </span>
      </div>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard key={q.id} question={q} index={idx} />
        ))}
      </div>
    </div>
  );
};
