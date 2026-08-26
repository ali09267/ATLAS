import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";

import { messaging } from "../firebase";
import { useAuth } from "../auth/AuthContext";

function NotificationPermission() {
  const { user } = useAuth();

  // ==============================
  // REGISTER FCM TOKEN
  // ==============================

  useEffect(() => {
    async function setupNotifications() {
      try {
        let permission = Notification.permission;

        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.log("Notifications are not allowed:", permission);

          return;
        }

        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
          vapidKey:
            "BMB5SJVSCn06gXOGIZ2h-iWZ3i5LUNlmTsS7NUcKA6gaUYBTrGAyNKjXKQXfdbBjYyZ1NiC-eGthMjJk_nnUIVk",

          serviceWorkerRegistration: registration,
        });

        if (!token) {
          console.log("Firebase did not return a token.");

          return;
        }

        console.log("FCM token:", token);

        const response = await fetch(
          "http://127.0.0.1:8000/shop/api/device-token/",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${user.token}`,
            },

            body: JSON.stringify({
              token,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Token save failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("Device token saved:", data);
      } catch (err) {
        console.error("FCM setup error:", err);
      }
    }

    setupNotifications();
  }, [user?.token]);

  // ==============================
  // FOREGROUND MESSAGES
  // ==============================

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("ATLAS foreground message:", payload);

      const title = payload.notification?.title || "ATLAS";

      const body = payload.notification?.body || "You have a new notification.";

      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}

export default NotificationPermission;
