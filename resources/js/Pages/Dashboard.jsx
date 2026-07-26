import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { subscribeToPushNotifications } from '@/offline/pushNotifications';
import { useState } from 'react';

export default function Dashboard({ stats }) {

    const [notifStatus, setNotifStatus] = useState(null);

    const enableNotifications = async () => {
        const success = await subscribeToPushNotifications();
        setNotifStatus(success ? 'enabled' : 'denied');
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl space-y-6 sm:px-6 lg:px-8">

                    {/* Top stat cards */}
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Total Profiles</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-800">{stats.total_profiles}</p>
                        </div>
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Active Programs</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-800">{stats.active_programs}</p>
                        </div>
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Total Distributions</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-800">{stats.total_distributions}</p>
                        </div>
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <p className="text-sm text-gray-500">Unserved Profiles</p>
                            <p className="mt-1 text-3xl font-semibold text-red-600">{stats.unserved_profiles_count}</p>
                        </div>
                    </div>

                    {notifStatus !== 'enabled' && (
                        <div className="rounded border border-indigo-200 bg-indigo-50 p-4">
                            <p className="mb-2 text-sm text-indigo-800">
                                Enable push notifications to get alerted about pending approvals and flagged records.
                            </p>
                            <button
                                onClick={enableNotifications}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                            >
                                Enable Notifications
                            </button>
                            {notifStatus === 'denied' && (
                                <p className="mt-2 text-xs text-red-600">
                                    Permission denied. Enable notifications in your browser settings to receive alerts.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Needs attention */}
                    {stats.duplicate_flag_count > 0 && (
                        <div className="rounded border border-amber-300 bg-amber-50 p-4">
                            <p className="text-sm text-amber-800">
                                <strong>{stats.duplicate_flag_count}</strong> distribution(s) flagged as potential duplicates.{' '}
                                <Link href={route('analytics.index')} className="underline">View in Analytics</Link>
                            </p>
                        </div>
                    )}

                    {/* Profiles by sector */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Profiles by Sector</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <Link
                                href={route('profiles.index', { sector: 'farmer' })}
                                className="rounded border border-gray-200 p-4 text-center hover:bg-gray-50"
                            >
                                <p className="text-2xl font-semibold text-green-700">{stats.profiles_by_sector.farmer}</p>
                                <p className="text-sm text-gray-500">Farmers</p>
                            </Link>
                            <Link
                                href={route('profiles.index', { sector: 'fisherfolk' })}
                                className="rounded border border-gray-200 p-4 text-center hover:bg-gray-50"
                            >
                                <p className="text-2xl font-semibold text-blue-700">{stats.profiles_by_sector.fisherfolk}</p>
                                <p className="text-sm text-gray-500">Fisherfolk</p>
                            </Link>
                            <Link
                                href={route('profiles.index', { sector: 'raiser' })}
                                className="rounded border border-gray-200 p-4 text-center hover:bg-gray-50"
                            >
                                <p className="text-2xl font-semibold text-amber-700">{stats.profiles_by_sector.raiser}</p>
                                <p className="text-sm text-gray-500">Raisers</p>
                            </Link>
                        </div>
                    </div>

                    {/* Farmers per commodity — clickable */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Beneficiaries per Commodity</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {stats.farmers_per_commodity.map((commodity) => (
                                <Link
                                    key={commodity.id}
                                    href={route('profiles.index', { commodity_id: commodity.id })}
                                    className="rounded border border-gray-200 p-3 hover:bg-gray-50"
                                >
                                    <p className="text-sm font-medium text-gray-800">{commodity.name}</p>
                                    <p className="text-xs text-gray-500">{commodity.profiles_count} beneficiaries</p>
                                </Link>
                            ))}
                        </div>
                        {stats.farmers_per_commodity.length === 0 && (
                            <p className="text-sm text-gray-500">No commodities tracked yet.</p>
                        )}
                    </div>

                    {/* Quick links */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <Link href={route('profiles.create')} className="rounded bg-indigo-600 px-4 py-3 text-center text-sm text-white hover:bg-indigo-700">
                                + Add Profile
                            </Link>
                            <Link href={route('aid-distributions.create')} className="rounded bg-indigo-600 px-4 py-3 text-center text-sm text-white hover:bg-indigo-700">
                                Record Aid
                            </Link>
                            <Link href={route('reports.index')} className="rounded bg-gray-700 px-4 py-3 text-center text-sm text-white hover:bg-gray-800">
                                Reports
                            </Link>
                            <Link href={route('analytics.index')} className="rounded bg-gray-700 px-4 py-3 text-center text-sm text-white hover:bg-gray-800">
                                Analytics
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}