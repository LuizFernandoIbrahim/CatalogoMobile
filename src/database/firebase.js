// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVpWu24cNrD1t0shKWsBKR6_H6rWj4e9s",
  authDomain: "oficinademarias-expo.firebaseapp.com",
  projectId: "oficinademarias-expo",
  storageBucket: "oficinademarias-expo.firebasestorage.app",
  messagingSenderId: "596404811007",
  appId: "1:596404811007:web:f23559f823acf7524448ca",
  measurementId: "G-W0SYBHV5NQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta a instância correta do banco de dados
export const dbFirestore = getFirestore(app);