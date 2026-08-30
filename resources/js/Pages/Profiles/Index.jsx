import Sidebar from '@/Layouts/Sidebar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import SearchableSelect from '@/Components/SearchableSelect';
import { BARANGAYS } from '@/constants/barangays';
import { RiAddLine, RiEyeLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';

import ActiveFilters from '@/Components/ActiveFilters';

const sectorColor = { farmer: 'green', fisherfolk: 'blue', raiser: 'amber' };

export default function Index({ profiles, filters }) {
    const isAdmin = usePage().props.auth.user.role === 'admin';

    const [search, setSearch] = useState(filters.search || '');
    const [sector, setSector] = useState(filters.sector || '');
    const [barangay, setBarangay] = useState(filters.barangay || '');

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route('profiles.index'), {
            search, sector,
            barangay: barangay === 'All Barangays' ? '' : barangay,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch('');
        setSector('');
        setBarangay('All Barangays');
        router.get(route('profiles.index'));
    };

    const deleteProfile = (profile) => {
        if (!confirm(`Delete ${profile.first_name} ${profile.last_name}'s profile? This cannot be undone.`)) return;
        router.delete(route('profiles.destroy', profile.id), { preserveScroll: true });
    };

    const columns = useMemo(() => [
        {
            id: 'name',
            header: 'Name',
            enableSorting: false,
            cell: (info) => <span className="font-medium text-gray-900">{info.row.original.first_name} {info.row.original.last_name}</span>,
        },
        {
            accessorKey: 'sector',
            header: 'Sector',
            cell: (info) => <Badge color={sectorColor[info.getValue()]}>{info.getValue()}</Badge>,
        },
        { accessorKey: 'barangay', header: 'Barangay' },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => <Badge color={info.getValue() === 'active' ? 'green' : 'gray'}>{info.getValue()}</Badge>,
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: (info) => (
                <div className="flex gap-3">
                    <Link href={route('profiles.show', info.row.original.id)} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
                        <RiEyeLine className="h-4 w-4" /> View
                    </Link>
                    <Link href={route('profiles.edit', info.row.original.id)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                        <RiEditLine className="h-4 w-4" /> Edit
                    </Link>
                    {isAdmin && (
                        <button onClick={() => deleteProfile(info.row.original)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                            <RiDeleteBinLine className="h-4 w-4" /> Delete
                        </button>
                    )}
                </div>
            ),
        },
    ], [isAdmin]);

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Profiles</h2>
                    <Link
                        href={route('profiles.create')}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        <RiAddLine className="h-4 w-4" /> Add Profile
                    </Link>
                </div>
            }
        >
            <Head title="Profiles" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                        <form onSubmit={applyFilters} className="mb-4 flex flex-wrap gap-3">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-lg border-gray-300 text-sm"
                            />
                            <select value={sector} onChange={(e) => setSector(e.target.value)} className="rounded-lg border-gray-300 text-sm">
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
                            <button type="submit" className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900">Filter</button>
                            <button type="button" onClick={resetFilters} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Reset</button>
                        </form>

                        <ActiveFilters
                            filters={[
                                { label: 'Search', value: search, onRemove: () => { setSearch(''); router.get(route('profiles.index'), { sector, barangay: barangay === 'All Barangays' ? '' : barangay }); } },
                                { label: 'Sector', value: sector, displayValue: sector, onRemove: () => { setSector(''); router.get(route('profiles.index'), { search, barangay: barangay === 'All Barangays' ? '' : barangay }); } },
                                { label: 'Barangay', value: barangay, onRemove: () => { setBarangay('All Barangays'); router.get(route('profiles.index'), { search, sector }); } },
                            ]}
                            onClearAll={resetFilters}
                        />

                        <DataTable
                            data={profiles.data}
                            columns={columns}
                            emptyMessage="No beneficiary profiles found."
                            emptyActionLink={route('profiles.create')}
                            emptyActionLabel="Add Profile"
                            pagination={{
                                links: profiles.links,
                                from: profiles.from,
                                to: profiles.to,
                                total: profiles.total,
                                onNavigate: (url) => router.get(url, {}, { preserveState: true }),
                            }}
                        />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}