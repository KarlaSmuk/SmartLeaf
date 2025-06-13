const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    return await navigator.serviceWorker.register('/sw.js');
}

export async function subscribeToPushNotifications(
    registration: ServiceWorkerRegistration
): Promise<PushSubscription> {
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource;

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
    });

    return subscription;
}
