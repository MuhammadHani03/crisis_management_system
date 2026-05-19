// Firebase configuration
// Replace these values with your own from Firebase Console
// https://console.firebase.google.com

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
