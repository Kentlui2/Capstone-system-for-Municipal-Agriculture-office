import Sidebar from '@/Layouts/Sidebar';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { RiAddLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';

import ActiveFilters from '@/Components/ActiveFilters';

const categoryColor = { Crops: 'green', Aquatic: 'blue', Livestock: 'amber' };

export default function Index({ commodities, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(route('commodities.index'), { category, status }, { preserveState: true });
    };

    const resetFilters = () => {
        setCategory('');
        setStatus('');
        router.get(route('commodities.index'));
    };

    const deleteCommodity = (commodity) => {
        if (!confirm(`Delete "${commodity.name}"? This cannot be undone.`)) return;
        router.delete(route('commodities.destroy', commodity.id), { preserveScroll: true });
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: (info) => <Badge color={categoryColor[info.getValue()]}>{info.getValue()}</Badge>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => <Badge color={info.getValue() === 'active' ? 'green' : 'gray'}>{info.getValue()}</Badge>,
        },
        ...(isAdmin ? [{
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: (info) => (
                <div className="flex gap-3">
                    <Link href={route('commodities.edit', info.row.original.id)} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
                        <RiEditLine className="h-4 w-4" /> Edit
                    </Link>
                    <button onClick={() => deleteCommodity(info.row.original)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                        <RiDeleteBinLine className="h-4 w-4" /> Delete
                    </button>
                </div>
            ),
        }] : []),
    ], [isAdmin]);

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Commodities</h2>
                    {isAdmin && (
                        <Link
                            href={route('commodities.create')}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                            <RiAddLine className="h-4 w-4" /> Add Commodity
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Commodities" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                        <div className="mb-4 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                    <option value="">All Categories</option>
                                    <option value="Crops">Crops</option>
                                    <option value="Aquatic">Aquatic</option>
                                    <option value="Livestock">Livestock</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 rounded-lg border-gray-300 text-sm">
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <button onClick={applyFilters} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900">Filter</button>
                            <button onClick={resetFilters} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Reset</button>
                        </div>

                        <ActiveFilters
                            filters={[
                                { label: 'Category', value: category, displayValue: category, onRemove: () => { setCategory(''); router.get(route('commodities.index'), { status }); } },
                                { label: 'Status', value: status, displayValue: status, onRemove: () => { setStatus(''); router.get(route('commodities.index'), { category }); } },
                            ]}
                            onClearAll={resetFilters}
                        />

                        <DataTable
                            data={commodities}
                            columns={columns}
                            emptyMessage="No commodities registered yet."
                            emptyActionLink={isAdmin ? route('commodities.create') : undefined}
                            emptyActionLabel="Add Commodity"
                        />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}