import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import firestore from "firebase/firestore";
import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp= initializeApp({
    apiKey: "AIzaSyA04YKt4tDBt0W9E2N-4t7x8CI5JkF5oK4",
    authDomain: "fastfood-queue.firebaseapp.com",
    projectId: "fastfood-queue",
    storageBucket: "fastfood-queue.appspot.com",
    messagingSenderId: "956150577681",
    appId: "1:956150577681:web:ab93daf34537d8ef4bcfb0",
    measurementId: "G-YDXCZ22HNS"
});
 
 const db = getFirestore();
export default db;