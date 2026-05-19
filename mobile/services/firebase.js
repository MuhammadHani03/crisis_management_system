// Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// AUTH (THIS WAS MISSING)
export const auth = getAuth(app);

// Analytics (optional, safe to keep)
const analytics = getAnalytics(app);

export default app;