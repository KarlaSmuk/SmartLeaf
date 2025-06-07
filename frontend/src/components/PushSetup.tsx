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

        console.log("Push subscription:", subscription);

        // TODO: Send this to your backend via fetch or WebSocket
      } catch (error) {
        console.error("Push setup failed:", error);
      }
    };

    initPush();
  }, []);

  return null;
};
