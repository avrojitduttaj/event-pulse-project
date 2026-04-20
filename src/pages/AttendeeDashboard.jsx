import { useState, useEffect, useCallback } from 'react';
import { getRecommendation } from '../services/gemini';
import { crowdToWeight, weightToColor, getCrowdLabel } from '../utils/crowdScore';

const ZONES = [
  { id: 'room-a',     name: 'Hall A',      base: 34 },
  { id: 'room-b',     name: 'Hall B',      base: 91 },
  { id: 'main-hall',  name: 'Hall C',      base: 38 },
  { id: 'workshop-1', name: 'Workshop 1',  base: 67 },
  { id: 'workshop-2', name: 'Workshop 2',  base: 22 },
  { id: 'keynote',    name: 'Keynote',     base: 74 },
];

const jitter = (val) =>
  Math.min(99, Math.max(1, val + Math.floor((Math.random() - 0.5) * 8)));

export const AttendeeDashboard = ({ eventData }) => {
  const [zones, setZones] = useState(ZONES.map(z => ({ ...z, count: z.base })));
  const [attendees, setAttendees] = useState(1847);
  const [questionCount, setQuestionCount] = useState(247);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(true);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(z => ({ ...z, count: jitter(z.count) })));
      setAttendees(prev => prev + Math.floor(Math.random() * 5));
      setQuestionCount(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchRec = useCallback(async () => {
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
      setLiveAnnouncement(
        `Gemini recommends: ${rec?.reason || 'Go to the least crowded room'}`
      );
    } catch (e) {
      setRecommendation({
        reason: 'Hall C is comfortable right now',
        walkMinutes: 3,
        urgency: 'now'
      });
    } finally {
      setLoadingRec(false);
    }
  }, [zones, eventData]);

  useEffect(() => {
    fetchRec();
    const interval = setInterval(fetchRec, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const bestZone = [...zones].sort((a, b) => a.count - b.count)[0];

  return (
    <section
      className="dashboard-content mt-4"
      aria-label="Attendee dashboard"
    >
      {/* Screen reader live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {liveAnnouncement}
      </div>

      {/* Metrics */}
      <div className="metrics-grid mb-4" role="list" aria-label="Event statistics">
        {[
          { title: 'Attendees', value: attendees.toLocaleString(), sub: 'live count', color: 'text-green' },
          { title: 'Active sessions', value: eventData?.schedule?.length || 8, sub: 'across venue', color: 'text-accent' },
          { title: 'Questions live', value: questionCount, sub: 'updating live', color: 'text-green' },
          { title: 'Best room', value: bestZone.name, sub: `${bestZone.count}% full · go now`, color: 'text-green' },
        ].map(({ title, value, sub, color }) => (
          <article key={title} className="card metric-card" role="listitem">
            <span className="metric-title">{title}</span>
            <span className="metric-value" aria-label={`${title}: ${value}`}>{value}</span>
            <span className={`metric-change ${color}`} aria-label={sub}>{sub}</span>
          </article>
        ))}
      </div>

      {/* Gemini Recommendation */}
      <div
        className="card mb-4"
        style={{ borderColor: 'var(--border-bright)' }}
        role="region"
        aria-label="Gemini AI recommendation"
        aria-live="polite"
      >
        <div className="gemini-badge" aria-hidden="true">GEMINI RECOMMENDS</div>
        {loadingRec ? (
          <div
            style={{ color: 'var(--text-secondary)', fontSize: '13px' }}
            aria-label="Loading Gemini recommendation"
            role="status"
          >
            Gemini is thinking...
          </div>
        ) : (
          <div className="event-recommendation">
            <div className="event-title">
              {eventData?.schedule?.[0]?.title || 'Building with Gemini API'}
            </div>
            <div className="event-meta" style={{ color: 'var(--text-secondary)' }}>
              <span aria-label={`Location: ${bestZone.name}`}>{bestZone.name}</span>
              <span aria-label={`Walking time: ${recommendation?.walkMinutes || 3} minutes`}>
                {recommendation?.walkMinutes || 3} min walk
              </span>
              <span
                style={{ color: recommendation?.urgency === 'now' ? 'var(--green)' : 'var(--amber)' }}
                aria-label={`Urgency: ${recommendation?.urgency || 'soon'}`}
              >
                {recommendation?.urgency?.toUpperCase() || 'SOON'}
              </span>
            </div>
            <div className="mt-2" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {recommendation?.reason || 'Comfortable and starting soon'}
            </div>
            <div
              className={`status-capsule ${getCrowdLabel(bestZone.count)} mt-2`}
              aria-label={`Room status: ${getCrowdLabel(bestZone.count)}`}
            >
              {bestZone.count}% full · {getCrowdLabel(bestZone.count)}
            </div>
          </div>
        )}
      </div>

      {/* Crowd Density */}
      <h2 className="section-title" id="crowd-density-heading">
        Crowd density — live
      </h2>
      <div
        className="metrics-grid"
        style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}
        role="list"
        aria-labelledby="crowd-density-heading"
      >
        {zones.map(zone => {
          const color = weightToColor(zone.count / 100);
          const label = getCrowdLabel(zone.count);
          return (
            <article
              key={zone.id}
              className="card density-card"
              role="listitem"
              aria-label={`${zone.name}: ${zone.count}% full, ${label}`}
              style={
                zone.count > 75 ? { background: '#1f0f14', borderColor: '#4a1525' } :
                zone.count > 50 ? { background: '#1c1a10', borderColor: '#3d3010' } : {}
              }
            >
              <span className="density-title" style={{ color }}>{zone.name}</span>
              <span className="density-value" aria-hidden="true">{zone.count}%</span>
              <div
                className="density-bar"
                role="progressbar"
                aria-valuenow={zone.count}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${zone.name} capacity`}
                style={{ width: `${zone.count}%`, backgroundColor: color, transition: 'width 1s ease' }}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
};