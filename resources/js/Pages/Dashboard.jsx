import Sidebar from '@/Layouts/Sidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { subscribeToPushNotifications } from '@/offline/pushNotifications';
import { useState } from 'react';
import { Card, Metric, Text, Flex, BarChart, DonutChart, Legend } from '@tremor/react';
import {
    RiUserLine, RiHandCoinLine, RiClipboardLine, RiAlarmWarningLine, RiNotificationLine,
    RiUserAddLine, RiFileAddLine, RiFileTextLine, RiBarChartBoxLine,
} from '@remixicon/react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [notifStatus, setNotifStatus] = useState(null);

    const enableNotifications = async () => {
        const success = await subscribeToPushNotifications();
        setNotifStatus(success ? 'enabled' : 'denied');
    };

    const sectorData = [
        { name: 'Farmers', value: stats.profiles_by_sector.farmer },
        { name: 'Fisherfolk', value: stats.profiles_by_sector.fisherfolk },
        { name: 'Raisers', value: stats.profiles_by_sector.raiser },
    ].filter((s) => s.value > 0);

    const commodityData = stats.farmers_per_commodity
        .slice(0, 8)
        .map((c) => ({ name: c.name, Beneficiaries: c.profiles_count }));

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">

                    {/* Quick Action Welcome Banner */}
                    <div className="flex flex-col gap-4 rounded-xl border border-emerald-800/20 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                Welcome back, {auth.user.name}!
                            </h3>
                            <p className="mt-1 text-xs text-emerald-200">
                                Municipal Agriculture Office System • Select a task to begin recording or reporting.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            <Link
                                href={route('profiles.create')}
                                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-400 transition-colors"
                            >
                                <RiUserAddLine className="h-4 w-4" /> Register Beneficiary
                            </Link>

                            <Link
                                href={route('aid-distributions.create')}
                                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition-colors"
                            >
                                <RiFileAddLine className="h-4 w-4" /> Record Distribution
                            </Link>

                            {isAdmin && (
                                <Link
                                    href={route('aid-programs.create')}
                                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    <RiHandCoinLine className="h-4 w-4" /> Add Program
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <KpiCard icon={RiUserLine} label="Total Profiles" value={stats.total_profiles} color="emerald" />
                        <KpiCard icon={RiHandCoinLine} label="Active Programs" value={stats.active_programs} color="blue" />
                        <KpiCard icon={RiClipboardLine} label="Total Distributions" value={stats.total_distributions} color="violet" />
                        <KpiCard icon={RiAlarmWarningLine} label="Unserved Profiles" value={stats.unserved_profiles_count} color="red" />
                    </div>

                    {/* Enable notifications banner */}
                    {notifStatus !== 'enabled' && (
                        <Card className="flex items-center justify-between !p-4" decoration="left" decorationColor="emerald">
                            <Flex justifyContent="between" alignItems="center">
                                <Flex justifyContent="start" className="gap-3">
                                    <RiNotificationLine className="h-5 w-5 text-emerald-600" />
                                    <Text>Enable push notifications to get alerted about pending approvals and flagged records.</Text>
                                </Flex>
                                <button
                                    onClick={enableNotifications}
                                    className="whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                >
                                    Enable
                                </button>
                            </Flex>
                        </Card>
                    )}
                    {notifStatus === 'denied' && (
                        <p className="text-xs text-red-600">
                            Permission denied. Enable notifications in your browser settings to receive alerts.
                        </p>
                    )}

                    {/* Needs attention */}
                    {stats.duplicate_flag_count > 0 && (
                        <Card decoration="left" decorationColor="amber" className="!p-4">
                            <Text>
                                <strong>{stats.duplicate_flag_count}</strong> distribution(s) flagged as potential duplicates.{' '}
                                <Link href={route('analytics.index')} className="font-medium text-amber-700 underline">
                                    View in Analytics
                                </Link>
                            </Text>
                        </Card>
                    )}

                    {/* Charts row */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {/* Donut chart — profiles by sector */}
                        <Card>
                            <Text className="font-semibold text-gray-800">Profiles by Sector</Text>
                            {sectorData.length === 0 ? (
                                <p className="mt-4 text-sm text-gray-500">No profiles recorded yet.</p>
                            ) : (
                                <>
                                    <DonutChart
                                        className="mt-6"
                                        data={sectorData}
                                        category="value"
                                        index="name"
                                        colors={['emerald', 'blue', 'amber']}
                                        valueFormatter={(v) => `${v} profiles`}
                                    />
                                    <Legend
                                        className="mt-4"
                                        categories={sectorData.map((s) => s.name)}
                                        colors={['emerald', 'blue', 'amber']}
                                    />
                                </>
                            )}
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <Link href={route('profiles.index', { sector: 'farmer' })} className="rounded-lg py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                                    View Farmers
                                </Link>
                                <Link href={route('profiles.index', { sector: 'fisherfolk' })} className="rounded-lg py-2 text-xs font-medium text-blue-700 hover:bg-blue-50">
                                    View Fisherfolk
                                </Link>
                                <Link href={route('profiles.index', { sector: 'raiser' })} className="rounded-lg py-2 text-xs font-medium text-amber-700 hover:bg-amber-50">
                                    View Raisers
                                </Link>
                            </div>
                        </Card>

                        {/* Bar chart — beneficiaries per commodity */}
                        <Card>
                            <Text className="font-semibold text-gray-800">Beneficiaries per Commodity</Text>
                            {commodityData.length === 0 ? (
                                <p className="mt-4 text-sm text-gray-500">No commodities tracked yet.</p>
                            ) : (
                                <BarChart
                                    className="mt-6"
                                    data={commodityData}
                                    index="name"
                                    categories={['Beneficiaries']}
                                    colors={['emerald']}
                                    valueFormatter={(v) => `${v}`}
                                    yAxisWidth={40}
                                />
                            )}
                        </Card>
                    </div>

                    {/* Quick links */}
                    <Card>
                        <Text className="font-semibold text-gray-800">Quick Links</Text>
                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            <QuickLink href={route('profiles.create')} icon={RiUserAddLine} label="Add Profile" />
                            <QuickLink href={route('aid-distributions.create')} icon={RiFileAddLine} label="Record Aid" />
                            <QuickLink href={route('reports.index')} icon={RiFileTextLine} label="Reports" />
                            <QuickLink href={route('analytics.index')} icon={RiBarChartBoxLine} label="Analytics" />
                        </div>
                    </Card>

                </div>
            </div>
        </Sidebar>
    );
}

function KpiCard({ icon: Icon, label, value, color }) {
    return (
        <Card decoration="top" decorationColor={color}>
            <Flex justifyContent="start" className="gap-2">
                <Icon className={`h-5 w-5 text-${color}-600`} />
                <Text>{label}</Text>
            </Flex>
            <Metric className="mt-1">{value}</Metric>
        </Card>
    );
}

function QuickLink({ href, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 py-4 text-center text-sm font-medium text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
            <Icon className="h-5 w-5" />
            {label}
        </Link>
    );
}