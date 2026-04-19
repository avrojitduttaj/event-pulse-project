import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const QRScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const internalScanner = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    // Add small delay to ensure DOM is ready and StrictMode remount issues are bypassed
    const initTimer = setTimeout(() => {
      if (!isMounted) return;
      if (!document.getElementById("qr-reader")) return;
      
      try {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: {width: 250, height: 250} },
          false
        );
        internalScanner.current = scanner;
        
        scanner.render(
          (decodedText) => {
            if (internalScanner.current) {
              internalScanner.current.clear().catch(e => console.warn(e));
            }
            onScan(decodedText);
          },
          (error) => {}
        );
      } catch(e) {
        console.warn("Scanner Init Error:", e);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (internalScanner.current) {
        internalScanner.current.clear().catch(e => console.warn("Failed to clear scanner", e));
        internalScanner.current = null;
      }
    };
  }, [onScan]);

  return <div id="qr-reader" className="card mt-4 mb-4" style={{border: '1px solid var(--border)', maxWidth: '400px', margin: '0 auto'}}></div>;
};

export const LoadingPulse = () => (
  <div className="flex-center app-container">
    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
      <div className="live-dot text-accent" style={{animationDelay: '0ms'}}></div>
      <div className="live-dot text-accent" style={{animationDelay: '200ms'}}></div>
      <div className="live-dot text-accent" style={{animationDelay: '400ms'}}></div>
    </div>
  </div>
);

export const ModeSwitch = ({ currentMode, setMode }) => {
  return (
    <div className="top-nav">
      <div className="logo-container">
        <div className="logo-dot"></div>
        <span>EventPulse</span>
      </div>
      <div className="tabs-container" style={{padding: 0}}>
        <button 
          onClick={() => setMode('attendee')}
          className={`tab-btn ${currentMode === 'attendee' ? 'active' : ''}`}
        >
          Attendee view
        </button>
        <button 
          onClick={() => setMode('speaker')}
          className={`tab-btn ${currentMode === 'speaker' ? 'active' : ''}`}
        >
          Speaker view
        </button>
        <button className="tab-btn">Color tokens</button>
      </div>
      <div className="nav-right">
        <span>Google I/O Extended Mumbai 2025</span>
        <div className="live-badge">
          <div className="live-dot"></div> Live
        </div>
      </div>
    </div>
  );
};
