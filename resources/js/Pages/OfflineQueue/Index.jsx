import Sidebar from '@/Layouts/Sidebar';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getDB } from '@/offline/db';
import Badge from '@/Components/Badge';
import { RiRefreshLine, RiAlertLine, RiCheckLine, RiTimeLine, RiDeleteBinLine, RiUserLine, RiHandHeartLine } from '@remixicon/react';

export default function Index() {
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [pendingDistributions, setPendingDistributions] = useState([]);
    const [needsReview, setNeedsReview] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadQueue = async () => {
        setIsLoading(true);
        try {
            const db = await getDB();
            const allProfiles = await db.getAll('pending_profiles');
            const allDistributions = await db.getAll('pending_distributions');

            setPendingProfiles(allProfiles.filter((p) => p.status === 'pending_sync'));
            setPendingDistributions(allDistributions.filter((d) => d.status === 'pending_sync'));
            setNeedsReview(allDistributions.filter((d) => d.status === 'needs_review'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const resolveReviewItem = async (localId, confirmAnyway) => {
        const db = await getDB();

        if (!confirmAnyway) {
            await db.delete('pending_distributions', localId);
            await loadQueue();
            return;
        }

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

    const totalPending = pendingProfiles.length + pendingDistributions.length;

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Offline Sync Queue</h2>
                    <button
                        onClick={loadQueue}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        <RiRefreshLine className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Queue
                    </button>
                </div>
            }
        >
            <Head title="Offline Sync Queue" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">

                    {/* Needs Review Section */}
                    {needsReview.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                    <RiAlertLine className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-amber-900">
                                        Needs Review ({needsReview.length})
                                    </h3>
                                    <p className="text-xs text-amber-700">
                                        These offline distributions triggered potential duplicate or over-allocation flags during background sync.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {needsReview.map((item) => (
                                    <div
                                        key={item.local_id}
                                        className="flex flex-col justify-between gap-4 rounded-lg border border-amber-200 bg-white p-4 sm:flex-row sm:items-center"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge color="amber">Action Required</Badge>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Distribution ({item.quantity} {item.unit})
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Beneficiary Profile #{item.profile_id} • Aid Program #{item.program_id} • Type: {item.aid_type}
                                            </p>
                                            <ul className="mt-2 flex flex-wrap gap-2 text-xs text-amber-800">
                                                {item.warnings?.is_duplicate && (
                                                    <li className="rounded bg-amber-100 px-2 py-0.5 font-medium">
                                                        Possible duplicate distribution
                                                    </li>
                                                )}
                                                {item.warnings?.exceeds_allocation && (
                                                    <li className="rounded bg-red-100 px-2 py-0.5 font-medium text-red-800">
                                                        Exceeds allocated quantity
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => resolveReviewItem(item.local_id, true)}
                                                className="flex items-center gap-1 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-colors"
                                            >
                                                <RiCheckLine className="h-3.5 w-3.5" /> Save Anyway
                                            </button>
                                            <button
                                                onClick={() => resolveReviewItem(item.local_id, false)}
                                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                <RiDeleteBinLine className="h-3.5 w-3.5" /> Discard
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Waiting to Sync Section */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <RiTimeLine className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Pending Offline Queue ({totalPending})
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Records waiting to automatically sync with the server when network connection is available.
                                    </p>
                                </div>
                            </div>
                            <Badge color={totalPending > 0 ? 'amber' : 'green'}>
                                {totalPending > 0 ? 'Sync Pending' : 'Fully Synced'}
                            </Badge>
                        </div>

                        {totalPending === 0 ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                                    <RiCheckLine className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Everything is up to date</p>
                                <p className="mt-1 text-xs text-gray-500">No offline entries are pending sync.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {pendingProfiles.map((p) => (
                                    <div key={p.local_id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                                <RiUserLine className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {p.first_name} {p.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Barangay: {p.barangay} • Sector: {p.sector}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge color="amber">Profile Pending Sync</Badge>
                                    </div>
                                ))}

                                {pendingDistributions.map((d) => (
                                    <div key={d.local_id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                <RiHandHeartLine className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Aid Distribution ({d.quantity} {d.unit})
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Profile #{d.profile_id} • Program #{d.program_id} • Date: {d.distribution_date}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge color="amber">Distribution Pending Sync</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Sidebar>
    );
}