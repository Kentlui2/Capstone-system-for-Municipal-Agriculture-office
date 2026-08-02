import Sidebar from '@/Layouts/Sidebar';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Badge from '@/Components/Badge';
import { RiCheckLine, RiCloseLine, RiDeleteBinLine, RiMailLine } from '@remixicon/react';

const statusColor = { pending: 'amber', approved: 'green', rejected: 'red' };

export default function Index({ users, filters }) {
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(route('user-accounts.index'), { role, status }, { preserveState: true });
    };

    const resetFilters = () => {
        setRole('');
        setStatus('');
        router.get(route('user-accounts.index'));
    };

    const updateUser = (user, changes) => {
        router.patch(route('user-accounts.update', user.id), {
            role: user.role,
            status: user.status,
            ...changes,
        }, { preserveScroll: true });
    };

    const deleteUser = (user) => {
        if (!confirm(`Remove ${user.name}'s account? This cannot be undone.`)) return;
        router.delete(route('user-accounts.destroy', user.id), { preserveScroll: true });
    };

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">User Account Management</h2>}>
            <Head title="User Accounts" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* Grid list of user cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {users.map((user) => (
                            <div key={user.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                                <RiMailLine className="h-3.5 w-3.5" /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge color={statusColor[user.status]}>{user.status}</Badge>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs text-gray-500">Role</label>
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUser(user, { role: e.target.value })}
                                        className="mt-1 w-full rounded-lg border-gray-300 text-sm"
                                    >
                                        <option value="encoder">Encoder</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    {user.status !== 'approved' && (
                                        <button
                                            onClick={() => updateUser(user, { status: 'approved' })}
                                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                                        >
                                            <RiCheckLine className="h-3.5 w-3.5" /> Approve
                                        </button>
                                    )}
                                    {user.status !== 'rejected' && (
                                        <button
                                            onClick={() => updateUser(user, { status: 'rejected' })}
                                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                                        >
                                            <RiCloseLine className="h-3.5 w-3.5" /> Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteUser(user)}
                                        className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200"
                                    >
                                        <RiDeleteBinLine className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {users.length === 0 && (
                        <p className="py-10 text-center text-sm text-gray-500">No user accounts found.</p>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}