import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProfileForm from './Partials/ProfileForm';
import { Head, useForm } from '@inertiajs/react';

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

    const submit = (e) => {
        e.preventDefault();
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
                        <form onSubmit={submit} className="space-y-6">
                            <ProfileForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                commodities={commodities}
                            />

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}