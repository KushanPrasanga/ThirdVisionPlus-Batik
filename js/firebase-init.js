import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"; // මෙය අලුතින් එකතු කරන ලදි

const firebaseConfig = {
  apiKey: "AIzaSyCKxViDHijySQT9GJBf8_tUkPr9p_AzMtU",
  authDomain: "bathixen-reactive-pro.firebaseapp.com",
  projectId: "bathixen-reactive-pro",
  storageBucket: "bathixen-reactive-pro.firebasestorage.app",
  messagingSenderId: "425325644262",
  appId: "1:425325644262:web:3d82cd60197ad11ade2e27",
  measurementId: "G-W2DRCQ8JMV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // 'auth' export කිරීම මෙහිදී සිදු වේ