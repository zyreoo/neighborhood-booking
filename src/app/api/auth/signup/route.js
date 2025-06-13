import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with name
    await updateProfile(user, {
      displayName: name
    });

    try {
      // Store additional user data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      // Continue even if Firestore fails - at least the user is created in Auth
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific Firebase Auth errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        );
      case 'auth/invalid-email':
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      case 'auth/operation-not-allowed':
        return NextResponse.json(
          { error: 'Email/password accounts are not enabled. Please contact support.' },
          { status: 400 }
        );
      case 'auth/weak-password':
        return NextResponse.json(
          { error: 'Password should be at least 6 characters' },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: 'An error occurred during signup' },
          { status: 500 }
        );
    }
  }
} 