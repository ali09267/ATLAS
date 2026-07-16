import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBtfBFqSI0PAHxp2w56xX6E3YeebhFX_PA",
  authDomain: "ai-powered-e-commerce-web-app.firebaseapp.com",
  projectId: "ai-powered-e-commerce-web-app",
  storageBucket: "ai-powered-e-commerce-web-app.firebasestorage.app",
  messagingSenderId: "610010101821",
  appId: "1:610010101821:web:ae086659f55bbdd7c0d254",
  measurementId: "G-0HF1FTNWT6"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);