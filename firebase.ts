// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEwMUr277f3UktQtfVV62LTRxnKnaxaEA",
  authDomain: "wage-wire.firebaseapp.com",
  projectId: "wage-wire",
  storageBucket: "wage-wire.appspot.com",
  messagingSenderId: "675205057096",
  appId: "1:675205057096:web:83b5bc3f3066286f5fe67d",
  measurementId: "G-71TFZ1DB92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);