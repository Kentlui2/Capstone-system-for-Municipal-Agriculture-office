import Sidebar from '@/Layouts/Sidebar';
import Modal from '@/Components/Modal';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ programs, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);

    const [aidType, setAidType] = useState(filters.aid_type || '');
    const [status, setStatus] = useState(filters.status || '');

    const emptyForm = {
        name: '',
        description: '',
        aid_type: 'Seeds',
        allocated_quantity: '',
        unit: '',
        funding_source: '',
        start_date: '',
        end_date: '',
        status: 'active',
    };

    const addForm = useForm(emptyForm);
    const editForm = useForm(emptyForm);

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('aid-programs.store'), {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                setShowAddForm(false);
            },
        });
    };

    const startEdit = (program) => {
        setEditingProgram(program);
        editForm.setData({
            name: program.name,
            description: program.description || '',
            aid_type: program.aid_type,
            allocated_quantity: program.allocated_quantity,
            unit: program.unit,
            funding_source: program.funding_source || '',
            start_date: program.start_date || '',
            end_date: program.end_date || '',
            status: program.status,
        });
    };

    const closeEdit = () => {
        setEditingProgram(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('aid-programs.update', editingProgram.id), {
            preserveScroll: true,
            onSuccess: () => closeEdit(),
        });
    };

    const deleteProgram = (program) => {
        if (!confirm(`Delete "${program.name}"? This cannot be undone.`)) {
            return;
        }

        router.delete(route('aid-programs.destroy', program.id), { preserveScroll: true });
    };

    const applyFilters = () => {
        router.get(route('aid-programs.index'), { aid_type: aidType, status }, { preserveState: true });
    };

    const resetFilters = () => {
        setAidType('');
        setStatus('');
        router.get(route('aid-programs.index'));
    };

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Aid Programs</h2>
                    {isAdmin && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            {showAddForm ? 'Cancel' : '+ Add Program'}
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Aid Programs" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        {/* Filter bar */}
                        <div className="mb-6 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Aid Type</label>
                                <select
                                    value={aidType}
                                    onChange={(e) => setAidType(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
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
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <button
                                onClick={applyFilters}
                                className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900"
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
                            <form onSubmit={submitAdd} className="mb-6 space-y-3 rounded border border-gray-200 p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500">Name</label>
                                        <input
                                            type="text"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                        {addForm.errors.name && <p className="text-xs text-red-600">{addForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Aid Type</label>
                                        <select
                                            value={addForm.data.aid_type}
                                            onChange={(e) => addForm.setData('aid_type', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        >
                                            <option>Seeds</option>
                                            <option>Fertilizer</option>
                                            <option>Equipment</option>
                                            <option>Cash Incentive</option>
                                            <option>Livelihood</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Allocated Quantity</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={addForm.data.allocated_quantity}
                                            onChange={(e) => addForm.setData('allocated_quantity', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                        {addForm.errors.allocated_quantity && <p className="text-xs text-red-600">{addForm.errors.allocated_quantity}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Unit</label>
                                        <input
                                            type="text"
                                            placeholder="kg, bags, PHP..."
                                            value={addForm.data.unit}
                                            onChange={(e) => addForm.setData('unit', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Funding Source</label>
                                        <input
                                            type="text"
                                            value={addForm.data.funding_source}
                                            onChange={(e) => addForm.setData('funding_source', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Description</label>
                                        <input
                                            type="text"
                                            value={addForm.data.description}
                                            onChange={(e) => addForm.setData('description', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Start Date</label>
                                        <input
                                            type="date"
                                            value={addForm.data.start_date}
                                            onChange={(e) => addForm.setData('start_date', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">End Date</label>
                                        <input
                                            type="date"
                                            value={addForm.data.end_date}
                                            onChange={(e) => addForm.setData('end_date', e.target.value)}
                                            className="mt-1 w-full rounded border-gray-300 text-sm"
                                        />
                                        {addForm.errors.end_date && <p className="text-xs text-red-600">{addForm.errors.end_date}</p>}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                >
                                    Save Program
                                </button>
                            </form>
                        )}

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-sm font-medium text-gray-500">
                                    <th className="pb-3 pr-4">Name</th>
                                    <th className="pb-3 pr-4">Type</th>
                                    <th className="pb-3 pr-4">Allocated</th>
                                    <th className="pb-3 pr-4">Remaining</th>
                                    <th className="pb-3 pr-4">Utilization</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    {isAdmin && <th className="pb-3">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {programs.map((program) => (
                                    <tr key={program.id}>
                                        <td className="py-3 pr-4">{program.name}</td>
                                        <td className="py-3 pr-4">{program.aid_type}</td>
                                        <td className="py-3 pr-4">{program.allocated_quantity} {program.unit}</td>
                                        <td className="py-3 pr-4">
                                            <span className={program.remaining_quantity < 0 ? 'font-medium text-red-600' : ''}>
                                                {program.remaining_quantity} {program.unit}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">{program.utilization_rate}%</td>
                                        <td className="py-3 pr-4 capitalize">{program.status}</td>
                                        {isAdmin && (
                                            <td className="space-x-2 py-3">
                                                <button
                                                    onClick={() => startEdit(program)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProgram(program)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                                <Link
                                                    href={route('aid-programs.show', program.id)}
                                                    className="text-gray-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {programs.length === 0 && (
                            <p className="py-8 text-center text-sm text-gray-500">No aid programs yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={editingProgram !== null} onClose={closeEdit}>
                <form onSubmit={submitEdit} className="p-6">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                        Edit {editingProgram?.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500">Name</label>
                            <input
                                type="text"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                            {editForm.errors.name && <p className="text-xs text-red-600">{editForm.errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">Aid Type</label>
                            <select
                                value={editForm.data.aid_type}
                                onChange={(e) => editForm.setData('aid_type', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            >
                                <option>Seeds</option>
                                <option>Fertilizer</option>
                                <option>Equipment</option>
                                <option>Cash Incentive</option>
                                <option>Livelihood</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">Allocated Quantity</label>
                            <input
                                type="number"
                                step="0.01"
                                value={editForm.data.allocated_quantity}
                                onChange={(e) => editForm.setData('allocated_quantity', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                            {editForm.errors.allocated_quantity && <p className="text-xs text-red-600">{editForm.errors.allocated_quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">Unit</label>
                            <input
                                type="text"
                                value={editForm.data.unit}
                                onChange={(e) => editForm.setData('unit', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">Funding Source</label>
                            <input
                                type="text"
                                value={editForm.data.funding_source}
                                onChange={(e) => editForm.setData('funding_source', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">Status</label>
                            <select
                                value={editForm.data.status}
                                onChange={(e) => editForm.setData('status', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">Start Date</label>
                            <input
                                type="date"
                                value={editForm.data.start_date}
                                onChange={(e) => editForm.setData('start_date', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">End Date</label>
                            <input
                                type="date"
                                value={editForm.data.end_date}
                                onChange={(e) => editForm.setData('end_date', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                            {editForm.errors.end_date && <p className="text-xs text-red-600">{editForm.errors.end_date}</p>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs text-gray-500">Description</label>
                            <input
                                type="text"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                className="mt-1 w-full rounded border-gray-300 text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeEdit}
                            className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </Sidebar>
    );
}