import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ metrics, programs, filters }) {
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilters = () => {
        router.get(route('analytics.index'), {
            program_id: programId,
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setProgramId('');
        setStartDate('');
        setEndDate('');
        router.get(route('analytics.index'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Analytics</h2>}
        >
            <Head title="Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl space-y-6 sm:px-6 lg:px-8">

                    {/* Filter bar */}
                    <div className="bg-white p-4 shadow-sm sm:rounded-lg">
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Program</label>
                                <select
                                    value={programId}
                                    onChange={(e) => setProgramId(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">All Programs</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                />
                            </div>
                            <button
                                onClick={applyFilters}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                            >
                                Apply
                            </button>
                            <button
                                onClick={resetFilters}
                                className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Stat cards: duplicate flags + unserved profiles */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Duplicate Flags</p>
                            <p className="mt-1 text-3xl font-semibold text-amber-600">{metrics.duplicate_flag_count}</p>
                        </div>
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Unserved Profiles</p>
                            <p className="mt-1 text-3xl font-semibold text-red-600">{metrics.unserved_profiles_count}</p>
                        </div>
                    </div>

                    {/* Most / least served barangay */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Most Served Barangay</p>
                            {metrics.most_served_barangay ? (
                                <>
                                    <p className="mt-1 text-xl font-semibold text-green-700">{metrics.most_served_barangay.barangay}</p>
                                    <p className="text-sm text-gray-500">{metrics.most_served_barangay.coverage_rate}% coverage</p>
                                </>
                            ) : <p className="mt-1 text-sm text-gray-400">No data</p>}
                        </div>
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Least Served Barangay</p>
                            {metrics.least_served_barangay ? (
                                <>
                                    <p className="mt-1 text-xl font-semibold text-red-700">{metrics.least_served_barangay.barangay}</p>
                                    <p className="text-sm text-gray-500">{metrics.least_served_barangay.coverage_rate}% coverage</p>
                                </>
                            ) : <p className="mt-1 text-sm text-gray-400">No data</p>}
                        </div>
                    </div>

                    {/* Coverage by barangay — bar list */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Aid Coverage by Barangay</h3>
                        <div className="space-y-2">
                            {metrics.coverage_by_barangay.map((row) => (
                                <div key={row.barangay}>
                                    <div className="flex justify-between text-sm">
                                        <span>{row.barangay}</span>
                                        <span className="text-gray-500">{row.served_profiles}/{row.total_profiles} ({row.coverage_rate}%)</span>
                                    </div>
                                    <div className="mt-1 h-2 w-full rounded bg-gray-100">
                                        <div
                                            className="h-2 rounded bg-indigo-600"
                                            style={{ width: `${row.coverage_rate}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {metrics.coverage_by_barangay.length === 0 && (
                                <p className="text-sm text-gray-500">No profiles recorded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Commodity breakdown */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Commodity Distribution Breakdown</h3>
                        <div className="space-y-2">
                            {metrics.commodity_breakdown.map((row) => (
                                <div key={row.commodity}>
                                    <div className="flex justify-between text-sm">
                                        <span>{row.commodity}</span>
                                        <span className="text-gray-500">{row.count} ({row.percentage}%)</span>
                                    </div>
                                    <div className="mt-1 h-2 w-full rounded bg-gray-100">
                                        <div
                                            className="h-2 rounded bg-teal-600"
                                            style={{ width: `${row.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {metrics.commodity_breakdown.length === 0 && (
                                <p className="text-sm text-gray-500">No commodity-linked distributions yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Program utilization */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Program Utilization Rate</h3>
                        <div className="space-y-2">
                            {metrics.program_utilization.map((row) => (
                                <div key={row.program}>
                                    <div className="flex justify-between text-sm">
                                        <span>{row.program}</span>
                                        <span className="text-gray-500">
                                            {row.remaining_quantity} remaining of {row.allocated_quantity} ({row.utilization_rate}%)
                                        </span>
                                    </div>
                                    <div className="mt-1 h-2 w-full rounded bg-gray-100">
                                        <div
                                            className={`h-2 rounded ${row.utilization_rate > 100 ? 'bg-red-600' : 'bg-amber-500'}`}
                                            style={{ width: `${Math.min(row.utilization_rate, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {metrics.program_utilization.length === 0 && (
                                <p className="text-sm text-gray-500">No aid programs yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}