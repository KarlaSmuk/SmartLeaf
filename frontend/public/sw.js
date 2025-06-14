self.addEventListener("push", function (event) {
  event.waitUntil(
    (async () => {
      try {
        const alert = event.data?.json();

        const title = "🌿 SmartLeaf Sensor Alert";
        const body = `${alert.data?.friendly_name ?? "Sensor"}${
          alert.data.state != "on" ? ":" : ""
        } ${alert.data?.state != "on" ? alert.data.state : ""} ${
          alert.data?.unit_of_measurement ?? ""
        }`;

        const clientsList = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        const visibleClient = clientsList.find(
          (client) => client.visibilityState === "visible"
        );

        if (visibleClient) {
          // Tab is visible
          visibleClient.postMessage({ type: "sensor_alert", alert });
        } else {
          // No visible tab
          self.registration.showNotification(title, {
            body,
            icon: "/growth-plant.png",
            badge: "/growth-plant.png",
            data: alert,
          });
        }
      } catch (error) {
        console.error("Error parsing push data:", error);
      }
    })()
  );
});
