// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "flashcardsaas-404d7.firebaseapp.com",
  projectId: "flashcardsaas-404d7",
  storageBucket: "flashcardsaas-404d7.appspot.com",
  messagingSenderId: "699525519846",
  appId: "1:699525519846:web:e6941ac10b20c338a1de27",
  measurementId: "G-TKK2PDRR3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
