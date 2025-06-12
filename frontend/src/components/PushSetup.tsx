import { useEffect } from "react";
import {
  registerServiceWorker,
  subscribeToPushNotifications,
} from "../utils/pushManager";

export const PushSetup: React.FC = () => {
  useEffect(() => {
    const initPush = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push messaging is not supported");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Push permission denied");
        return;
      }

      try {
        const registration = await registerServiceWorker();
        const subscription = await subscribeToPushNotifications(registration);

        await fetch(import.meta.env.VITE_PUSH_BACKEND + "/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });
      } catch (error) {
        console.error("Push setup failed:", error);
      }
    };

    initPush();
  }, []);

  return null;
};
