import { getDB } from './db';

/**
 * Pushes all offline-queued profiles and distributions to the server.
 * Called when connectivity is restored. Each record is handled
 * independently — one failure doesn't block the rest of the queue.
 */
export async function syncUpPendingRecords() {
    const db = await getDB();
    const results = { synced: 0, needsReview: 0, failed: 0 };

    // --- Sync pending profiles ---
    const pendingProfiles = await db.getAll('pending_profiles');

    for (const profile of pendingProfiles) {
        try {
            const { local_id, status, created_at, ...profileData } = profile;

            const response = await fetch('/api/offline/sync/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                await db.delete('pending_profiles', local_id);
                results.synced++;
            } else {
                results.failed++;
            }
        } catch {
            results.failed++;
        }
    }

    // --- Sync pending distributions ---
    const pendingDistributions = (await db.getAll('pending_distributions')).filter((d) => d.status === 'pending_sync');

    for (const distribution of pendingDistributions) {
        try {
            const { local_id, status, created_at, locally_flagged_duplicate, ...distributionData } = distribution;

            const response = await fetch('/api/offline/sync/distribution', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(distributionData),
            });

            const result = await response.json();

            if (response.ok && result.status === 'synced') {
                await db.delete('pending_distributions', local_id);
                results.synced++;
            } else if (result.status === 'needs_review') {
                // Move to needs_review status but keep it in the store
                // so Admin/Encoder can find and resolve it later
                await db.put('pending_distributions', {
                    ...distribution,
                    status: 'needs_review',
                    warnings: result.warnings,
                });
                results.needsReview++;
            } else {
                results.failed++;
            }
        } catch {
            results.failed++;
        }
    }

    return results;
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
}