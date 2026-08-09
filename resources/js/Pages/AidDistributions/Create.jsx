import Sidebar from '@/Layouts/Sidebar';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { isActuallyOnline, saveDistributionOffline } from '@/offline/offlineSubmit';
import { TextInput, Select, SelectItem, Textarea } from '@tremor/react';
import { RiAlertLine, RiCheckLine } from '@remixicon/react';

export default function Create({ profiles, programs, commodities }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        profile_id: '', program_id: '', commodity_id: '', aid_type: '',
        description: '', quantity: '', unit: '', distribution_date: '', remarks: '',
        confirmed_duplicate: false, confirmed_over_allocation: false,
    });

    const [warnings, setWarnings] = useState(null);
    const [offlineMessage, setOfflineMessage] = useState(null);
    const [submittingOffline, setSubmittingOffline] = useState(false);

    useEffect(() => {
        if (flash.warnings) setWarnings(flash.warnings);
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
            setData({
                profile_id: '', program_id: '', commodity_id: '', aid_type: '',
                description: '', quantity: '', unit: '', distribution_date: '', remarks: '',
                confirmed_duplicate: false, confirmed_over_allocation: false,
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
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Record Aid Distribution</h2>}>
            <Head title="Record Aid Distribution" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                        {offlineMessage && (
                            <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <RiCheckLine className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                <p className="text-sm text-blue-800">{offlineMessage}</p>
                            </div>
                        )}

                        {warnings && (
                            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <RiAlertLine className="h-5 w-5 text-amber-600" />
                                    <h3 className="text-sm font-medium text-amber-800">Please confirm before proceeding</h3>
                                </div>
                                <ul className="mb-4 list-inside list-disc text-sm text-amber-700">
                                    {warnings.is_duplicate && <li>This beneficiary already received aid under this program.</li>}
                                    {warnings.exceeds_allocation && (
                                        <li>This distribution exceeds the program's remaining allocation ({warnings.remaining_quantity} remaining).</li>
                                    )}
                                </ul>
                                <div className="flex gap-3">
                                    <button onClick={confirmAndResubmit} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                                        Confirm and Save Anyway
                                    </button>
                                    <button onClick={() => setWarnings(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Beneficiary</label>
                                <Select value={data.profile_id} onValueChange={(v) => setData('profile_id', v)} placeholder="Select...">
                                    {profiles.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.first_name} {p.last_name} ({p.sector})
                                        </SelectItem>
                                    ))}
                                </Select>
                                {errors.profile_id && <p className="mt-1 text-sm text-red-600">{errors.profile_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Program</label>
                                <Select value={data.program_id} onValueChange={(v) => setData('program_id', v)} placeholder="Select...">
                                    {programs.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name} ({p.remaining_quantity} {p.unit} remaining)
                                        </SelectItem>
                                    ))}
                                </Select>
                                {errors.program_id && <p className="mt-1 text-sm text-red-600">{errors.program_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Commodity (optional)</label>
                                <Select value={data.commodity_id} onValueChange={(v) => setData('commodity_id', v)} placeholder="None / Not applicable">
                                    {commodities.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Aid Type</label>
                                <TextInput
                                    value={data.aid_type}
                                    onValueChange={(v) => setData('aid_type', v)}
                                    placeholder={selectedProgram?.aid_type || ''}
                                    error={!!errors.aid_type}
                                    errorMessage={errors.aid_type}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                                    <TextInput
                                        type="number"
                                        value={data.quantity}
                                        onValueChange={(v) => setData('quantity', v)}
                                        error={!!errors.quantity}
                                        errorMessage={errors.quantity}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Unit</label>
                                    <TextInput
                                        value={data.unit}
                                        onValueChange={(v) => setData('unit', v)}
                                        placeholder={selectedProgram?.unit || ''}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Distribution Date</label>
                                <input
                                    type="date"
                                    value={data.distribution_date}
                                    onChange={(e) => setData('distribution_date', e.target.value)}
                                    className="block w-full rounded-tremor-default border border-gray-300 px-3 py-2 text-sm shadow-tremor-input focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                />
                                {errors.distribution_date && <p className="mt-1 text-sm text-red-600">{errors.distribution_date}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                <TextInput value={data.description} onValueChange={(v) => setData('description', v)} />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Remarks</label>
                                <Textarea value={data.remarks} onValueChange={(v) => setData('remarks', v)} rows={2} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || submittingOffline}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {submittingOffline ? 'Saving locally...' : 'Record Distribution'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}