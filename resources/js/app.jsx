import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { syncDownReferenceData } from './offline/syncDown';


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