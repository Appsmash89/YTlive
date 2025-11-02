
'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

/**
 * The props for the FirebaseProvider component.
 */
interface FirebaseProviderProps {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * The context for the Firebase provider.
 */
const FirebaseContext = createContext<{
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null>(null);

/**
 * A component that provides the Firebase app, auth, and firestore instances to its children.
 */
export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * A hook that returns the Firebase app, auth, and firestore instances.
 *
 * This hook should be used within a FirebaseProvider.
 *
 * @example
 * const { app, auth, firestore } = useFirebase();
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return context;
}

/**
 * A hook that returns the Firebase app instance.
 *
 * This hook should be used within a FirebaseProvider.
 *
 * @example
 * const app = useFirebaseApp();
 */
export function useFirebaseApp() {
  const { app } = useFirebase();
  return app;
}

/**
 * A hook that returns the Firebase auth instance.
 *
 * This hook should be used within a FirebaseProvider.
 *
 * @example
 * const auth = useAuth();
 */
export function useAuth() {
  const { auth } = useFirebase();
  return auth;
}

/**
 * A hook that returns the Firebase firestore instance.
 *
 * This hook should be used within a FirebaseProvider.
 *
 * @example
 * const firestore = useFirestore();
 */
export function useFirestore() {
  const { firestore } = useFirebase();
  return firestore;
}
