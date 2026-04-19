import { useState } from 'react';
import { useQuestions } from '../../hooks/useQuestions';

export const QuestionInput = ({ sessionId, uid }) => {
  const [text, setText] = useState("");
  const { submitQuestion } = useQuestions(sessionId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await submitQuestion(text, uid);
    setText("");
    // Give some instant feedback
    const btn = document.getElementById('submit-q');
    if(btn) {
      btn.innerHTML = "Sent!";
      setTimeout(() => btn.innerHTML = "Ask", 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input 
        aria-label="Ask a question"
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a question for the speaker..." 
        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
      />
      <button 
        id="submit-q"
        type="submit"
        disabled={!text.trim()}
        className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Ask
      </button>
    </form>
  );
};
