import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { isActuallyOnline, saveDistributionOffline } from '@/offline/offlineSubmit';

export default function Create({ profiles, programs }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        profile_id: '',
        program_id: '',
        aid_type: '',
        description: '',
        quantity: '',
        unit: '',
        distribution_date: '',
        remarks: '',
        confirmed_duplicate: false,
        confirmed_over_allocation: false,
    });

    const [warnings, setWarnings] = useState(null);
    const [offlineMessage, setOfflineMessage] = useState(null);
    const [submittingOffline, setSubmittingOffline] = useState(false);

    useEffect(() => {
        if (flash.warnings) {
            setWarnings(flash.warnings);
        }
    }, [flash.warnings]);

    const submit = async (e) => {
        e.preventDefault();

        const online = await isActuallyOnline();

        if (!online) {
            setSubmittingOffline(true);

            const { isDuplicate } = await saveDistributionOffline(data);

            setSubmittingOffline(false);
            setOfflineMessage(
                isDuplicate
                    ? 'Saved locally (flagged as possible duplicate). Will sync and verify when connection is restored.'
                    : 'Saved locally. Will sync automatically when connection is restored.'
            );

            // Reset the form so the Encoder can continue encoding
            // the next distribution while still offline
            setData({
                profile_id: '',
                program_id: '',
                aid_type: '',
                description: '',
                quantity: '',
                unit: '',
                distribution_date: '',
                remarks: '',
                confirmed_duplicate: false,
                confirmed_over_allocation: false,
            });

            return;
        }

        post(route('aid-distributions.store'), { preserveScroll: true });
    };

    const confirmAndResubmit = () => {
        setData({
            ...data,
            confirmed_duplicate: warnings.is_duplicate,
            confirmed_over_allocation: warnings.exceeds_allocation,
        });

        setTimeout(() => {
            post(route('aid-distributions.store'), { preserveScroll: true });
        }, 0);

        setWarnings(null);
    };

    const selectedProgram = programs.find((p) => p.id === parseInt(data.program_id));

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Record Aid Distribution</h2>}
        >
            <Head title="Record Aid Distribution" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        {offlineMessage && (
                            <div className="mb-6 rounded border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800">
                                {offlineMessage}
                            </div>
                        )}

                        {warnings && (
                            <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-4">
                                <h3 className="mb-2 text-sm font-medium text-amber-800">Please confirm before proceeding</h3>
                                <ul className="mb-4 list-inside list-disc text-sm text-amber-700">
                                    {warnings.is_duplicate && (
                                        <li>This beneficiary already received aid under this program.</li>
                                    )}
                                    {warnings.exceeds_allocation && (
                                        <li>
                                            This distribution exceeds the program's remaining allocation
                                            ({warnings.remaining_quantity} remaining).
                                        </li>
                                    )}
                                </ul>
                                <div className="flex gap-3">
                                    <button
                                        onClick={confirmAndResubmit}
                                        className="rounded bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700"
                                    >
                                        Confirm and Save Anyway
                                    </button>
                                    <button
                                        onClick={() => setWarnings(null)}
                                        className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Beneficiary</label>
                                <select
                                    value={data.profile_id}
                                    onChange={(e) => setData('profile_id', e.target.value)}
                                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                                >
                                    <option value="">Select...</option>
                                    {profiles.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.first_name} {p.last_name} ({p.sector})
                                        </option>
                                    ))}
                                </select>
                                {errors.profile_id && <p className="mt-1 text-sm text-red-600">{errors.profile_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Program</label>
                                <select
                                    value={data.program_id}
                                    onChange={(e) => setData('program_id', e.target.value)}
                                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                                >
                                    <option value="">Select...</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.remaining_quantity} {p.unit} remaining)
                                        </option>
                                    ))}
                                </select>
                                {errors.program_id && <p className="mt-1 text-sm text-red-600">{errors.program_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Aid Type</label>
                                <input
                                    type="text"
                                    value={data.aid_type}
                                    onChange={(e) => setData('aid_type', e.target.value)}
                                    placeholder={selectedProgram?.aid_type || ''}
                                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                                />
                                {errors.aid_type && <p className="mt-1 text-sm text-red-600">{errors.aid_type}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                                    />
                                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                                    <input
                                        type="text"
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        placeholder={selectedProgram?.unit || ''}
                                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Distribution Date</label>
                                <input
                                    type="date"
                                    value={data.distribution_date}
                                    onChange={(e) => setData('distribution_date', e.target.value)}
                                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                                />
                                {errors.distribution_date && <p className="mt-1 text-sm text-red-600">{errors.distribution_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                                    rows={2}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || submittingOffline}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {submittingOffline ? 'Saving locally...' : 'Record Distribution'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}