// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcj0z-H3pJWYD7XtWGoNUxRWNgTL5WEBY",
  authDomain: "bolai---interview-platfo-b104d.firebaseapp.com",
  projectId: "bolai---interview-platfo-b104d",
  storageBucket: "bolai---interview-platfo-b104d.firebasestorage.app",
  messagingSenderId: "1092253816274",
  appId: "1:1092253816274:web:422f290cd3284788a9240b",
  measurementId: "G-EM8GNFG16F",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
