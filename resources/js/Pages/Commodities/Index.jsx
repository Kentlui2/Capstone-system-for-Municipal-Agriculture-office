import Sidebar from '@/Layouts/Sidebar';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { RiAddLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';

const categoryColor = { Crops: 'green', Aquatic: 'blue', Livestock: 'amber' };

export default function Index({ commodities, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const addForm = useForm({ name: '', category: 'Crops', status: 'active' });
    const editForm = useForm({ name: '', category: '', status: '' });

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

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('commodities.store'), {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                setShowAddForm(false);
            },
        });
    };

    const startEdit = (commodity) => {
        setEditingId(commodity.id);
        editForm.setData({ name: commodity.name, category: commodity.category, status: commodity.status });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('commodities.update', editingId), {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
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
                    <button onClick={() => startEdit(info.row.original)} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
                        <RiEditLine className="h-4 w-4" /> Edit
                    </button>
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
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                            <RiAddLine className="h-4 w-4" />
                            {showAddForm ? 'Cancel' : 'Add Commodity'}
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Commodities" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                        {/* Filter bar */}
                        <div className="mb-6 flex flex-wrap items-end gap-3">
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

                        {/* Inline add form */}
                        {showAddForm && (
                            <form onSubmit={submitAdd} className="mb-6 flex items-end gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                                <div>
                                    <label className="block text-xs text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        className="mt-1 rounded-lg border-gray-300 text-sm"
                                    />
                                    {addForm.errors.name && <p className="text-xs text-red-600">{addForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Category</label>
                                    <select
                                        value={addForm.data.category}
                                        onChange={(e) => addForm.setData('category', e.target.value)}
                                        className="mt-1 rounded-lg border-gray-300 text-sm"
                                    >
                                        <option value="Crops">Crops</option>
                                        <option value="Aquatic">Aquatic</option>
                                        <option value="Livestock">Livestock</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={addForm.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                    Save
                                </button>
                            </form>
                        )}

                        {/* Inline edit form (shown above table when editing) */}
                        {editingId && (
                            <form onSubmit={submitEdit} className="mb-6 flex items-end gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                <div>
                                    <label className="block text-xs text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="mt-1 rounded-lg border-gray-300 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Category</label>
                                    <select
                                        value={editForm.data.category}
                                        onChange={(e) => editForm.setData('category', e.target.value)}
                                        className="mt-1 rounded-lg border-gray-300 text-sm"
                                    >
                                        <option value="Crops">Crops</option>
                                        <option value="Aquatic">Aquatic</option>
                                        <option value="Livestock">Livestock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Status</label>
                                    <select
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                        className="mt-1 rounded-lg border-gray-300 text-sm"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={editForm.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                    Save
                                </button>
                                <button type="button" onClick={() => setEditingId(null)} className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">
                                    Cancel
                                </button>
                            </form>
                        )}

                        <DataTable
                            data={commodities}
                            columns={columns}
                            emptyMessage="No commodities found."
                        />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}