import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

// Firebase configuration
// These values should be set via environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let database: Database | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      // Check if config is valid
      if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
        throw new Error(
          'Firebase configuration is missing. Please set VITE_FIREBASE_API_KEY and VITE_FIREBASE_DATABASE_URL environment variables.'
        );
      }
      app = initializeApp(firebaseConfig);
    }
  }
  return app;
}

export function getFirebaseDatabase(): Database {
  if (!database) {
    const app = getFirebaseApp();
    database = getDatabase(app);
  }
  return database;
}
