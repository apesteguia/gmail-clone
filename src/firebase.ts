import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAQaBUJiT5vV39HQZf-sWlOnIuTJUICHUY",
  authDomain: "firemail-8e3d6.firebaseapp.com",
  projectId: "firemail-8e3d6",
  storageBucket: "firemail-8e3d6.appspot.com",
  messagingSenderId: "34581254924",
  appId: "1:34581254924:web:37f9c5e6014dd1d2de2f29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = "es";
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };
