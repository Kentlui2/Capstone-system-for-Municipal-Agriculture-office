import Sidebar from '@/Layouts/Sidebar';
import { Head, Link, router } from '@inertiajs/react';
import SortableHeader from '@/Components/SortableHeader';
import { useState } from 'react';

export default function Index({ distributions, programs, filters }) {
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [flagged, setFlagged] = useState(filters.flagged || '');

    const applyFilters = () => {
        router.get(route('aid-distributions.index'), { program_id: programId, flagged }, { preserveState: true });
    };

    const resetFilters = () => {
        setProgramId('');
        setFlagged('');
        router.get(route('aid-distributions.index'));
    };

    return (
        <Sidebar
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

                        {/* Filter bar */}
                        <div className="mb-6 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-xs text-gray-500">Program</label>
                                <select
                                    value={programId}
                                    onChange={(e) => setProgramId(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">All Programs</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Flagged</label>
                                <select
                                    value={flagged}
                                    onChange={(e) => setFlagged(e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="duplicate">Duplicates Only</option>
                                    <option value="over_allocation">Over-Allocated Only</option>
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
                                    <th className="pb-3 pr-4">Beneficiary</th>
                                    <th className="pb-3 pr-4">Program</th>
                                    <SortableHeader label="Quantity" field="quantity" currentSort={filters.sort} currentDirection={filters.direction} routeName="aid-distributions.index" otherParams={{ program_id: programId, flagged }} />
                                    <SortableHeader label="Date" field="distribution_date" currentSort={filters.sort} currentDirection={filters.direction} routeName="aid-distributions.index" otherParams={{ program_id: programId, flagged }} />
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
        </Sidebar>
    );
}