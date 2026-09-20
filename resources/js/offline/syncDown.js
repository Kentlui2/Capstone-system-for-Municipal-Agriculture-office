import { getDB } from './db';

/**
 * Pulls current profiles, active programs, commodities, and recent
 * distributions from the server and caches them in IndexedDB.
 * Called while online — typically on login and periodically after —
 * so field encoders have fresh reference data even once they lose signal.
 */
export async function syncDownReferenceData() {
    if (!navigator.onLine) {
        return; // nothing to sync down if we're already offline
    }

    const db = await getDB();

    try {
        const response = await fetch('/api/offline/reference-data', {
            headers: { Accept: 'application/json' },
        });

        if (response.status === 401 || response.status === 419) {
            return; // Session expired while idle; suppress error and wait for login redirect
        }

        if (!response.ok) {
            throw new Error('Failed to fetch reference data');
        }

        const data = await response.json();

        const tx = db.transaction(
            ['cached_profiles', 'cached_programs', 'cached_commodities', 'cached_distributions'],
            'readwrite'
        );

        // Clear old cached data before writing fresh data, so deleted/
        // updated records don't linger stale in the offline cache
        await Promise.all([
            tx.objectStore('cached_profiles').clear(),
            tx.objectStore('cached_programs').clear(),
            tx.objectStore('cached_commodities').clear(),
            tx.objectStore('cached_distributions').clear(),
        ]);

        for (const profile of data.profiles) {
            await tx.objectStore('cached_profiles').put(profile);
        }
        for (const program of data.programs) {
            await tx.objectStore('cached_programs').put(program);
        }
        for (const commodity of data.commodities) {
            await tx.objectStore('cached_commodities').put(commodity);
        }
        for (const distribution of data.distributions) {
            await tx.objectStore('cached_distributions').put(distribution);
        }

        await tx.done;

        console.log('Offline reference data synced.');
    } catch (error) {
        console.error('Failed to sync reference data:', error);
    }
}