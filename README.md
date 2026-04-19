# EventPulse (Full-Stack Realtime Edition)

A fully functional, zero-placeholder real-time AI Q&A ranking platform. Built for the Google Antigravity Hackathon!

## Getting Started Locally

All logic has successfully been decoupled from Firebase limits. A secure, in-memory Node.js + Socket.io backend safely brokers API transactions directly with Gemini and pushes instant WebSocket broadcasts to the Vite React frontend!

1. Open `.env.local` and add: `VITE_GEMINI_KEY=YOUR_ACTUAL_KEY`. (There are no other required keys. The realtime DB runs fully locally).
2. Install all frontend and backend dependencies: `npm install`
3. Run both the backend and frontend simultaneously with: `npm run dev:all`
4. The dashboard will instantly be active on `http://localhost:5173`. Open it in two windows to watch real-time voting sync and Ai re-ranking!

## Features Delivered
- **Node.js Express + Socket.io Backend**: Fully handles real-time polling instantly out-of-the-box.
- **Gemini Ranked Question Sync**: Pushes an AI-based rank structure securely from the backend to the UI without exposing the LLM prompt paths.
- **Dynamic Frontend Mapping**: `SpeakerDashboard.jsx` and `QuestionFeed.jsx` are fully mapped to the `socket.on` streams.

## Deployment Steps

This project is now separated logically and ready for Vercel/Render!

**1. Deploy Backend (Render / Railway)**
- Configure your deployment platform to target the `/server` directory, or use `node server/index.js` as your start command.
- Inject `VITE_GEMINI_KEY` into your host's secure environment variables.
- Update `src/hooks/useQuestions.js` -> `io('YOUR_RENDER_URL')` before pushing!

**2. Deploy Frontend (Vercel)**
- Connect this exact Github repository to Vercel. 
- Leave framework preset to Vite. 
- It will automatically run `npm run build` and capture the `/dist` output.
