import { initializeApp, getApps, getApp } from 'firebase/app';  // firebase app imports
import { getAuth } from 'firebase/auth';  // firebase auth import
import { getFirestore } from 'firebase/firestore';  // firebase firestore import
import { getStorage } from 'firebase/storage';  // firebase storage import

// firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initialize firebase app (reuse if already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);  // initialize auth
const db = getFirestore(app);  // initialize firestore
const storage = getStorage(app);  // initialize storage

export { app, auth, db, storage };  // export firebase services
