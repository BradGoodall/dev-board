
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBxHeUbBNqRr2L3xfJDjIP2QDq5MOp7qOE",
  authDomain: "devboard-b8cfe.firebaseapp.com",
  projectId: "devboard-b8cfe",
  storageBucket: "devboard-b8cfe.appspot.com",
  messagingSenderId: "485122946824",
  appId: "1:485122946824:web:29762b139ec96cdc18debd",
  measurementId: "G-JTE7VF96FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider;
export const db = getFirestore(app);