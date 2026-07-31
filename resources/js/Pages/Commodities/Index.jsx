import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ commodities, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const addForm = useForm({ name: '', category: 'Crops', status: 'active' });
    const editForm = useForm({ name: '', category: '', status: '' });

    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');

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
        editForm.setData({
            name: commodity.name,
            category: commodity.category,
            status: commodity.status,
        });
    };

    const submitEdit = (e, commodityId) => {
        e.preventDefault();
        editForm.put(route('commodities.update', commodityId), {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const deleteCommodity = (commodity) => {
        if (!confirm(`Delete "${commodity.name}"? This cannot be undone.`)) {
            return;
        }

        router.delete(route('commodities.destroy', commodity.id), { preserveScroll: true });
    };

    const categoryBadgeClass = {
        Crops: 'bg-green-100 text-green-800',
        Aquatic: 'bg-blue-100 text-blue-800',
        Livestock: 'bg-amber-100 text-amber-800',
    };

    const applyFilters = () => {
        router.get(route('commodities.index'), { category, status }, { preserveState: true });
    };

    const resetFilters = () => {
        setCategory('');
        setStatus('');
        router.get(route('commodities.index'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Commodities</h2>
                    {isAdmin && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            {showAddForm ? 'Cancel' : '+ Add Commodity'}
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Commodities" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        {/* Filter bar */}
                        <div className="mb-6 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Crops">Crops</option>
                                    <option value="Aquatic">Aquatic</option>
                                    <option value="Livestock">Livestock</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <button
                                onClick={applyFilters}
                                className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-800"
                            >
                                Filter
                            </button>
                            <button
                                onClick={resetFilters}
                                className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
                            >
                                Reset
                            </button>
                        </div>

                        {showAddForm && (
                            <form onSubmit={submitAdd} className="mb-6 flex items-end gap-3 rounded border border-gray-200 p-4">
                                <div>
                                    <label className="block text-xs text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        className="mt-1 rounded border-gray-300 text-sm"
                                    />
                                    {addForm.errors.name && <p className="text-xs text-red-600">{addForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Category</label>
                                    <select
                                        value={addForm.data.category}
                                        onChange={(e) => addForm.setData('category', e.target.value)}
                                        className="mt-1 rounded border-gray-300 text-sm"
                                    >
                                        <option value="Crops">Crops</option>
                                        <option value="Aquatic">Aquatic</option>
                                        <option value="Livestock">Livestock</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                >
                                    Save
                                </button>
                            </form>
                        )}

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-sm font-medium text-gray-500">
                                    <th className="pb-3 pr-4">Name</th>
                                    <th className="pb-3 pr-4">Category</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    {isAdmin && <th className="pb-3">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {commodities.map((commodity) => (
                                    <tr key={commodity.id}>
                                        {editingId === commodity.id ? (
                                            <>
                                                <td className="py-2 pr-4">
                                                    <input
                                                        type="text"
                                                        value={editForm.data.name}
                                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                                        className="rounded border-gray-300 text-sm"
                                                    />
                                                </td>
                                                <td className="py-2 pr-4">
                                                    <select
                                                        value={editForm.data.category}
                                                        onChange={(e) => editForm.setData('category', e.target.value)}
                                                        className="rounded border-gray-300 text-sm"
                                                    >
                                                        <option value="Crops">Crops</option>
                                                        <option value="Aquatic">Aquatic</option>
                                                        <option value="Livestock">Livestock</option>
                                                    </select>
                                                </td>
                                                <td className="py-2 pr-4">
                                                    <select
                                                        value={editForm.data.status}
                                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                                        className="rounded border-gray-300 text-sm"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="space-x-2 py-2">
                                                    <button
                                                        onClick={(e) => submitEdit(e, commodity.id)}
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-gray-500 hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 pr-4">{commodity.name}</td>
                                                <td className="py-3 pr-4">
                                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${categoryBadgeClass[commodity.category]}`}>
                                                        {commodity.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 capitalize">{commodity.status}</td>
                                                {isAdmin && (
                                                    <td className="space-x-2 py-3">
                                                        <button
                                                            onClick={() => startEdit(commodity)}
                                                            className="text-indigo-600 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCommodity(commodity)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}