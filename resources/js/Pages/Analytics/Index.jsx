import Sidebar from '@/Layouts/Sidebar';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, Text, Metric, BarList, AreaChart, SparkAreaChart, DonutChart, Legend, Flex } from '@tremor/react';

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

    const coverageBarListData = metrics.coverage_by_barangay.map((row) => ({
        name: row.barangay,
        value: row.coverage_rate,
    }));

    const utilizationBarListData = metrics.program_utilization.map((row) => ({
        name: row.program,
        value: row.utilization_rate,
    }));

    const commodityDonutData = metrics.commodity_breakdown.map((row) => ({
        name: row.commodity,
        value: row.count,
    }));

    const totalDistributionsTrend = metrics.distributions_over_time.reduce((sum, r) => sum + r.Distributions, 0);

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Analytics</h2>}>
            <Head title="Analytics" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">

                    {/* Filter bar */}
                    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div>
                            <label className="block text-xs text-gray-500">Program</label>
                            <select value={programId} onChange={(e) => setProgramId(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                <option value="">All Programs</option>
                                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm" />
                        </div>
                        <button onClick={applyFilters} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900">Filter</button>
                        <button onClick={resetFilters} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Reset</button>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <Card decoration="top" decorationColor="amber">
                            <Text>Duplicate Flags</Text>
                            <Metric>{metrics.duplicate_flag_count}</Metric>
                        </Card>
                        <Card decoration="top" decorationColor="red">
                            <Text>Unserved Profiles</Text>
                            <Metric>{metrics.unserved_profiles_count}</Metric>
                        </Card>
                        <Card decoration="top" decorationColor="emerald">
                            <Text>Total Distributions (Trend)</Text>
                            <Flex justifyContent="between" alignItems="end">
                                <Metric>{totalDistributionsTrend}</Metric>
                                {metrics.distributions_over_time.length > 1 && (
                                    <SparkAreaChart
                                        data={metrics.distributions_over_time}
                                        categories={['Distributions']}
                                        index="month"
                                        colors={['emerald']}
                                        className="h-10 w-24"
                                    />
                                )}
                            </Flex>
                        </Card>
                        <Card decoration="top" decorationColor="blue">
                            <Text>Active Programs Tracked</Text>
                            <Metric>{metrics.program_utilization.length}</Metric>
                        </Card>
                    </div>

                    {/* Most/least served */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card decoration="left" decorationColor="emerald">
                            <Text>Most Served Barangay</Text>
                            {metrics.most_served_barangay ? (
                                <>
                                    <Metric className="text-lg">{metrics.most_served_barangay.barangay}</Metric>
                                    <Text>{metrics.most_served_barangay.coverage_rate}% coverage</Text>
                                </>
                            ) : <Text className="mt-1 text-gray-400">No data</Text>}
                        </Card>
                        <Card decoration="left" decorationColor="red">
                            <Text>Least Served Barangay</Text>
                            {metrics.least_served_barangay ? (
                                <>
                                    <Metric className="text-lg">{metrics.least_served_barangay.barangay}</Metric>
                                    <Text>{metrics.least_served_barangay.coverage_rate}% coverage</Text>
                                </>
                            ) : <Text className="mt-1 text-gray-400">No data</Text>}
                        </Card>
                    </div>

                    {/* Distributions over time — Area Chart */}
                    <Card>
                        <Text className="font-semibold text-gray-800">Distributions Over Time</Text>
                        {metrics.distributions_over_time.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">No distributions recorded yet.</p>
                        ) : (
                            <AreaChart
                                className="mt-6 h-64"
                                data={metrics.distributions_over_time}
                                index="month"
                                categories={['Distributions']}
                                colors={['emerald']}
                                valueFormatter={(v) => `${v}`}
                            />
                        )}
                    </Card>

                    {/* Coverage by barangay — Bar List */}
                    <Card>
                        <Text className="font-semibold text-gray-800">Aid Coverage by Barangay</Text>
                        {coverageBarListData.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">No profiles recorded yet.</p>
                        ) : (
                            <BarList
                                className="mt-4"
                                data={coverageBarListData}
                                color="emerald"
                                valueFormatter={(v) => `${v}%`}
                            />
                        )}
                    </Card>

                    {/* Commodity breakdown — Donut */}
                    <Card>
                        <Text className="font-semibold text-gray-800">Commodity Distribution Breakdown</Text>
                        {commodityDonutData.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">No commodity-linked distributions yet.</p>
                        ) : (
                            <>
                                <DonutChart
                                    className="mt-6"
                                    data={commodityDonutData}
                                    category="value"
                                    index="name"
                                    valueFormatter={(v) => `${v} distributions`}
                                />
                                <Legend className="mt-4" categories={commodityDonutData.map((d) => d.name)} />
                            </>
                        )}
                    </Card>

                    {/* Program utilization — Bar List */}
                    <Card>
                        <Text className="font-semibold text-gray-800">Program Utilization Rate</Text>
                        {utilizationBarListData.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">No aid programs yet.</p>
                        ) : (
                            <BarList
                                className="mt-4"
                                data={utilizationBarListData}
                                color="amber"
                                valueFormatter={(v) => `${v}%`}
                            />
                        )}
                    </Card>

                </div>
            </div>
        </Sidebar>
    );
}