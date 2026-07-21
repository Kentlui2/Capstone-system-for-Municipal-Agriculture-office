import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'MAO Beneficiary Profiling System',
                short_name: 'MAO System',
                description: 'Beneficiary profiling and aid distribution tracking for the Municipal Agriculture Office of Sta. Cruz, Davao del Sur',
                theme_color: '#4f46e5',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/dashboard',
                scope: '/',
                icons: [
                    { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                ],
            },
            workbox: {
                globDirectory: 'public/build',
                globPatterns: ['**/*.{js,css,png,svg}'],
                navigateFallback: null,
            },
            devOptions: {
                enabled: false,
            },
        }),
    ],
    build: {
        rollupOptions: {
            input: 'resources/js/app.jsx',
        },
    },
});