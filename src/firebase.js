// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIhAtGVbdQvmENXxT6AASOKohJZYliLLE",
  authDomain: "mold-setup-dev.firebaseapp.com",
  projectId: "mold-setup-dev",
  storageBucket: "mold-setup-dev.firebasestorage.app",
  messagingSenderId: "1094078495002",
  appId: "1:1094078495002:web:12236b3841b7a214cd94a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

