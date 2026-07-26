/**
 * Requests notification permission from the browser and, if granted,
 * subscribes this browser/device to push notifications, sending the
 * subscription details to Laravel to store against the logged-in user.
 */
export async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported in this browser.');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        console.log('Permission result:', permission);

        if (permission !== 'granted') {
            return false;
        }

        // Use getRegistrations() instead of .ready — .ready waits for
        // a registration matching the CURRENT page's scope, but our
        // service worker is registered under /build/ scope (widened
        // to control the whole site via the Service-Worker-Allowed
        // header), so .ready would hang forever waiting for a match
        // that will never come.
        const registrations = await navigator.serviceWorker.getRegistrations();
        const registration = registrations[0];

        if (!registration) {
            console.error('No service worker registration found.');
            return false;
        }

        console.log('Using registration:', registration);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                import.meta.env.VITE_VAPID_PUBLIC_KEY
            ),
        });
        console.log('Subscription created:', subscription);

        const response = await fetch('/api/push-subscriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
            },
            body: JSON.stringify(subscription),
        });
        console.log('Server response status:', response.status);

        return true;
    } catch (error) {
        console.error('Push subscription failed:', error);
        return false;
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}