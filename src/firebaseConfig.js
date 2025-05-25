import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvz6AmIHtVj8ihZC74pf01uxiab5jsupU",
  authDomain: "sft-site-management.firebaseapp.com",
  projectId: "sft-site-management",
  storageBucket: "sft-site-management.appspot.com",
  messagingSenderId: "339310927527",
  appId: "1:339310927527:web:1d731d89f220fd3c18c582",
  measurementId: "G-3LE1737ZBT"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);