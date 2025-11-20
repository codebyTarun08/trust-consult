// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAo-QmTuM8Oy6cz_IghsSgmy5zDQm_OhMw",
//   authDomain: "trust-consult.firebaseapp.com",
//   databaseURL: "https://trust-consult-default-rtdb.firebaseio.com",
//   projectId: "trust-consult",
//   storageBucket: "trust-consult.firebasestorage.app",
//   messagingSenderId: "947136146012",
//   appId: "1:947136146012:web:3bd97b40da976ef5995499",
//   measurementId: "G-V3PZ2H247L"
// };
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSG_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const rtdb = getDatabase(app);