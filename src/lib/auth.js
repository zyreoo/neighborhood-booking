'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    getAuth
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth as firebaseAuth, db } from './firebase';
import { useRouter } from 'next/navigation';

console.log('🔐 [Auth] Module initialized');

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.error('🔐 [Auth] useAuth must be used within an AuthProvider');
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    console.log('🔐 [Auth] Provider initializing');
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const router = useRouter();

    const handleAuthStateChange = useCallback(async (user) => {
        console.log('🔐 [Auth] Auth state changed:', user ? 'User present' : 'No user');
        
        if (user) {
            setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            });
            
            // Store auth state in sessionStorage
            sessionStorage.setItem('authUser', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            }));
            
            console.log('🔐 [Auth] User state updated and stored');
        } else {
            setUser(null);
            sessionStorage.removeItem('authUser');
            console.log('🔐 [Auth] User state cleared');
        }
        
        setLoading(false);
    }, []);

    // Initialize auth state from session storage
    useEffect(() => {
        console.log('🔐 [Auth] Initializing from session storage');
        const storedUser = sessionStorage.getItem('authUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('🔐 [Auth] Restored user state from session');
            } catch (error) {
                console.error('🔐 [Auth] Failed to parse stored user:', error);
                sessionStorage.removeItem('authUser');
            }
        }
    }, []);

    // Initialize Firebase Auth persistence
    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('🔐 [Auth] Setting up persistence');
                await setPersistence(firebaseAuth, browserLocalPersistence);
                console.log('🔐 [Auth] Persistence set to LOCAL');
            } catch (error) {
                console.error('🔐 [Auth] Persistence error:', error);
                setAuthError(error);
            }
        };
        
        initAuth();
    }, []);

    // Set up auth state listener
    useEffect(() => {
        console.log('🔐 [Auth] Setting up auth state listener');
        let mounted = true;
        
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (!mounted) return;
            handleAuthStateChange(user);
        });

        // Clean up subscription
        return () => {
            mounted = false;
            console.log('🔐 [Auth] Cleaning up auth state listener');
            unsubscribe();
        };
    }, [handleAuthStateChange]);

    const signUp = async (email, password, name) => {
        console.log('🔐 [Auth] Attempting signup:', email);
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            console.log('🔐 [Auth] User created:', user.uid);

            await updateProfile(user, { displayName: name });
            console.log('🔐 [Auth] Profile updated with name:', name);

            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('🔐 [Auth] User data stored in Firestore');

            // Navigate to home page after successful signup
            router.push('/');
            return user;
        } catch (error) {
            console.error('🔐 [Auth] Signup error:', error);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        console.log('🔐 [Auth] Attempting signin:', email);
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            console.log('🔐 [Auth] Signin successful:', userCredential.user.uid);
            
            // Navigate to home page after successful signin
            router.push('/');
            return userCredential.user;
        } catch (error) {
            console.error('🔐 [Auth] Signin error:', error);
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        console.log('🔐 [Auth] Attempting Google signin');
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(firebaseAuth, provider);
            console.log('🔐 [Auth] Google signin successful:', userCredential.user.uid);
            
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: userCredential.user.displayName,
                email: userCredential.user.email,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, { merge: true });
            console.log('🔐 [Auth] Google user data stored in Firestore');

            // Navigate to home page after successful signin
            router.push('/');
            return userCredential.user;
        } catch (error) {
            console.error('🔐 [Auth] Google signin error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        console.log('🔐 [Auth] Attempting signout');
        try {
            await firebaseSignOut(firebaseAuth);
            console.log('🔐 [Auth] Signout successful');
            // Clear any stored data
            sessionStorage.removeItem('authUser');
            sessionStorage.removeItem('redirectAfterAuth');
            // Navigate to home page after signout
            router.push('/');
        } catch (error) {
            console.error('🔐 [Auth] Signout error:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        authError,
        signUp,
        signIn,
        signInWithGoogle,
        signOut
    };

    console.log('🔐 [Auth] Current state:', { user, loading, authError });

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 