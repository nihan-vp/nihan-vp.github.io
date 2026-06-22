import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';

// Graceful fallback config. Users can configure this later with environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCH39gVFkSjVFV3glDj9lHPYj_9-BV1Xso",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-205ec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-205ec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-205ec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "990014906325",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:990014906325:web:1b2f39cda99f341298275c"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, orderBy, query };
