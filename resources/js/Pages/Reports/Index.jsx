import Sidebar from '@/Layouts/Sidebar';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { BARANGAYS } from '@/constants/barangays';
import { RiFilePdfLine, RiFileExcelLine, RiDownloadLine, RiSearchLine, RiFileTextLine } from '@remixicon/react';

const sectorColor = { farmer: 'green', fisherfolk: 'blue', raiser: 'amber' };

export default function Index({ profiles }) {
    const [sector, setSector] = useState('');
    const [barangay, setBarangay] = useState('');
    const [searchProfile, setSearchProfile] = useState('');

    const filteredProfiles = useMemo(() => {
        if (!searchProfile.trim()) return profiles;
        const q = searchProfile.toLowerCase();
        return profiles.filter(
            (p) =>
                p.first_name.toLowerCase().includes(q) ||
                p.last_name.toLowerCase().includes(q) ||
                p.barangay.toLowerCase().includes(q)
        );
    }, [profiles, searchProfile]);

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => (
                <span className="font-medium text-gray-900">
                    {info.row.original.first_name} {info.row.original.last_name}
                </span>
            ),
        },
        {
            accessorKey: 'sector',
            header: 'Sector',
            cell: (info) => (
                <Badge color={sectorColor[info.getValue()] || 'gray'}>
                    <span className="capitalize">{info.getValue()}</span>
                </Badge>
            ),
        },
        {
            accessorKey: 'barangay',
            header: 'Barangay',
            cell: (info) => info.getValue(),
        },
        {
            id: 'actions',
            header: 'Action',
            enableSorting: false,
            cell: (info) => (
                <a
                    href={route('reports.profile-sheet', info.row.original.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800"
                >
                    <RiDownloadLine className="h-4 w-4" /> Download PDF
                </a>
            ),
        },
    ], []);

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Reports</h2>}>
            <Head title="Reports" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-8">

                    {/* Bulk Export Section */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <RiFileTextLine className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Bulk Beneficiary List Export</h3>
                                <p className="text-xs text-gray-500">
                                    Export full lists of registered beneficiaries with filtered details in PDF or Excel format.
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Sector Filter</label>
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">All Sectors</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="fisherfolk">Fisherfolk</option>
                                    <option value="raiser">Raiser</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500">Barangay Filter</label>
                                <select
                                    value={barangay}
                                    onChange={(e) => setBarangay(e.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">All Barangays</option>
                                    {BARANGAYS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href={route('reports.bulk-pdf', { sector, barangay })}
                                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                            >
                                <RiFilePdfLine className="h-4 w-4" /> Download PDF Report
                            </a>

                            <a
                                href={route('reports.bulk-excel', { sector, barangay })}
                                className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                            >
                                <RiFileExcelLine className="h-4 w-4" /> Download Excel Report
                            </a>
                        </div>
                    </div>

                    {/* Single Profile Sheet Section */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Individual Profile Sheets</h3>
                                <p className="text-xs text-gray-500">
                                    Generate printable PDF summary sheets for individual beneficiaries.
                                </p>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <RiSearchLine className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search beneficiary..."
                                    value={searchProfile}
                                    onChange={(e) => setSearchProfile(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 pl-9 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <DataTable data={filteredProfiles} columns={columns} emptyMessage="No profiles found." />
                    </div>

                </div>
            </div>
        </Sidebar>
    );
}