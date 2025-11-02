
'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase and returns the app instance.
 *
 * This function ensures that Firebase is initialized only once.
 */
export function initializeFirebase(): { app: FirebaseApp } {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  return { app };
}

export * from './provider';
