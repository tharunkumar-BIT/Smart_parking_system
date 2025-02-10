// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu-c5_UU-UQrHYQAAO77nLRKaw7C7KsRU",
  authDomain: "parkingslotbooking-13352.firebaseapp.com",
  projectId: "parkingslotbooking-13352",
  storageBucket: "parkingslotbooking-13352.firebasestorage.app",
  messagingSenderId: "902700275704",
  appId: "1:902700275704:web:1bd5c2ababe1c5fce3a80d",
  measurementId: "G-4G7T0VLEGN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);