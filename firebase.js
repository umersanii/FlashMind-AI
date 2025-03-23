// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "flashmind-ai.firebaseapp.com",
  projectId: "flashmind-ai",
  storageBucket: "flashmind-ai.firebasestorage.app",
  messagingSenderId: "813603668378",
  appId: "1:813603668378:web:06ced32b30dc5983d53a23",
  measurementId: "G-8L20QM2RVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
