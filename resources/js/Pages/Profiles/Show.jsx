import Sidebar from '@/Layouts/Sidebar';
import { Head, Link } from '@inertiajs/react';

export default function Show({ profile }) {
    const sectorBadgeClass = {
        farmer: 'bg-green-100 text-green-800',
        fisherfolk: 'bg-blue-100 text-blue-800',
        raiser: 'bg-amber-100 text-amber-800',
    };

    return (
        <Sidebar
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {profile.first_name} {profile.last_name}
                    </h2>
                    <Link
                        href={route('profiles.edit', profile.id)}
                        className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900"
                    >
                        Edit
                    </Link>
                </div>
            }
        >
            <Head title={`${profile.first_name} ${profile.last_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">

                    {/* Basic Info */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="mb-4 flex items-start gap-4">
                            {profile.photo_path && (
                                <img
                                    src={`/storage/${profile.photo_path}`}
                                    alt="Profile"
                                    className="h-24 w-24 rounded object-cover"
                                />
                            )}
                            <div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${sectorBadgeClass[profile.sector]}`}>
                                    {profile.sector}
                                </span>
                                <p className="mt-2 text-sm text-gray-500 capitalize">Status: {profile.status}</p>
                            </div>
                        </div>

                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Birthdate</dt>
                                <dd>{profile.birthdate}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Sex</dt>
                                <dd className="capitalize">{profile.sex}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Barangay</dt>
                                <dd>{profile.barangay}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Street Address</dt>
                                <dd>{profile.street_address || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Contact Number</dt>
                                <dd>{profile.contact_number || '—'}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Sector-specific fields */}
                    {profile.sector_profiles.length > 0 && (
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-3 text-sm font-medium text-gray-700">Sector Details</h3>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                {profile.sector_profiles.map((sp) => (
                                    <div key={sp.id}>
                                        <dt className="text-gray-500">{sp.field_name.replace(/_/g, ' ')}</dt>
                                        <dd>{sp.field_value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Commodities */}
                    {profile.commodities.length > 0 && (
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-3 text-sm font-medium text-gray-700">Commodities</h3>
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="pb-2">Commodity</th>
                                        <th className="pb-2">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {profile.commodities.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.name}</td>
                                            <td className="py-2 text-gray-600">
                                                {[
                                                    c.pivot.variety && `Variety: ${c.pivot.variety}`,
                                                    c.pivot.area_hectares && `${c.pivot.area_hectares} ha`,
                                                    c.pivot.no_of_hills_trees && `${c.pivot.no_of_hills_trees} hills/trees`,
                                                    c.pivot.no_of_heads && `${c.pivot.no_of_heads} heads`,
                                                    c.pivot.no_of_stocks && `${c.pivot.no_of_stocks} stocks`,
                                                    c.pivot.production_type && c.pivot.production_type.replace(/_/g, ' '),
                                                ].filter(Boolean).join(' • ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Aid Distribution History — will populate once that module is built */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-3 text-sm font-medium text-gray-700">Aid Distribution History</h3>
                        {profile.aid_distributions.length === 0 ? (
                            <p className="text-sm text-gray-500">No aid distributions recorded yet.</p>
                        ) : (
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="pb-2">Program</th>
                                        <th className="pb-2">Quantity</th>
                                        <th className="pb-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {profile.aid_distributions.map((ad) => (
                                        <tr key={ad.id}>
                                            <td className="py-2">{ad.program?.name}</td>
                                            <td className="py-2">{ad.quantity} {ad.unit}</td>
                                            <td className="py-2">{ad.distribution_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </Sidebar>
    );
}