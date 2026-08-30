import Sidebar from '@/Layouts/Sidebar';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { RiAddLine, RiDeleteBinLine, RiEyeLine, RiEditLine } from '@remixicon/react';

import ActiveFilters from '@/Components/ActiveFilters';

export default function Index({ programs, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [aidType, setAidType] = useState(filters.aid_type || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(route('aid-programs.index'), { aid_type: aidType, status }, { preserveState: true });
    };

    const resetFilters = () => {
        setAidType('');
        setStatus('');
        router.get(route('aid-programs.index'));
    };

    const deleteProgram = (program) => {
        if (!confirm(`Delete "${program.name}"? This cannot be undone.`)) return;
        router.delete(route('aid-programs.destroy', program.id), { preserveScroll: true });
    };

    const columns = useMemo(() => [
        { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span> },
        { accessorKey: 'aid_type', header: 'Type' },
        { accessorKey: 'allocated_quantity', header: 'Allocated', cell: (info) => `${info.getValue()} ${info.row.original.unit}` },
        {
            accessorKey: 'remaining_quantity', header: 'Remaining', cell: (info) => (
                <span className={info.getValue() < 0 ? 'font-medium text-red-600' : ''}>{info.getValue()} {info.row.original.unit}</span>
            )
        },
        { accessorKey: 'utilization_rate', header: 'Utilization', cell: (info) => `${info.getValue()}%` },
        {
            accessorKey: 'status', header: 'Status', cell: (info) => (
                <Badge color={info.getValue() === 'active' ? 'green' : 'gray'}>{info.getValue()}</Badge>
            )
        },
        {
            id: 'actions', header: 'Actions', enableSorting: false,
            cell: (info) => (
                <div className="flex gap-3">
                    <Link href={route('aid-programs.show', info.row.original.id)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                        <RiEyeLine className="h-4 w-4" /> View
                    </Link>
                    {isAdmin && (
                        <>
                            <Link href={route('aid-programs.edit', info.row.original.id)} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
                                <RiEditLine className="h-4 w-4" /> Edit
                            </Link>
                            <button onClick={() => deleteProgram(info.row.original)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                                <RiDeleteBinLine className="h-4 w-4" /> Delete
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ], [isAdmin]);

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Aid Programs</h2>
                    {isAdmin && (
                        <Link
                            href={route('aid-programs.create')}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                            <RiAddLine className="h-4 w-4" /> Add Program
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Aid Programs" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                        <div className="mb-4 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Aid Type</label>
                                <select value={aidType} onChange={(e) => setAidType(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                    <option value="">All Types</option>
                                    <option value="Seeds">Seeds</option>
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Cash Incentive">Cash Incentive</option>
                                    <option value="Livelihood">Livelihood</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <button onClick={applyFilters} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900">Filter</button>
                            <button onClick={resetFilters} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Reset</button>
                        </div>

                        <ActiveFilters
                            filters={[
                                { label: 'Aid Type', value: aidType, onRemove: () => { setAidType(''); router.get(route('aid-programs.index'), { status }); } },
                                { label: 'Status', value: status, displayValue: status, onRemove: () => { setStatus(''); router.get(route('aid-programs.index'), { aid_type: aidType }); } },
                            ]}
                            onClearAll={resetFilters}
                        />

                        <DataTable
                            data={programs}
                            columns={columns}
                            emptyMessage="No aid programs registered yet."
                            emptyActionLink={isAdmin ? route('aid-programs.create') : undefined}
                            emptyActionLabel="Add Program"
                        />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}