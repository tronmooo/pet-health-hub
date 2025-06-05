// Firebase configuration for Pet Health Hub
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

// Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyCBSKzd8I77mtb8wQOh0tTdNzHVe9Pf9D8",
  authDomain: "kklll-40a3c.firebaseapp.com",
  projectId: "kklll-40a3c",
  storageBucket: "kklll-40a3c.firebasestorage.app",
  messagingSenderId: "616008431559",
  appId: "1:616008431559:web:7855e1e7f8d6ebf78f8be2",
  measurementId: "G-5Q51978C6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);

export { app, analytics, functions };
export default app;
