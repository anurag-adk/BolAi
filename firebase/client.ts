// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvx8rIvXxhVRuQ-UdMxlcojiym-zas6qo",
  authDomain: "bolai404.firebaseapp.com",
  projectId: "bolai404",
  storageBucket: "bolai404.firebasestorage.app",
  messagingSenderId: "566717233995",
  appId: "1:566717233995:web:b7eb3e3c0281ee19b706ce",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
