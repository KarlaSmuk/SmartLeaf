import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useAlertContext } from "../context/alert";
import type { SensorAlert } from "../hooks/useHomeAssistantWebSocket";

export function PushListener() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { addAlert } = useAlertContext();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const msg = event.data;

        if (msg?.type === "sensor_alert") {
          const alert: SensorAlert = msg.alert;
          const type = alert.type;

          enqueueSnackbar(
            `🌿 ${alert.data?.friendly_name ?? "Sensor"}${
              alert.data.state != "on" ? ":" : ""
            } ${alert.data?.state != "on" ? alert.data.state : ""} ${
              alert.data?.unit_of_measurement ?? ""
            }`,
            {
              variant: type == "watering_event" ? "info" : "warning",
              action: (key) => (
                <button
                  onClick={() => {
                    closeSnackbar(key);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  aria-label="close"
                >
                  ×
                </button>
              ),
            }
          );

          addAlert(alert);
        }
      });
    }
  }, []);

  return null;
}
