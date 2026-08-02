import Sidebar from '@/Layouts/Sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { RiAddLine, RiEyeLine } from '@remixicon/react';

export default function Index({ distributions, programs, filters }) {
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [flagged, setFlagged] = useState(filters.flagged || '');

    const applyFilters = () => {
        router.get(route('aid-distributions.index'), { program_id: programId, flagged }, { preserveState: true });
    };

    const resetFilters = () => {
        setProgramId('');
        setFlagged('');
        router.get(route('aid-distributions.index'));
    };

    const columns = useMemo(() => [
        {
            id: 'beneficiary',
            header: 'Beneficiary',
            enableSorting: false,
            cell: (info) => `${info.row.original.profile.first_name} ${info.row.original.profile.last_name}`,
        },
        {
            id: 'program',
            header: 'Program',
            enableSorting: false,
            cell: (info) => info.row.original.program.name,
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
            cell: (info) => `${info.getValue()} ${info.row.original.unit}`,
        },
        { accessorKey: 'distribution_date', header: 'Date' },
        {
            id: 'flags',
            header: 'Flags',
            enableSorting: false,
            cell: (info) => (
                <div className="flex gap-1">
                    {info.row.original.is_flagged && <Badge color="amber">Duplicate</Badge>}
                    {info.row.original.exceeds_allocation && <Badge color="red">Over-allocated</Badge>}
                </div>
            ),
        },
        {
            id: 'encoder',
            header: 'Encoded By',
            enableSorting: false,
            cell: (info) => info.row.original.encoder.name,
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: (info) => (
                <Link href={route('aid-distributions.show', info.row.original.id)} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
                    <RiEyeLine className="h-4 w-4" /> View
                </Link>
            ),
        },
    ], []);

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Aid Distributions</h2>
                    <Link
                        href={route('aid-distributions.create')}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        <RiAddLine className="h-4 w-4" />
                        Record Distribution
                    </Link>
                </div>
            }
        >
            <Head title="Aid Distributions" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Program</label>
                                <select value={programId} onChange={(e) => setProgramId(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                    <option value="">All Programs</option>
                                    {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Flagged</label>
                                <select value={flagged} onChange={(e) => setFlagged(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                    <option value="">All</option>
                                    <option value="duplicate">Duplicates Only</option>
                                    <option value="over_allocation">Over-Allocated Only</option>
                                </select>
                            </div>
                            <button onClick={applyFilters} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900">Filter</button>
                            <button onClick={resetFilters} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Reset</button>
                        </div>

                        <DataTable
                            data={distributions.data}
                            columns={columns}
                            emptyMessage="No distributions recorded yet."
                            pagination={{
                                links: distributions.links,
                                from: distributions.from,
                                to: distributions.to,
                                total: distributions.total,
                                onNavigate: (url) => router.get(url, {}, { preserveState: true }),
                            }}
                        />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}