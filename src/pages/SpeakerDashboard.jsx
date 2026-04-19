import { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';

export const SpeakerDashboard = ({ session }) => {
  const { questions, sentiment, submitQuestion, upvoteQuestion } = useQuestions(session?.id || 'live-session');
  const [inputText, setInputText] = useState('');

  const sentimentSentence =
    sentiment === 'positive' ? 'Positive & Engaged' :
    sentiment === 'curious'  ? 'Curious & Searching' :
    sentiment === 'frustrated' ? 'Frustrated / High Friction' : 'Neutral / Listening';

  const sentimentColor =
    sentiment === 'positive' ? 'var(--green)' :
    sentiment === 'curious'  ? 'var(--accent)' :
    sentiment === 'frustrated' ? 'var(--red)' : 'var(--text-secondary)';

  const sentimentWidths = {
    curious:    sentiment === 'curious'    ? '72%' : '28%',
    positive:   sentiment === 'positive'   ? '68%' : '18%',
    neutral:    sentiment === 'neutral'    ? '65%' : '32%',
    frustrated: sentiment === 'frustrated' ? '55%' : '8%',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    submitQuestion(inputText, 'demo-user');
    setInputText('');
  };

  const tagColor = (cluster) => {
    if (!cluster) return {};
    const c = cluster.toLowerCase();
    if (c === 'technical') return { background: '#00b4ff18', color: '#00b4ff', border: '1px solid #00b4ff33' };
    if (c === 'career')    return { background: '#7c3aed18', color: '#a78bfa', border: '1px solid #7c3aed33' };
    if (c === 'ethics')    return { background: '#f59e0b18', color: '#fbbf24', border: '1px solid #f59e0b33' };
    return { background: '#ffffff10', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
  };

  return (
    <div className="dashboard-content mt-4">

      {/* Mood card */}
      <div className="card mb-4" style={{ borderColor: sentimentColor }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '4px', letterSpacing: '0.05em' }}>
          AUDIENCE MOOD — GEMINI ANALYSIS
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 500, color: sentimentColor }}>
          {sentimentSentence}
        </div>
      </div>

      {/* Submit a question (for demo — attendee perspective) */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type an audience question and hit Enter..."
          style={{
            flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
            borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)',
            fontSize: '13px', outline: 'none'
          }}
        />
        <button type="submit" style={{
          background: 'var(--accent)', color: '#0a0d14', border: 'none',
          borderRadius: '8px', padding: '10px 18px', fontWeight: 500,
          fontSize: '13px', cursor: 'pointer'
        }}>
          Submit
        </button>
      </form>

      <div className="section-title">TOP QUESTIONS — RANKED BY GEMINI + VOTES</div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        {questions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Waiting for audience questions...
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className={`question-item ${idx % 2 !== 0 ? 'raised' : ''}`}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px',
                       borderBottom: '1px solid var(--border)', transition: 'all 0.3s ease' }}>
              <div className="question-rank" style={{
                width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 500, marginTop: '2px',
                background: idx === 0 ? 'var(--accent)' : 'transparent',
                color: idx === 0 ? '#0a0d14' : 'var(--text-secondary)',
                border: idx === 0 ? 'none' : '1px solid var(--border)',
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '6px' }}>
                  {q.text}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {q.clusterId && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500, ...tagColor(q.clusterId) }}>
                      {q.clusterId}
                    </span>
                  )}
                  <button onClick={() => upvoteQuestion(q.id)} style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '20px', padding: '2px 10px', fontSize: '11px',
                    color: 'var(--text-secondary)', cursor: 'pointer'
                  }}>
                    ▲ {q.votes}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="section-title">REALTIME AI SENTIMENT BREAKDOWN</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
        {[
          { label: 'Curious',    key: 'curious',    color: 'var(--accent)' },
          { label: 'Positive',   key: 'positive',   color: 'var(--green)'  },
          { label: 'Neutral',    key: 'neutral',    color: 'var(--text-muted)' },
          { label: 'Frustrated', key: 'frustrated', color: 'var(--red)'    },
        ].map(({ label, key, color }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '72px' }}>{label}</span>
            <div style={{ flex: 1, height: '6px', background: 'var(--bg-raised)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '3px', background: color,
                            width: sentimentWidths[key], transition: 'width 0.7s ease' }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
