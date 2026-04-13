import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // নিশ্চিত করুন এটি Realtime Database
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8rpiuFC0pBk5IPgfmT32DZl5-8o1NS_I",
  authDomain: "heartcode-showcase.firebaseapp.com",
  projectId: "heartcode-showcase",
  storageBucket: "heartcode-showcase.firebasestorage.app",
  messagingSenderId: "743331973405",
  appId: "1:743331973405:web:625d10aaa33cb6f94979f4",
  measurementId: "G-SC7DS819V8"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getDatabase(app); // এখানে Firestore এর বদলে Database দিন