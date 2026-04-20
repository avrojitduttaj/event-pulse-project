# 🚀 EventPulse — Real-Time AI Q&A Platform

EventPulse is a **high-performance, full-stack real-time Q&A platform** built for the **Google Antigravity Hackathon**.

It solves the chaos of live event interactions by combining **low-latency WebSockets** with **Gemini-powered AI ranking**, ensuring the most relevant questions surface instantly.

---

## 🧠 The Core Idea

Traditional Q&A systems rely on upvotes → which leads to:

- 🚫 Popularity bias  
- 🚫 Spam/noise dominance  
- 🚫 Important questions getting buried  

### EventPulse changes the game by:

- Removing dependency on simple voting  
- Using **AI-driven ranking (Gemini)**  
- Delivering results in **real-time across all devices**

---

## ✨ Key Features

### ⚡ Real-Time Synchronization

- Built using **Socket.io**
- Instant updates across:
  - Attendee screens  
  - Speaker dashboards  
- Latency: **milliseconds**

---

### 🤖 AI-Powered Question Ranking

- Integrated with **Google Gemini 1.5 Flash**
- Ranks questions based on:
  - Context  
  - Relevance  
  - Depth  

> No more “loudest question wins”

---

### 🔄 Live Reactive UI

- Fully mapped components:
  - `SpeakerDashboard.jsx`
  - `QuestionFeed.jsx`

- Connected directly to:

```js
socket.on(...)
```

## 🧩 Zero-Placeholder Architecture

- No fake/mock layers  
- Everything is:
  - Real-time  
  - Functional  
  - Stream-based  

---

## 🚫 Firebase-Free Backend

- No dependency on BaaS  
- Fully controlled:
  - Lower latency  
  - Lower cost  
  - Better scalability  

---

## 🛠️ Tech Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React + Vite + Tailwind CSS |
| Backend    | Node.js + Express + Socket.io |
| AI Engine  | Google Gemini 1.5 Flash |
| State Mgmt | Custom Hooks (`useQuestions.js`) |

---

## 📂 Project Structure


```bash
event-pulse-project/
│
├── mocks/
│ └── fileMock.js
│
├── dist/
│ ├── assets/
│ ├── favicon.svg
│ ├── icons.svg
│ └── index.html
│
├── node_modules/
│
├── public/
│ ├── favicon.svg
│ └── icons.svg
│
├── server/
│ └── index.js # Express + Socket.io backend
│
├── src/
│ ├── tests/
│ │ ├── crowdScore.test.js
│ │ ├── formatQuestion.test.js
│ │ ├── gemini.test.js
│ │ ├── scheduleParser.test.js
│ │ └── utils.test.js
│ │
│ ├── assets/
│ │ ├── hero.png
│ │ ├── react.svg
│ │ └── vite.svg
│ │
│ ├── components/
│ │ ├── attendee/
│ │ │ ├── QuestionInput.jsx
│ │ │ ├── RecommendCard.jsx
│ │ │ └── ScheduleList.jsx
│ │ │
│ │ ├── map/
│ │ │ └── VenueMap.jsx
│ │ │
│ │ ├── shared/
│ │ │ └── index.jsx
│ │ │
│ │ └── speaker/
│ │ ├── QuestionCard.jsx
│ │ ├── QuestionFeed.jsx
│ │ └── SentimentBar.jsx
│ │
│ ├── hooks/
│ │ ├── useCrowd.js
│ │ ├── useEvent.js
│ │ ├── useQuestions.js
│ │ └── useRecommend.js
│ │
│ ├── pages/
│ │ ├── AttendeeDashboard.jsx
│ │ ├── JoinEvent.jsx
│ │ └── SpeakerDashboard.jsx
│ │
│ ├── services/
│ │ ├── firebase.js
│ │ ├── gemini.js
│ │ └── maps.js
│ │
│ ├── utils/
│ │ ├── crowdScore.js
│ │ ├── formatQuestion.js
│ │ ├── sanitize.js
│ │ └── scheduleParser.js
│ │
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
│
├── .env.local
├── .gitignore
├── babel.config.cjs
├── eslint.config.js
├── firebase.json
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```
---

## 💻 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/avrojitduttaj/event-pulse-project.git
cd event-pulse-project
```

## 📦 Installation & Setup

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a .env.local file:

```bash
VITE_GEMINI_KEY=YOUR_ACTUAL_KEY
```

### 4️⃣ Run the App

```bash
npm run dev:all
```

### 🌐 Access the App

```bash
http://localhost:5173
```

💡 Pro Tip: <br>
Open two browser windows side-by-side to see real-time syncing + AI re-ranking live.

---

## 🌍 Deployment Guide


### 🔹 Backend (Render / Railway)

Directory: /server

Start Command:

```bash
node server/index.js
```

Environment Variable:

```bash
VITE_GEMINI_KEY=YOUR_KEY
```

### 🔹 Frontend (Vercel)

Framework: Vite

Build Command:

```bash
npm run build
```

Output Directory:

```bash
/dist
```
---

## ⚠️ Critical Step

Update backend URL in:

```bash
src/hooks/useQuestions.js
io('https://your-backend-url.com')
```

---

## 🔐 Architecture Overview

```bash
Client (React)
   ⇅ WebSockets (Socket.io)
Node.js Server (Broker Layer)
   ⇅
Google Gemini API
```

✔ Client never directly accesses Gemini <br>
✔ Backend protects prompts & logic <br>
✔ Real-time broadcasts to all users <br>

---

## 🎯 Why EventPulse Matters

EventPulse is not just another Q&A tool.

It represents a shift toward:

🧠 AI-moderated conversations <br>
⚡ Instant collaborative experiences <br>
🎤 Smarter live events <br>
🧪 Future Improvements <br>
🎙️ Voice-based question input <br>
🌍 Multi-language AI ranking <br>
📊 Speaker analytics dashboard <br>
🔐 Auth + role-based access <br>
☁️ Scalable distributed socket clusters <br>

---

## 👨‍💻 Author

### Avrojit Dutta
Built for Google Antigravity Hackathon

---

## ⭐ Support

If you found this project useful:

⭐ Star the repo <br>
🍴 Fork it <br>
🚀 Share it <br>
