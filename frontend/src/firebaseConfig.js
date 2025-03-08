// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKxGY2ssTc9FXsTU7mdY8r_qYSQ83ylnU",
  authDomain: "smartparking-14838.firebaseapp.com",
  projectId: "smartparking-14838",
  storageBucket: "smartparking-14838.firebasestorage.app",
  messagingSenderId: "1096512145281",
  appId: "1:1096512145281:web:f04ac1fdac8d19ac3fca80",
  measurementId: "G-Z91CR81CSG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);