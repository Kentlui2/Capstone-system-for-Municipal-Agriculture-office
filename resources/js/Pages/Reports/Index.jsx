import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';


export default function Index({ profiles }) {
    const [sector, setSector] = useState('');
    const [barangay, setBarangay] = useState('');

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Reports</h2>}
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">

                    {/* Single Profile Sheet */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Profile Sheet (PDF)</h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Download a printable profile sheet for a single beneficiary.
                        </p>

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
                                            <a
                                                href={route('reports.profile-sheet', profile.id)}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                Download PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Bulk Export */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-800">Bulk Beneficiary List</h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Export the full beneficiary list (Name, Address, Sex, Birthdate), optionally filtered.
                        </p>

                        <div className="mb-4 flex gap-3">
                            <select
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                className="rounded border-gray-300 text-sm"
                            >
                                <option value="">All Sectors</option>
                                <option value="farmer">Farmer</option>
                                <option value="fisherfolk">Fisherfolk</option>
                                <option value="raiser">Raiser</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Filter by barangay..."
                                value={barangay}
                                onChange={(e) => setBarangay(e.target.value)}
                                className="rounded border-gray-300 text-sm"
                            />
                        </div>

                        <div className="flex gap-3">

                            <a
                                href={route('reports.bulk-pdf', { sector, barangay })}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                            >
                                Download PDF
                            </a>

                            <a
                                href={route('reports.bulk-excel', { sector, barangay })}
                                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            >
                                Download Excel
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}