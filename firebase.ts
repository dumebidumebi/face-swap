// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi51WYrQ8vwM_xE7hxS0V-QTZJdYOfrZo",
  authDomain: "face-swap-6ae06.firebaseapp.com",
  projectId: "face-swap-6ae06",
  storageBucket: "face-swap-6ae06.appspot.com",
  messagingSenderId: "730483021961",
  appId: "1:730483021961:web:f959c7dc69966d27840e58",
  measurementId: "G-Q4T41JQ7D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);