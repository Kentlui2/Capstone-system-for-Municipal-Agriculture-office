import { openDB } from 'idb';

const DB_NAME = 'mao-offline-db';
const DB_VERSION = 1;

/**
 * Opens (or creates) the local IndexedDB database used for offline
 * encoding. Called once and reused everywhere else in the app.
 */
export async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Cached reference data — synced FROM the server, used for
            // dropdowns and local duplicate-checking while offline
            if (!db.objectStoreNames.contains('cached_profiles')) {
                db.createObjectStore('cached_profiles', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('cached_programs')) {
                db.createObjectStore('cached_programs', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('cached_commodities')) {
                db.createObjectStore('cached_commodities', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('cached_distributions')) {
                // Recent distributions, cached specifically to support
                // local duplicate detection while offline (pass 1)
                db.createObjectStore('cached_distributions', { keyPath: 'id' });
            }

            // Outbox — records encoded offline, waiting to sync TO the server
            if (!db.objectStoreNames.contains('pending_profiles')) {
                db.createObjectStore('pending_profiles', {
                    keyPath: 'local_id',
                    autoIncrement: true,
                });
            }
            if (!db.objectStoreNames.contains('pending_distributions')) {
                db.createObjectStore('pending_distributions', {
                    keyPath: 'local_id',
                    autoIncrement: true,
                });
            }
        },
    });
}