import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ program, profiles }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">{program.name}</h2>}
        >
            <Head title={program.name} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Aid Type</dt>
                                <dd>{program.aid_type}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Status</dt>
                                <dd className="capitalize">{program.status}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Allocated</dt>
                                <dd>{program.allocated_quantity} {program.unit}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Remaining</dt>
                                <dd>{program.remaining_quantity} {program.unit}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">
                            Beneficiaries ({profiles.length})
                        </h3>
                        {profiles.length === 0 ? (
                            <p className="text-sm text-gray-500">No beneficiaries have received aid under this program yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-sm font-medium text-gray-500">
                                        <th className="pb-2 pr-4">Name</th>
                                        <th className="pb-2 pr-4">Sector</th>
                                        <th className="pb-2 pr-4">Barangay</th>
                                        <th className="pb-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {profiles.map((profile) => (
                                        <tr key={profile.id}>
                                            <td className="py-2 pr-4">{profile.first_name} {profile.last_name}</td>
                                            <td className="py-2 pr-4 capitalize">{profile.sector}</td>
                                            <td className="py-2 pr-4">{profile.barangay}</td>
                                            <td className="py-2">
                                                <Link
                                                    href={route('profiles.show', profile.id)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    View Profile
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}