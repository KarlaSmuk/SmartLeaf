export async function sendPushNotification(title: string, body: string): Promise<void> {
    try {
        const response = await fetch(import.meta.env.VITE_PUSH_BACKEND + "/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to send push notification:", errorText);
        }
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}
