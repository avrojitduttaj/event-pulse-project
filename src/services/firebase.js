import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, off, runTransaction } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const __isMock = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_");

let app, database, auth;
const mockState = {
  'crowd/room-a': { density: 0.1, count: 50 },
  'crowd/room-b': { density: 0.9, count: 400 },
  'crowd/main-hall': { density: 0.4, count: 200 }
};

const mockQuestions = {};

if (!__isMock) {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
} else {
  console.warn("Using Mock Firebase DB");
  auth = { signInAnonymously: async () => ({ user: { uid: 'mock-usr-' + Date.now() } }) };
  database = {};
}

export const subscribeToPath = (path, callback) => {
  if (__isMock) {
    if (path.includes('crowd')) {
      callback({ val: () => mockState[path] ? mockState[path] : { density: 0.5, count: 100 } });
      return () => {};
    }
    if (path.includes('questions')) {
      const parts = path.split('/');
      const sessionId = parts[parts.length - 1];
      callback({ val: () => mockQuestions[sessionId] || {} });
      return () => {};
    }
    callback({ val: () => null });
    return () => {};
  }
  
  const dbRef = ref(database, path);
  const unsubscribe = onValue(dbRef, callback);
  return () => off(dbRef, 'value', unsubscribe);
};

export const pushToPath = async (path, data) => {
  if (__isMock) {
    if (path.includes('questions')) {
      const parts = path.split('/');
      const sessionId = parts[parts.length - 1];
      if (!mockQuestions[sessionId]) mockQuestions[sessionId] = {};
      const newId = 'q-' + Date.now();
      mockQuestions[sessionId][newId] = data;
      return { key: newId };
    }
    return { key: 'mock-key' };
  }
  
  const dbRef = ref(database, path);
  const newRef = push(dbRef);
  await set(newRef, data);
  return newRef;
};

export const updateTransaction = async (path, updateFn) => {
  if (__isMock) {
    // Basic mock transaction logic
    return { committed: true };
  }
  const dbRef = ref(database, path);
  return await runTransaction(dbRef, updateFn);
};

export const signIn = async () => {
  if (__isMock) return auth.signInAnonymously();
  return await signInAnonymously(auth);
};
