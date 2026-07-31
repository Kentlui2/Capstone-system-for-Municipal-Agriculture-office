import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#4f46e5', '#0d9488', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#db2777', '#ea580c', '#0284c7'];

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

                    {/* Stat cards */}
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

                    {/* Coverage by barangay — horizontal bar chart */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Aid Coverage by Barangay</h3>
                        {metrics.coverage_by_barangay.length === 0 ? (
                            <p className="text-sm text-gray-500">No profiles recorded yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={Math.max(300, metrics.coverage_by_barangay.length * 35)}>
                                <BarChart
                                    data={metrics.coverage_by_barangay}
                                    layout="vertical"
                                    margin={{ left: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} unit="%" />
                                    <YAxis type="category" dataKey="barangay" width={90} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Bar dataKey="coverage_rate" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Commodity breakdown — donut chart */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Commodity Distribution Breakdown</h3>
                        {metrics.commodity_breakdown.length === 0 ? (
                            <p className="text-sm text-gray-500">No commodity-linked distributions yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={metrics.commodity_breakdown}
                                        dataKey="count"
                                        nameKey="commodity"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={110}
                                        label={({ commodity, percentage }) => `${commodity} (${percentage}%)`}
                                    >
                                        {metrics.commodity_breakdown.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} distributions`, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Program utilization — horizontal bar chart */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Program Utilization Rate</h3>
                        {metrics.program_utilization.length === 0 ? (
                            <p className="text-sm text-gray-500">No aid programs yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={Math.max(200, metrics.program_utilization.length * 50)}>
                                <BarChart
                                    data={metrics.program_utilization}
                                    layout="vertical"
                                    margin={{ left: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" unit="%" />
                                    <YAxis type="category" dataKey="program" width={120} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Bar dataKey="utilization_rate" radius={[0, 4, 4, 0]}>
                                        {metrics.program_utilization.map((entry, index) => (
                                            <Cell key={index} fill={entry.utilization_rate > 100 ? '#dc2626' : '#d97706'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}