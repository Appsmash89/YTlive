'use client';

import { useState, useEffect } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

/**
 * A client-side component that initializes Firebase and provides it to the app.
 *
 * This component ensures that Firebase is initialized only once on the client.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    // initializeFirebase now returns all necessary instances
    const { app, auth, firestore } = initializeFirebase();
    setFirebase({ app, auth, firestore });
  }, []);

  if (!firebase) {
    // You can show a loading spinner here if you want.
    // For now, we'll just return null.
    return null;
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
