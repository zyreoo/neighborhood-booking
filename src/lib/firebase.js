// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize variables
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseAnalytics = null;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
  console.log('🔥 [Firebase] Starting client-side initialization...');
  
  try {
    // Check if Firebase is already initialized
    if (getApps().length > 0) {
      console.log('🔥 [Firebase] Firebase already initialized, getting existing app');
      firebaseApp = getApp();
    } else {
      console.log('🔥 [Firebase] Initializing new Firebase app');
      firebaseApp = initializeApp(firebaseConfig);
    }

    // Initialize Auth
    console.log('🔥 [Firebase] Initializing Auth...');
    firebaseAuth = getAuth(firebaseApp);
    setPersistence(firebaseAuth, browserLocalPersistence)
      .then(() => console.log('🔥 [Firebase] Auth persistence set to local'))
      .catch(error => console.error('🔥 [Firebase] Error setting auth persistence:', error));

    // Initialize Firestore
    console.log('🔥 [Firebase] Initializing Firestore...');
    firebaseDb = getFirestore(firebaseApp);

    // Initialize Analytics
    console.log('🔥 [Firebase] Checking Analytics support...');
    isSupported().then(yes => {
      if (yes) {
        firebaseAnalytics = getAnalytics(firebaseApp);
        console.log('🔥 [Firebase] Analytics initialized');
      } else {
        console.log('🔥 [Firebase] Analytics not supported in this environment');
      }
    });

    console.log('🔥 [Firebase] All services initialized successfully');
  } catch (error) {
    console.error('🔥 [Firebase] Error during initialization:', error);
    console.error('🔥 [Firebase] Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
} else {
  console.log('🔥 [Firebase] Running in server environment, skipping initialization');
}

// Export services
export { firebaseApp, firebaseAuth, firebaseDb, firebaseAnalytics };
export const auth = firebaseAuth;
export const db = firebaseDb;
export const analytics = firebaseAnalytics; 