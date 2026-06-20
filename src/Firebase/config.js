import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAm0x2SAjes6zz8Jomn-ffqU91ue-a2gpM",
  authDomain: "proyecto-2026-28676.firebaseapp.com",
  projectId: "proyecto-2026-28676",
  storageBucket: "proyecto-2026-28676.firebasestorage.app",
  messagingSenderId: "433713902747",
  appId: "1:433713902747:web:6fbb9d6d4f4485bab6423e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default db;
