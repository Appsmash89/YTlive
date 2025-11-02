'use client';

import { useState, useEffect } from 'react';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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
    const { app } = initializeFirebase();
    const auth = getAuth(app);
    const firestore = getFirestore(app);

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
