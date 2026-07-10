import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ distribution }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Distribution Details</h2>}
        >
            <Head title="Distribution Details" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        {(distribution.is_flagged || distribution.exceeds_allocation) && (
                            <div className="mb-4 flex gap-2">
                                {distribution.is_flagged && (
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                                        Flagged as Duplicate
                                    </span>
                                )}
                                {distribution.exceeds_allocation && (
                                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                        Exceeded Allocation
                                    </span>
                                )}
                            </div>
                        )}

                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Beneficiary</dt>
                                <dd>{distribution.profile.first_name} {distribution.profile.last_name}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Program</dt>
                                <dd>{distribution.program.name}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Aid Type</dt>
                                <dd>{distribution.aid_type}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Quantity</dt>
                                <dd>{distribution.quantity} {distribution.unit}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Distribution Date</dt>
                                <dd>{distribution.distribution_date}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Encoded By</dt>
                                <dd>{distribution.encoder.name}</dd>
                            </div>
                            {distribution.description && (
                                <div className="col-span-2">
                                    <dt className="text-gray-500">Description</dt>
                                    <dd>{distribution.description}</dd>
                                </div>
                            )}
                            {distribution.remarks && (
                                <div className="col-span-2">
                                    <dt className="text-gray-500">Remarks</dt>
                                    <dd>{distribution.remarks}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}