import { sendPushNotification } from "../api/notify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleAlert(msg: string, enqueueSnackbar: (msg: string, options?: any) => void) {
    if (document.visibilityState === "visible") { // user online
        console.log("🌿 Alert:", msg);
        enqueueSnackbar(`🌿 ${msg}`, { variant: "warning" });
        sendPushNotification("🌿 SmartLeaf", msg);

    } else { // user offline
    }
}
