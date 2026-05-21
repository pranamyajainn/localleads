import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getApp() {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

// Lazy accessors — Firebase only initializes when first called (always in browser)
export function firebaseAuth() {
  return getAuth(getApp());
}

export function firebaseDb() {
  return getFirestore(getApp());
}

export const googleProvider = new GoogleAuthProvider();

// Convenience shim so hooks can access currentUser without calling firebaseAuth() everywhere
export const auth = {
  get currentUser() {
    return firebaseAuth().currentUser;
  },
};
