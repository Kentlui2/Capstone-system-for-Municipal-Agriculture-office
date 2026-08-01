import Sidebar from '@/Layouts/Sidebar';
import { Head, useForm, router } from '@inertiajs/react';
import SortableHeader from '@/Components/SortableHeader';
import { useState } from 'react';

export default function Index({ users, filters }) {
    // Separate form instances per row would be messy with many users,
    // so we use router.patch/delete directly for simple field updates instead.

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

    const updateStatus = (user, status) => {
        console.log('Sending:', { status, role: user.role });
        router.patch(route('user-accounts.update', user.id), {
            status,
            role: user.role, // keep existing role unless explicitly changed
        }, {
            preserveScroll: true,
        });
    };

    const updateRole = (user, role) => {
        router.patch(route('user-accounts.update', user.id), {
            status: user.status, // keep existing status unless explicitly changed
            role,
        }, {
            preserveScroll: true,
        });
    };

    const deleteUser = (user) => {
        if (!confirm(`Remove ${user.name}'s account? This cannot be undone.`)) {
            return;
        }

        router.delete(route('user-accounts.destroy', user.id), {
            preserveScroll: true,
        });
    };

    const statusBadgeClass = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <Sidebar
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Account Management
                </h2>
            }
        >
            <Head title="User Accounts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto p-6">

                            {/* Filter bar */}
                            <div className="mb-6 flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="mt-1 rounded border-gray-300 text-sm"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="encoder">Encoder</option>
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
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
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

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-sm font-medium text-gray-500">
                                        <SortableHeader label="Name" field="name" currentSort={filters.sort} currentDirection={filters.direction} routeName="user-accounts.index" otherParams={{ role, status }} />
                                        <SortableHeader label="Email" field="email" currentSort={filters.sort} currentDirection={filters.direction} routeName="user-accounts.index" otherParams={{ role, status }} />
                                        <SortableHeader label="Role" field="role" currentSort={filters.sort} currentDirection={filters.direction} routeName="user-accounts.index" otherParams={{ role, status }} />
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="py-3 pr-4">{user.name}</td>
                                            <td className="py-3 pr-4">{user.email}</td>
                                            <td className="py-3 pr-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateRole(user, e.target.value)}
                                                    className="rounded border-gray-300 text-sm"
                                                >
                                                    <option value="encoder">Encoder</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass[user.status]}`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="space-x-2 py-3">
                                                {user.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateStatus(user, 'approved')}
                                                        className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {user.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateStatus(user, 'rejected')}
                                                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteUser(user)}
                                                    className="rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}