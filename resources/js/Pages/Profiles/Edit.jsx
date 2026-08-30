import Sidebar from '@/Layouts/Sidebar';
import ProfileForm from './Partials/ProfileForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ profile, commodities }) {
    // Reshape the loaded sectorProfiles (array of {field_name, field_value})
    // back into a flat object the form expects: { field_name: field_value }
    const initialSectorFields = Object.fromEntries(
        profile.sector_profiles.map((sp) => [sp.field_name, sp.field_value])
    );

    // Reshape loaded commodities (with pivot data) into the flat row
    // format CommodityPicker expects
    const initialCommodities = profile.commodities.map((c) => ({
        commodity_id: c.id,
        variety: c.pivot.variety,
        area_hectares: c.pivot.area_hectares,
        no_of_hills_trees: c.pivot.no_of_hills_trees,
        no_of_heads: c.pivot.no_of_heads,
        no_of_stocks: c.pivot.no_of_stocks,
        production_type: c.pivot.production_type,
    }));

    const { data, setData, post, processing, errors } = useForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        birthdate: profile.birthdate,
        sex: profile.sex,
        barangay: profile.barangay,
        street_address: profile.street_address || '',
        contact_number: profile.contact_number || '',
        sector: profile.sector,
        photo: null,
        sector_fields: initialSectorFields,
        commodities: initialCommodities,
        _method: 'put', // Inertia workaround for file uploads on PUT/PATCH requests
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profiles.update', profile.id), { forceFormData: true });
    };

    return (
        <Sidebar
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>}
        >
            <Head title="Edit Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <ProfileForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                commodities={commodities}
                                existingPhotoUrl={profile.photo_path ? `/storage/${profile.photo_path}` : null}
                            />

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}