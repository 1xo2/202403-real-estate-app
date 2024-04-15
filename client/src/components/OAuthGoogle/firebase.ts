// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-app-b86a6.firebaseapp.com",
  projectId: "real-estate-app-b86a6",
  storageBucket: "real-estate-app-b86a6.appspot.com",
  messagingSenderId: "256901212002",
  appId: "1:256901212002:web:65b24b066511c661722e3b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
