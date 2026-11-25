/**
 * MediAccess Firebase Configuration
 * Configured with project details from Firebase Console:
 * Project Name: medical access
 * Project ID: medical-access-1f08e
 * Project Number / Sender ID: 408826039583
 * Support Email: durga.kdm16@gmail.com
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForMedicalAccess1f08e",
  authDomain: "medical-access-1f08e.firebaseapp.com",
  projectId: "medical-access-1f08e",
  storageBucket: "medical-access-1f08e.firebasestorage.app",
  messagingSenderId: "408826039583",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:408826039583:web:medicalaccessapp",
};

// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const firebaseProjectDetails = {
  projectName: "medical access",
  projectId: "medical-access-1f08e",
  projectNumber: "408826039583",
  supportEmail: "durga.kdm16@gmail.com",
  authDomain: "medical-access-1f08e.firebaseapp.com",
  storageBucket: "medical-access-1f08e.firebasestorage.app",
};
