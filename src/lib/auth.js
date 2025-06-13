'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, name, phoneNumber) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with name
    await updateProfile(user, { displayName: name });

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      phoneNumber,
      phoneNumberLastFour: phoneNumber.slice(-4),
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return user;
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const initiatePasswordReset = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const verifyPhoneAndResetPassword = async (phoneLastFour, email) => {
    try {
      const userQuery = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userQuery);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      if (userData.phoneNumberLastFour !== phoneLastFour) {
        throw new Error('Invalid phone number verification');
      }

      return initiatePasswordReset(email);
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData,
      loading, 
      signIn, 
      signUp, 
      signOut,
      initiatePasswordReset,
      verifyPhoneAndResetPassword,
      isAdmin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 