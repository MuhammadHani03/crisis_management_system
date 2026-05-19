// Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCCJxTKvYSH5loKRPZ9mHVsDW3d3kSy27k",
  authDomain: "crisis-management-app-be116.firebaseapp.com",
  projectId: "crisis-management-app-be116",
  storageBucket: "crisis-management-app-be116.firebasestorage.app",
  messagingSenderId: "59935259232",
  appId: "1:59935259232:web:2cb96f7fc9d253d04de105",
  measurementId: "G-8L2FQR7C3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// AUTH (THIS WAS MISSING)
export const auth = getAuth(app);

// Analytics (optional, safe to keep)
const analytics = getAnalytics(app);

export default app;