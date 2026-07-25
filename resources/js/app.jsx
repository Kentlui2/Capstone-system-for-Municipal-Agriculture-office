import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { syncDownReferenceData } from './offline/syncDown';
import { syncUpPendingRecords } from './offline/syncUp';

import { registerSW } from 'virtual:pwa-register';

if (import.meta.env.PROD) {
    registerSW({
        immediate: true,
        scope: '/',
    });
}


// Cache reference data locally for offline use, whenever the app loads
// while online. Runs silently in the background — no UI blocking.
syncDownReferenceData();

// When connectivity is restored, push any offline-queued records
// to the server, then refresh the local reference cache
window.addEventListener('online', async () => {
    await runSync();
});

// Fallback: also check periodically, since the 'online' event isn't
// always reliable across all browsers/devices
setInterval(async () => {
    if (navigator.onLine) {
        await runSync();
    }
}, 30000); // every 30 seconds

async function runSync() {
    const results = await syncUpPendingRecords();

    if (results.synced > 0 || results.needsReview > 0) {
        console.log(
            `Sync complete: ${results.synced} synced, ${results.needsReview} need review, ${results.failed} failed.`
        );
    }

    await syncDownReferenceData();
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});