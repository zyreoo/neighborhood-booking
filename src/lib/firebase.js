// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvNV0xDSYeljlqLFiKZ2MuGViso3Kc514",
  authDomain: "neighborhoodbooking-126d7.firebaseapp.com",
  projectId: "neighborhoodbooking-126d7",
  storageBucket: "neighborhoodbooking-126d7.firebasestorage.app",
  messagingSenderId: "177254574971",
  appId: "1:177254574971:web:36820321b70051177f2bde",
  measurementId: "G-3RVXN1LJCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics }; 