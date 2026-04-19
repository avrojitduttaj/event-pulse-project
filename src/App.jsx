import { useState } from 'react'
import { JoinEvent } from './pages/JoinEvent'
import { AttendeeDashboard } from './pages/AttendeeDashboard'
import { SpeakerDashboard } from './pages/SpeakerDashboard'
import { ModeSwitch, LoadingPulse } from './components/shared'

function App() {
  const [mode, setMode] = useState('attendee')
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)

  const eventData = {
    name: "NextGen AI Summit 2026",
    venue: "Mumbai Convention Centre",
    schedule: [
      { id: "s1", title: "Keynote: AI in 2026", room: "main-hall", startTime: Date.now() + 3600000 },
      { id: "s2", title: "Building with Gemini API", room: "room-a", startTime: Date.now() + 7200000 },
      { id: "s3", title: "React & Modern Systems", room: "room-b", startTime: Date.now() + 9000000 },
    ]
  }

  const handleJoin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setJoined(true)
    setLoading(false)
  }

  if (loading) return <LoadingPulse />
  if (!joined) return <JoinEvent onJoin={handleJoin} />

  return (
    <div className="app-container">
      <ModeSwitch currentMode={mode} setMode={setMode} />
      <div style={{ flex: 1 }}>
        {mode === 'attendee' && <AttendeeDashboard eventData={eventData} />}
        {mode === 'speaker' && <SpeakerDashboard session={eventData.schedule[0]} />}
      </div>
    </div>
  )
}

export default App