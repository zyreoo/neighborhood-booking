'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with name
            await updateProfile(user, {
                displayName: name
            });

            // Store additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return user;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            
            // Store additional user data in Firestore if it's a new user
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: userCredential.user.displayName,
                email: userCredential.user.email,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, { merge: true });

            return userCredential.user;
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signUp,
            signIn,
            signInWithGoogle,
            signOut
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 