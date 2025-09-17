import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOm28ER_d9ZT2_G0m3CeAwhJ8SpSWELvc",
  authDomain: "vayu-rakshak-sih.firebaseapp.com",
  databaseURL: "https://vayu-rakshak-sih-default-rtdb.firebaseio.com",
  projectId: "vayu-rakshak-sih",
  storageBucket: "vayu-rakshak-sih.firebasestorage.app",
  messagingSenderId: "358629594064",
  appId: "1:358629594064:web:17296998249f885b47dfd5",
  measurementId: "G-R552FW7T8R"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);