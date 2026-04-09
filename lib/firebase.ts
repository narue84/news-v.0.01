import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoww_d2sfBAHyOcXMizcpsifMzToGiEd0",
  authDomain: "news-aaa9e.firebaseapp.com",
  projectId: "news-aaa9e",
  storageBucket: "news-aaa9e.firebasestorage.app",
  messagingSenderId: "490987780034",
  appId: "1:490987780034:web:05ddfca9b94aa72517085b",
  measurementId: "G-SJYJV2DX0G",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
