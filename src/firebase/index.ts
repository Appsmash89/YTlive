
'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

/**
 * Initializes Firebase and returns the app, auth, and firestore instances.
 *
 * This function ensures that Firebase is initialized only once.
 */
export function initializeFirebase(): { app: FirebaseApp, auth: Auth, firestore: Firestore } {
  const firebaseConfig = getFirebaseConfig();
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export * from './provider';
