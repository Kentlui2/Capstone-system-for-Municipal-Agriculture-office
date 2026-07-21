import { getDB } from './db';

/**
 * Checks actual connectivity, not just navigator.onLine (which can be
 * unreliable — it only reflects network adapter status, not whether
 * the server is actually reachable). Does a lightweight HEAD request
 * to confirm real connectivity before deciding to go offline.
 */
export async function isActuallyOnline() {
    if (!navigator.onLine) {
        return false;
    }

    try {
        const response = await fetch('/api/offline/ping', {
            method: 'HEAD',
            cache: 'no-store',
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Saves a profile encoded while offline into IndexedDB's outbox,
 * to be synced once connectivity returns.
 */
export async function saveProfileOffline(profileData) {
    const db = await getDB();

    const localId = await db.add('pending_profiles', {
        ...profileData,
        status: 'pending_sync',
        created_at: new Date().toISOString(),
    });

    return localId;
}

/**
 * Saves an aid distribution encoded while offline, including a
 * local (pass 1) duplicate check against cached distribution data,
 * so the Encoder gets immediate feedback even without a connection.
 */
export async function saveDistributionOffline(distributionData) {
    const db = await getDB();

    // Pass 1: local duplicate check against cached distributions
    // (server will run pass 2 — the authoritative check — on sync)
    const cachedDistributions = await db.getAll('cached_distributions');
    const pendingDistributions = await db.getAll('pending_distributions');

    const isDuplicate = [...cachedDistributions, ...pendingDistributions].some(
        (d) =>
            d.profile_id === distributionData.profile_id &&
            d.program_id === distributionData.program_id
    );

    const localId = await db.add('pending_distributions', {
        ...distributionData,
        status: 'pending_sync',
        locally_flagged_duplicate: isDuplicate,
        created_at: new Date().toISOString(),
    });

    return { localId, isDuplicate };
}