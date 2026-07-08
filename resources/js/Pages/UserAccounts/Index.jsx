import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ users }) {
    // Separate form instances per row would be messy with many users,
    // so we use router.patch/delete directly for simple field updates instead.

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
        <AuthenticatedLayout
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
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-sm font-medium text-gray-500">
                                        <th className="pb-3 pr-4">Name</th>
                                        <th className="pb-3 pr-4">Email</th>
                                        <th className="pb-3 pr-4">Role</th>
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
        </AuthenticatedLayout>
    );
}