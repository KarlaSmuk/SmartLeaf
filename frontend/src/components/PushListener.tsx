import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useAlertContext } from "../context/alert";
import type { SensorAlert } from "../hooks/useHomeAssistantWebSocket";

export function PushListener() {
  const { enqueueSnackbar } = useSnackbar();
  const { addAlert } = useAlertContext();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const msg = event.data;

        if (msg?.type === "sensor_alert") {
          const alert: SensorAlert = msg.alert;
          const type = alert.type;
          const { friendly_name, state, unit_of_measurement } = alert.data;

          enqueueSnackbar(
            `🌿 ${friendly_name ?? "Sensor"}: ${state} ${
              unit_of_measurement ?? ""
            }`,
            { variant: type == "watering_event" ? "info" : "warning" }
          );
          addAlert(alert);
        }
      });
    }
  }, []);

  return null;
}
