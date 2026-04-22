// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDneHhpZk5BuaGQcjk5qMEazR-E6KheYh0',
  authDomain: 'practice-firestore-2e9b8.firebaseapp.com',
  projectId: 'practice-firestore-2e9b8',
  storageBucket: 'practice-firestore-2e9b8.firebasestorage.app',
  messagingSenderId: '230106773005',
  appId: '1:230106773005:web:190472bb3f4a81c9bf0744',
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
