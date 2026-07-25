import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getDB } from '@/offline/db';

export default function Index() {
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [pendingDistributions, setPendingDistributions] = useState([]);
    const [needsReview, setNeedsReview] = useState([]);

    const loadQueue = async () => {
        const db = await getDB();
        const allProfiles = await db.getAll('pending_profiles');
        const allDistributions = await db.getAll('pending_distributions');

        setPendingProfiles(allProfiles.filter((p) => p.status === 'pending_sync'));
        setPendingDistributions(allDistributions.filter((d) => d.status === 'pending_sync'));
        setNeedsReview(allDistributions.filter((d) => d.status === 'needs_review'));
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const resolveReviewItem = async (localId, confirmAnyway) => {
        const db = await getDB();

        if (!confirmAnyway) {
            // Discard — Encoder/Admin decided this shouldn't be recorded
            await db.delete('pending_distributions', localId);
            await loadQueue();
            return;
        }

        // Resubmit with explicit confirmation flags via the normal
        // online sync endpoint — this time forcing it through
        const item = await db.get('pending_distributions', localId);
        const { local_id, status, warnings, locally_flagged_duplicate, created_at, ...distributionData } = item;

        const response = await fetch('/api/offline/sync/distribution/force', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
            },
            body: JSON.stringify(distributionData),
        });

        if (response.ok) {
            await db.delete('pending_distributions', localId);
        }

        await loadQueue();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Offline Sync Queue</h2>}
        >
            <Head title="Offline Sync Queue" />

            <div className="mb-4 flex justify-end">
                <button
                    onClick={loadQueue}
                    className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300"
                >
                    Refresh
                </button>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">

                    {needsReview.length > 0 && (
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-4 text-lg font-medium text-amber-700">
                                Needs Review ({needsReview.length})
                            </h3>
                            <p className="mb-4 text-sm text-gray-500">
                                These distributions were flagged as possible duplicates or over-allocations
                                when synced. Review each one and decide whether to save it anyway or discard it.
                            </p>
                            <div className="space-y-3">
                                {needsReview.map((item) => (
                                    <div key={item.local_id} className="rounded border border-amber-200 p-4">
                                        <p className="text-sm">
                                            Profile #{item.profile_id} — Program #{item.program_id} —{' '}
                                            {item.quantity} {item.unit}
                                        </p>
                                        <ul className="my-2 list-inside list-disc text-xs text-amber-700">
                                            {item.warnings?.is_duplicate && <li>Possible duplicate</li>}
                                            {item.warnings?.exceeds_allocation && <li>Exceeds allocation</li>}
                                        </ul>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => resolveReviewItem(item.local_id, true)}
                                                className="rounded bg-amber-600 px-3 py-1 text-xs text-white hover:bg-amber-700"
                                            >
                                                Save Anyway
                                            </button>
                                            <button
                                                onClick={() => resolveReviewItem(item.local_id, false)}
                                                className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-800 hover:bg-gray-300"
                                            >
                                                Discard
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">
                            Waiting to Sync ({pendingProfiles.length + pendingDistributions.length})
                        </h3>
                        {pendingProfiles.length === 0 && pendingDistributions.length === 0 ? (
                            <p className="text-sm text-gray-500">Nothing pending — everything is synced.</p>
                        ) : (
                            <>
                                {pendingProfiles.map((p) => (
                                    <p key={p.local_id} className="text-sm text-gray-600">
                                        Profile: {p.first_name} {p.last_name} (waiting to sync)
                                    </p>
                                ))}
                                {pendingDistributions.map((d) => (
                                    <p key={d.local_id} className="text-sm text-gray-600">
                                        Distribution: Profile #{d.profile_id}, {d.quantity} {d.unit} (waiting to sync)
                                    </p>
                                ))}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}