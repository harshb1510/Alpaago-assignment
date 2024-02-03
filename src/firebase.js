// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWd_87oiJ5KMWZWux4-f5glGfXrNeNco8",
  authDomain: "alpaago-assignment.firebaseapp.com",
  projectId: "alpaago-assignment",
  storageBucket: "alpaago-assignment.appspot.com",
  messagingSenderId: "640533084818",
  appId: "1:640533084818:web:de88b62f28162ba4fbc44b",
  measurementId: "G-6XSYJMJRGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =  getAuth(app);
const db = getFirestore(app);
export {auth,db}
const analytics = getAnalytics(app);