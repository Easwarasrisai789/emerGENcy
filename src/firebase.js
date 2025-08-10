// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY5-qkTZa84Xg4_kQNLWMdCriql5rtPo8",
  authDomain: "emergency-6fef1.firebaseapp.com",
  projectId: "emergency-6fef1",
  storageBucket: "emergency-6fef1.appspot.com",
  messagingSenderId: "706251688953",
  appId: "1:706251688953:web:5aaff2f24b18d379b88b28",
  measurementId: "G-7B4EBSRCHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Analytics (optional)
export let analytics = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});
