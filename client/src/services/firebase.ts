/**
 * AUTOSURE — Firebase Client SDK Initialization
 *
 * All config values are read from environment variables (prefixed VITE_).
 * This file exports initialized service instances — never credentials.
 *
 * IMPORTANT: The Firebase project used here (VITE_FIREBASE_PROJECT_ID) MUST
 * match the Firebase Admin SDK project on the server (FIREBASE_PROJECT_ID).
 * Mismatched projects will cause all ID token verifications to fail.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from 'firebase/storage';

// ─── Config ───────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Guard: ensure we don't re-initialize in HMR
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

// ─── Service Instances ────────────────────────────────────────

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// ─── Persistence ──────────────────────────────────────────────
// Explicitly set to browserLocalPersistence so the user stays logged in
// after page refreshes and new browser tabs. This is the default in browsers
// but we set it explicitly for clarity and to guarantee the behaviour.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('[Firebase] Failed to set auth persistence:', err);
});

// ─── Emulator Support (development only) ─────────────────────

if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.info('[Firebase] Using local emulators');
}

export default app;
