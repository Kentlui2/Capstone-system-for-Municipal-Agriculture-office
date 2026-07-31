import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SearchableSelect from '@/Components/SearchableSelect';
import { BARANGAYS } from '@/constants/barangays';
import { useState } from 'react';

export default function Index({ profiles, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [sector, setSector] = useState(filters.sector || '');
    const [barangay, setBarangay] = useState(filters.barangay || 'All Barangays');

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route('profiles.index'), {
            search,
            sector,
            barangay: barangay === 'All Barangays' ? '' : barangay,
        }, { preserveState: true });
    };

    const deleteProfile = (profile) => {
        if (!confirm(`Delete ${profile.first_name} ${profile.last_name}'s profile? This cannot be undone.`)) {
            return;
        }

        router.delete(route('profiles.destroy', profile.id), { preserveScroll: true });
    };

    const sectorBadgeClass = {
        farmer: 'bg-green-100 text-green-800',
        fisherfolk: 'bg-blue-100 text-blue-800',
        raiser: 'bg-amber-100 text-amber-800',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profiles
                    </h2>
                    <Link
                        href={route('profiles.create')}
                        className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    >
                        + Add Profile
                    </Link>
                </div>
            }
        >
            <Head title="Profiles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filter bar */}
                            <form onSubmit={applyFilters} className="mb-6 flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded border-gray-300 text-sm"
                                />
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="rounded border-gray-300 text-sm"
                                >
                                    <option value="">All Sectors</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="fisherfolk">Fisherfolk</option>
                                    <option value="raiser">Raiser</option>
                                </select>
                                <div className="w-48">
                                    <SearchableSelect
                                        value={barangay}
                                        onChange={setBarangay}
                                        options={['All Barangays', ...BARANGAYS]}
                                        placeholder="All Barangays"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900"
                                >
                                    Filter
                                </button>
                            </form>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-sm font-medium text-gray-500">
                                        <th className="pb-3 pr-4">Name</th>
                                        <th className="pb-3 pr-4">Sector</th>
                                        <th className="pb-3 pr-4">Barangay</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {profiles.data.map((profile) => (
                                        <tr key={profile.id}>
                                            <td className="py-3 pr-4">
                                                {profile.first_name} {profile.last_name}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${sectorBadgeClass[profile.sector]}`}>
                                                    {profile.sector}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4">{profile.barangay}</td>
                                            <td className="py-3 pr-4 capitalize">{profile.status}</td>
                                            <td className="space-x-2 py-3">
                                                <Link
                                                    href={route('profiles.show', profile.id)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('profiles.edit', profile.id)}
                                                    className="text-gray-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => deleteProfile(profile)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {profiles.data.length === 0 && (
                                <p className="py-8 text-center text-sm text-gray-500">
                                    No profiles found.
                                </p>
                            )}

                            {/* Pagination links from Laravel's paginate() */}
                            <div className="mt-4 flex justify-center gap-2">
                                {profiles.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded px-3 py-1 text-sm ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}