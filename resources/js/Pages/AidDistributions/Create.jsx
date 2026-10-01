import Sidebar from '@/Layouts/Sidebar';
import FormWizard from '@/Components/FormWizard';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';
import { isActuallyOnline, saveDistributionOffline } from '@/offline/offlineSubmit';
import { Select, SelectItem, Textarea, TextInput } from '@tremor/react';
import { RiAlertLine, RiCheckLine, RiArrowLeftLine, RiArrowRightLine, RiSearchLine, RiCloseLine, RiUserLine } from '@remixicon/react';

const DISTRIBUTION_STEPS = [
    { id: 1, title: 'Recipient & Program', description: 'Select beneficiaries & program' },
    { id: 2, title: 'Distribution Details', description: 'Date & remarks' },
];

function BeneficiaryMultiSelect({ profiles, selected, onChange }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
        if (!search.trim()) return profiles;
        const q = search.toLowerCase();
        return profiles.filter(
            (p) =>
                p.first_name.toLowerCase().includes(q) ||
                p.last_name.toLowerCase().includes(q) ||
                p.barangay.toLowerCase().includes(q) ||
                p.sector.toLowerCase().includes(q),
        );
    }, [profiles, search]);

    const isChecked = (id) => selected.includes(String(id));

    const toggle = (id) => {
        const sid = String(id);
        if (selected.includes(sid)) {
            onChange(selected.filter((s) => s !== sid));
        } else {
            onChange([...selected, sid]);
        }
    };

    const removeOne = (id) => onChange(selected.filter((s) => s !== String(id)));

    const selectedProfiles = profiles.filter((p) => selected.includes(String(p.id)));

    return (
        <div className="relative">
            {selectedProfiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {selectedProfiles.map((p) => (
                        <span key={p.id} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                            <RiUserLine className="h-3 w-3" />
                            {p.first_name} {p.last_name}
                            <button type="button" onClick={() => removeOne(p.id)} className="ml-0.5 rounded-full hover:bg-emerald-200 p-0.5">
                                <RiCloseLine className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between rounded-tremor-default border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-tremor-input hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
            >
                <span className={selected.length === 0 ? 'text-gray-400' : ''}>
                    {selected.length === 0 ? 'Select beneficiaries...' : selected.length + ' beneficiar' + (selected.length === 1 ? 'y' : 'ies') + ' selected'}
                </span>
                <RiSearchLine className="h-4 w-4 text-gray-400" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <RiSearchLine className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search name, barangay or sector..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-1.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
                            />
                        </div>
                    </div>
                    <ul className="max-h-52 overflow-y-auto divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-500 text-center">No matches found.</li>
                        ) : (
                            filtered.map((p) => (
                                <li key={p.id}>
                                    <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-emerald-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isChecked(p.id)}
                                            onChange={() => toggle(p.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="flex-1 text-sm">
                                            <span className="font-medium text-gray-900">{p.first_name} {p.last_name}</span>
                                            <span className="ml-1.5 text-xs text-gray-500 capitalize">{p.sector} &middot; {p.barangay}</span>
                                        </span>
                                    </label>
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="border-t border-gray-100 px-3 py-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{selected.length} selected</span>
                        <button type="button" onClick={() => setOpen(false)} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">Done</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Create({ profiles, programs }) {
    const { flash } = usePage().props;
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        profile_ids: [],
        program_id: '',
        distribution_date: '',
        description: '',
        remarks: '',
        confirmed_duplicate: false,
        confirmed_over_allocation: false,
    });

    const [warnings, setWarnings] = useState(null);
    const [offlineMessage, setOfflineMessage] = useState(null);
    const [submittingOffline, setSubmittingOffline] = useState(false);

    useEffect(() => {
        if (flash.warnings) setWarnings(flash.warnings);
    }, [flash.warnings]);

    const submit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (currentStep < 2) {
            setCurrentStep(2);
            return;
        }

        const online = await isActuallyOnline();
        if (!online) {
            setSubmittingOffline(true);
            const { isDuplicate } = await saveDistributionOffline(data);
            setSubmittingOffline(false);
            setOfflineMessage(
                isDuplicate
                    ? 'Saved locally (flagged as possible duplicate). Will sync and verify when connection is restored.'
                    : 'Saved locally. Will sync automatically when connection is restored.',
            );
            setData({ profile_ids: [], program_id: '', distribution_date: '', description: '', remarks: '', confirmed_duplicate: false, confirmed_over_allocation: false });
            setCurrentStep(1);
            return;
        }
        post(route('aid-distributions.store'), { preserveScroll: true });
    };

    const confirmAndResubmit = () => {
        setData({ ...data, confirmed_duplicate: warnings.is_duplicate, confirmed_over_allocation: warnings.exceeds_allocation });
        setTimeout(() => { post(route('aid-distributions.store'), { preserveScroll: true }); }, 0);
        setWarnings(null);
    };

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Record Aid Distribution</h2>}>
            <Head title="Record Aid Distribution" />
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <FormWizard steps={DISTRIBUTION_STEPS} currentStep={currentStep} onStepChange={setCurrentStep} />

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
                                    {warnings.is_duplicate && <li>One or more beneficiaries already received aid under this program.</li>}
                                    {warnings.exceeds_allocation && (
                                        <li>This distribution exceeds the program remaining allocation ({warnings.remaining_quantity} remaining).</li>
                                    )}
                                </ul>
                                <div className="flex gap-3">
                                    <button onClick={confirmAndResubmit} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">Confirm and Save Anyway</button>
                                    <button onClick={() => setWarnings(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Cancel</button>
                                </div>
                            </div>
                        )}

                        <form
                            onSubmit={submit}
                            className="space-y-4"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (currentStep < 2) setCurrentStep(2);
                                }
                            }}
                        >
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Beneficiaries <span className="text-red-500">*</span></label>
                                        <BeneficiaryMultiSelect profiles={profiles} selected={data.profile_ids} onChange={(ids) => setData('profile_ids', ids)} />
                                        {errors.profile_ids && <p className="mt-1 text-sm text-red-600">{errors.profile_ids}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Aid Program <span className="text-red-500">*</span></label>
                                        <Select value={data.program_id} onValueChange={(v) => setData('program_id', v)} placeholder="Select aid program...">
                                            {programs.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>{p.name} &mdash; {p.aid_type}</SelectItem>
                                            ))}
                                        </Select>
                                        {errors.program_id && <p className="mt-1 text-sm text-red-600">{errors.program_id}</p>}
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Distribution Date <span className="text-red-500">*</span></label>
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
                                        <TextInput value={data.description} onValueChange={(v) => setData('description', v)} placeholder="Batch or distribution notes..." />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Remarks</label>
                                        <Textarea value={data.remarks} onValueChange={(v) => setData('remarks', v)} rows={2} placeholder="Additional observations..." />
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                                <div>
                                    {currentStep > 1 ? (
                                        <button type="button" onClick={() => setCurrentStep(1)} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                            <RiArrowLeftLine className="h-4 w-4" /> Previous
                                        </button>
                                    ) : (
                                        <Link href={route('aid-distributions.index')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Cancel</Link>
                                    )}
                                </div>
                                <div>
                                    {currentStep < 2 ? (
                                        <button type="button" onClick={() => setCurrentStep(2)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors">
                                            Next Step <RiArrowRightLine className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button type="submit" disabled={processing || submittingOffline} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                                            <RiCheckLine className="h-4 w-4" /> {submittingOffline ? 'Saving locally...' : 'Record Distribution'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
