// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpz6RoLNkpf7GoH9a9Hjzs94PxoFJOS0k",
  authDomain: "blog-app-202602-fca8e.firebaseapp.com",
  projectId: "blog-app-202602-fca8e",
  storageBucket: "blog-app-202602-fca8e.firebasestorage.app",
  messagingSenderId: "836665277119",
  appId: "1:836665277119:web:9a49b68a187ee4448a640a"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);

export const FirebaseAuth = getAuth(FirebaseApp)