// Handles incoming push events and displays the actual OS notification.
// This runs inside the service worker, not the main page — it has no
// access to the DOM, React, or anything from app.jsx.
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();

    const title = data.title || 'Notification';
    const options = {
        body: data.body || '',
        icon: data.icon || '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: data.data || {},
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Handles the user actually clicking the notification — opens the
// relevant page (e.g., /user-accounts or /offline-queue) instead of
// just dismissing it.
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});