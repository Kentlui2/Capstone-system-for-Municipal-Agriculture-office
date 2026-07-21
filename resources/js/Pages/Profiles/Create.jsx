import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProfileForm from './Partials/ProfileForm';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { isActuallyOnline, saveProfileOffline } from '@/offline/offlineSubmit';

export default function Create({ commodities }) {
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

    const submit = async (e) => {
        e.preventDefault();

        const online = await isActuallyOnline();

        if (!online) {
            setSubmittingOffline(true);

            // Photo uploads are skipped while offline — files aren't
            // practical to queue in IndexedDB. Encoder can attach a
            // photo later via Edit once back online.
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

            return;
        }

        post(route('profiles.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Add Profile</h2>}
        >
            <Head title="Add Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">

                        {offlineMessage && (
                            <div className="mb-6 rounded border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800">
                                {offlineMessage}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <ProfileForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                commodities={commodities}
                            />

                            <button
                                type="submit"
                                disabled={processing || submittingOffline}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {submittingOffline ? 'Saving locally...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}