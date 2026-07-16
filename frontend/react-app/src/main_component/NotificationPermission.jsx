import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { useAuth } from "../auth/AuthContext";

function NotificationPermission() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function getFirebaseToken() {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("Notification permission denied");
          return;
        }

        const registration = await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
          vapidKey:
            "BMB5SJVSCn06gXOGIZ2h-iWZ3i5LUNlmTsS7NUcKA6gaUYBTrGAyNKjXKQXfdbBjYyZ1NiC-eGthMjJk_nnUIVk",
          serviceWorkerRegistration: registration,
        });

        console.log("FCM Token:", token);

        const response = await fetch(
          "http://127.0.0.1:8000/shop/api/device-token/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${user.token}`,
            },
            body: JSON.stringify({
              token: token,
            }),
          }
        );

        const data = await response.json();
        console.log("Device token saved:", data);
      } catch (err) {
        console.error("FCM Error:", err);
      }
    }

    // Get FCM token
    getFirebaseToken();

    // Listen for notifications while website is open
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);

      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.ico",
      });
    });

    return () => unsubscribe();
  }, [user]);

  return null;
}

export default NotificationPermission;