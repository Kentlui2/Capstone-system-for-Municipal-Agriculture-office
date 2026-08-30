import Sidebar from '@/Layouts/Sidebar';
import ProfileForm from './Partials/ProfileForm';
import FormWizard from '@/Components/FormWizard';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { isActuallyOnline, saveProfileOffline } from '@/offline/offlineSubmit';
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine } from '@remixicon/react';

const PROFILE_STEPS = [
    { id: 1, title: 'Personal Info', description: 'Name & contact details' },
    { id: 2, title: 'Location & Sector', description: 'Address & classification' },
    { id: 3, title: 'Sector Details', description: 'Commodities & farm assets' },
];

export default function Create({ commodities }) {
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        birthdate: '',
        sex: '',
        barangay: '',
        street_address: '',
        contact_number: '',
        sector: '',
        photo: null,
        sector_fields: {},
        commodities: [],
    });

    const [offlineMessage, setOfflineMessage] = useState(null);
    const [submittingOffline, setSubmittingOffline] = useState(false);

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const submit = async (e) => {
        e.preventDefault();

        const online = await isActuallyOnline();

        if (!online) {
            setSubmittingOffline(true);
            const { photo, ...profileDataWithoutPhoto } = data;
            await saveProfileOffline(profileDataWithoutPhoto);

            setSubmittingOffline(false);
            setOfflineMessage(
                'Saved locally (without photo, if any was selected). Will sync automatically when connection is restored.'
            );

            setData({
                first_name: '',
                last_name: '',
                birthdate: '',
                sex: '',
                barangay: '',
                street_address: '',
                contact_number: '',
                sector: '',
                photo: null,
                sector_fields: {},
                commodities: [],
            });

            setCurrentStep(1);
            return;
        }

        post(route('profiles.store'), { forceFormData: true });
    };

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Add Beneficiary Profile</h2>}>
            <Head title="Add Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-xl border border-gray-100">

                        <FormWizard steps={PROFILE_STEPS} currentStep={currentStep} onStepChange={setCurrentStep} />

                        {offlineMessage && (
                            <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 flex items-center gap-2">
                                <RiCheckLine className="h-5 w-5 text-blue-600 shrink-0" />
                                <span>{offlineMessage}</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <ProfileForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                commodities={commodities}
                                currentStep={currentStep}
                            />

                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                                <div>
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            <RiArrowLeftLine className="h-4 w-4" /> Previous
                                        </button>
                                    ) : (
                                        <Link
                                            href={route('profiles.index')}
                                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                        >
                                            Cancel
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                                        >
                                            Next Step <RiArrowRightLine className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing || submittingOffline}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                        >
                                            <RiCheckLine className="h-4 w-4" /> Save Profile
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