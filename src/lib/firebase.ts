import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Use custom firestoreDatabaseId if provided, or default
export const db = config.firestoreDatabaseId
  ? initializeFirestore(app, {}, config.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export async function ensureAuthUser(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn('Firebase anonymous sign in warning:', error);
    return null;
  }
}
