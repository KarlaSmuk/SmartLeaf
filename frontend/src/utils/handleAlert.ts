import { enqueueSnackbar } from "notistack";
import { sendPushNotification } from "../api/notify";
import type { SensorAlert } from "../hooks/useHomeAssistantWebSocket";

export function handleAlert(sensor: SensorAlert["data"]) {
    if (!sensor.alert || !sensor.sensor_type || sensor.sensor_type === "moisture") {
        return;
    }

    const label =
        sensor.alert === "above" ? "is too high" : "is too low";
    const message = `${sensor.friendly_name ?? sensor.sensor_type} ${label} (${sensor.value})`;

    if (document.visibilityState === "visible") { // user online
        enqueueSnackbar(`🌿 ${message}`, { variant: "warning" });
    } else { // user offline
        sendPushNotification("🌿 SmartLeaf", message);
    }
}
