import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInAnonymouslyUser: () => Promise<any>;
  signOut: () => Promise<void>;
  setUserProfile: React.Dispatch<React.SetStateAction<any | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAdmin: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signInAnonymouslyUser: async () => {},
  signOut: async () => {},
  setUserProfile: () => {},
});

let inFlightGoogleSignIn: Promise<any> | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Process redirect result if page returned from a redirect sign-in flow
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          try {
            const userDocRef = doc(db, 'users', result.user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
              const names = result.user.displayName ? result.user.displayName.split(' ') : ['Google', 'User'];
              const newProfile = {
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                isEmployee: false,
                location: '',
                email: result.user.email,
                photoURL: result.user.photoURL,
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (profileErr) {
            console.warn("Could not sync profile from redirect sign-in:", profileErr);
          }
        }
      })
      .catch((err) => {
        if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
          console.warn("Redirect sign-in notice:", err?.message || err);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'optiminds2026@gmail.com');
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          console.warn("User profile fetch note:", e);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    // Prevent duplicate concurrent requests which cause auth/cancelled-popup-request
    if (inFlightGoogleSignIn) {
      return inFlightGoogleSignIn;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Calling signInWithPopup synchronously here preserves the browser's user activation token!
    let popupPromise: Promise<any>;
    try {
      popupPromise = signInWithPopup(auth, provider);
    } catch (immediateErr: any) {
      popupPromise = Promise.reject(immediateErr);
    }

    inFlightGoogleSignIn = popupPromise
      .then(async (result) => {
        if (result && result.user) {
          try {
            const userDocRef = doc(db, 'users', result.user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
              const names = result.user.displayName ? result.user.displayName.split(' ') : ['Google', 'User'];
              const newProfile = {
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                isEmployee: false,
                location: '',
                email: result.user.email,
                photoURL: result.user.photoURL,
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (dbErr) {
            console.warn("Could not sync user profile to firestore:", dbErr);
          }
        }
        return result;
      })
      .catch(async (popupErr: any) => {
        // If popup is blocked and we are NOT in an iframe, try fallback redirect
        if (popupErr?.code === 'auth/popup-blocked' && typeof window !== 'undefined' && window.self === window.top) {
          try {
            await signInWithRedirect(auth, provider);
            return null;
          } catch (redirectErr) {
            console.warn("Redirect sign-in fallback notice:", redirectErr);
          }
        }
        throw popupErr;
      })
      .finally(() => {
        inFlightGoogleSignIn = null;
      });

    return inFlightGoogleSignIn;
  };

  const signInAnonymouslyUser = () => {
    return signInAnonymously(auth);
  };

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, loading, signIn, signUp, signInWithGoogle, signInAnonymouslyUser, signOut, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
