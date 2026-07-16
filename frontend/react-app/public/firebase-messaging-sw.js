/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBtfBFqSI0PAHxp2w56xX6E3YeebhFX_PA",
  authDomain: "ai-powered-e-commerce-web-app.firebaseapp.com",
  projectId: "ai-powered-e-commerce-web-app",
  storageBucket: "ai-powered-e-commerce-web-app.firebasestorage.app",
  messagingSenderId: "610010101821",
  appId: "1:610010101821:web:ae086659f55bbdd7c0d254",
  measurementId: "G-0HF1FTNWT6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  console.log("Background Message:", payload);

  const notificationTitle =
    payload.notification?.title || "MyAwesomeCart";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/favicon.ico",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});