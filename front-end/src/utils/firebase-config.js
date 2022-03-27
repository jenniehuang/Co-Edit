// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_BoFQRccHG605X98ZsIF4u5rwiiuiR4E",
  authDomain: "co-edit-344221.firebaseapp.com",
  databaseURL:
    "https://co-edit-344221-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "co-edit-344221",
  storageBucket: "co-edit-344221.appspot.com",
  messagingSenderId: "1063727665421",
  appId: "1:1063727665421:web:ca6b1e94987a6e2464a044",
  measurementId: "G-J354HFBBC4",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
