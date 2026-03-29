import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return null;
  }
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn("Firebase Client API Key is missing.");
    return null;
  }

  try {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return null;
  }
}

// Initialize components safely
const app = getFirebaseApp();
const auth = app ? getAuth(app) : null as unknown as Auth;
const db = app ? getFirestore(app) : null as unknown as Firestore;

export { app, auth, db };
