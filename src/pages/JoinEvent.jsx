import { useState } from 'react';
import { QRScanner } from '../components/shared';

export const JoinEvent = ({ onJoin }) => {
  const [code, setCode] = useState("");

  return (
    <div className="flex-center app-container" style={{ position: 'relative' }}>
      <div className="join-modal" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center' }}>
           <h1 className="title-large text-accent">EventPulse</h1>
           <p className="text-secondary" style={{ fontSize: '1.125rem' }}>Dynamic AI Live Event Companion</p>
        </div>
        
        <div>
          <QRScanner onScan={(text) => onJoin(text)} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          <span className="section-title" style={{ margin: 0 }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            placeholder="Enter Event Code" 
            className="input-text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button 
             className="btn-primary"
             onClick={() => onJoin(code)}
          >
            Join
          </button>
        </div>
      </div>
      
      <div style={{
          position: 'absolute', 
          top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px', 
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
      }}></div>
    </div>
  );
};
