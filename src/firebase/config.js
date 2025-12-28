import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAigqSVN6VW83lJUgaX5vm0kD1bLN_fjwI",
  authDomain: "kyrsova-8da83.firebaseapp.com",
  projectId: "kyrsova-8da83",
  storageBucket: "kyrsova-8da83.firebasestorage.app",
  messagingSenderId: "621245118426",
  appId: "1:621245118426:web:e01430c4a0081f62f872e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
