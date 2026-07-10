import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ distributions }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Aid Distributions</h2>
                    <Link
                        href={route('aid-distributions.create')}
                        className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    >
                        + Record Distribution
                    </Link>
                </div>
            }
        >
            <Head title="Aid Distributions" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-sm font-medium text-gray-500">
                                    <th className="pb-3 pr-4">Beneficiary</th>
                                    <th className="pb-3 pr-4">Program</th>
                                    <th className="pb-3 pr-4">Quantity</th>
                                    <th className="pb-3 pr-4">Date</th>
                                    <th className="pb-3 pr-4">Flags</th>
                                    <th className="pb-3 pr-4">Encoded By</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {distributions.data.map((d) => (
                                    <tr key={d.id}>
                                        <td className="py-3 pr-4">
                                            {d.profile.first_name} {d.profile.last_name}
                                        </td>
                                        <td className="py-3 pr-4">{d.program.name}</td>
                                        <td className="py-3 pr-4">{d.quantity} {d.unit}</td>
                                        <td className="py-3 pr-4">{d.distribution_date}</td>
                                        <td className="py-3 pr-4">
                                            {d.is_flagged && (
                                                <span className="mr-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                                                    Duplicate
                                                </span>
                                            )}
                                            {d.exceeds_allocation && (
                                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                                    Over-allocated
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4">{d.encoder.name}</td>
                                        <td className="py-3">
                                            <Link
                                                href={route('aid-distributions.show', d.id)}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {distributions.data.length === 0 && (
                            <p className="py-8 text-center text-sm text-gray-500">No distributions recorded yet.</p>
                        )}

                        <div className="mt-4 flex justify-center gap-2">
                            {distributions.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-3 py-1 text-sm ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}