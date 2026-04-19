import { useState, useEffect } from 'react';
import { getRecommendation, getSentiment } from '../services/gemini';

const ZONES = [
  { id: 'room-a', name: 'Hall A', base: 34 },
  { id: 'room-b', name: 'Hall B', base: 91 },
  { id: 'main-hall', name: 'Hall C', base: 38 },
  { id: 'workshop-1', name: 'Workshop 1', base: 67 },
  { id: 'workshop-2', name: 'Workshop 2', base: 22 },
  { id: 'keynote', name: 'Keynote', base: 74 },
];

const jitter = (val) => Math.min(99, Math.max(1, val + Math.floor((Math.random()-0.5)*8)));
const colorFor = (v) => v > 75 ? 'var(--red)' : v > 50 ? 'var(--amber)' : 'var(--green)';

export const AttendeeDashboard = ({ user, eventData }) => {
  const [zones, setZones] = useState(ZONES.map(z => ({ ...z, count: z.base })));
  const [attendees, setAttendees] = useState(1847);
  const [questions, setQuestions] = useState(247);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(true);

  // Simulate live crowd updates every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(z => ({ ...z, count: jitter(z.count) })));
      setAttendees(prev => prev + Math.floor(Math.random() * 5));
      setQuestions(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Call real Gemini for recommendation
  useEffect(() => {
    const fetchRec = async () => {
      setLoadingRec(true);
      try {
        const crowdMap = {};
        zones.forEach(z => { crowdMap[z.id] = z.count; });
        const rec = await getRecommendation({
          time: new Date().toLocaleTimeString(),
          zone: 'entrance',
          sessions: eventData?.schedule || [],
          crowd: crowdMap,
        });
        setRecommendation(rec);
      } catch(e) {
        setRecommendation({ reason: 'Hall C is comfortable right now', walkMinutes: 3, urgency: 'now' });
      } finally {
        setLoadingRec(false);
      }
    };
    fetchRec();
    const interval = setInterval(fetchRec, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const bestZone = [...zones].sort((a,b) => a.count - b.count)[0];

  return (
    <div className="dashboard-content mt-4">
      <div className="metrics-grid mb-4">
        <div className="card metric-card">
          <span className="metric-title">Attendees</span>
          <span className="metric-value">{attendees.toLocaleString()}</span>
          <span className="metric-change text-green">live count</span>
        </div>
        <div className="card metric-card">
          <span className="metric-title">Active sessions</span>
          <span className="metric-value">{eventData?.schedule?.length || 8}</span>
          <span className="metric-change text-accent">across venue</span>
        </div>
        <div className="card metric-card">
          <span className="metric-title">Questions live</span>
          <span className="metric-value">{questions}</span>
          <span className="metric-change text-green">updating live</span>
        </div>
        <div className="card metric-card">
          <span className="metric-title">Best room</span>
          <span className="metric-value" style={{fontSize:'16px'}}>{bestZone.name}</span>
          <span className="metric-change text-green">{bestZone.count}% full · go now</span>
        </div>
      </div>

      <div className="card mb-4" style={{borderColor:'var(--border-bright)'}}>
        <div className="gemini-badge">GEMINI RECOMMENDS</div>
        {loadingRec ? (
          <div style={{color:'var(--text-secondary)',fontSize:'13px'}}>Gemini is thinking...</div>
        ) : (
          <div className="event-recommendation">
            <div className="event-title">
              {eventData?.schedule?.[0]?.title || 'Building with Gemini API'}
            </div>
            <div className="event-meta" style={{color:'var(--text-secondary)'}}>
              <span>{bestZone.name}</span>
              <span>{recommendation?.walkMinutes || 3} min walk</span>
              <span style={{color: recommendation?.urgency==='now' ? 'var(--green)' : 'var(--amber)'}}>
                {recommendation?.urgency?.toUpperCase() || 'SOON'}
              </span>
            </div>
            <div className="mt-2" style={{fontSize:'13px',color:'var(--text-secondary)'}}>
              {recommendation?.reason || 'Comfortable and starting soon'}
            </div>
            <div className="status-capsule comfortable mt-2">
              {bestZone.count}% full · comfortable
            </div>
          </div>
        )}
      </div>

      <div className="section-title">CROWD DENSITY — LIVE</div>
      <div className="metrics-grid" style={{gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
        {zones.map(zone => (
          <div className="card density-card" key={zone.id}
            style={zone.count > 75 ? {background:'#1f0f14',borderColor:'#4a1525'} :
                   zone.count > 50 ? {background:'#1c1a10',borderColor:'#3d3010'} : {}}>
            <span className="density-title" style={{color: colorFor(zone.count)}}>{zone.name}</span>
            <span className="density-value">{zone.count}%</span>
            <div className="density-bar" style={{width:`${zone.count}%`, backgroundColor: colorFor(zone.count), transition:'width 1s ease'}}></div>
          </div>
        ))}
      </div>
    </div>
  );
};