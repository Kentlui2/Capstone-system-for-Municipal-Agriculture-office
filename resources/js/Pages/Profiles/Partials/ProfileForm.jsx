import SectorFieldsInput from './SectorFieldsInput';
import CommodityPicker from './CommodityPicker';

export default function ProfileForm({ data, setData, errors, commodities, existingPhotoUrl }) {
    const handleSectorChange = (newSector) => {
        // Reset sector-dependent fields when sector changes,
        // since a farmer's RSBSA number is meaningless for a raiser
        setData({
            ...data,
            sector: newSector,
            sector_fields: {},
            commodities: [],
        });
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Birthdate</label>
                    <input
                        type="date"
                        value={data.birthdate}
                        onChange={(e) => setData('birthdate', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                    {errors.birthdate && <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Sex</label>
                    <select
                        value={data.sex}
                        onChange={(e) => setData('sex', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex && <p className="mt-1 text-sm text-red-600">{errors.sex}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Barangay</label>
                    <input
                        type="text"
                        value={data.barangay}
                        onChange={(e) => setData('barangay', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                    {errors.barangay && <p className="mt-1 text-sm text-red-600">{errors.barangay}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                    <input
                        type="text"
                        value={data.street_address}
                        onChange={(e) => setData('street_address', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        value={data.contact_number}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    {existingPhotoUrl && (
                        <img src={existingPhotoUrl} alt="Current photo" className="mb-2 h-20 w-20 rounded object-cover" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('photo', e.target.files[0])}
                        className="mt-1 block w-full text-sm"
                    />
                    {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <select
                    value={data.sector}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 text-sm"
                >
                    <option value="">Select...</option>
                    <option value="farmer">Farmer</option>
                    <option value="fisherfolk">Fisherfolk</option>
                    <option value="raiser">Raiser</option>
                </select>
                {errors.sector && <p className="mt-1 text-sm text-red-600">{errors.sector}</p>}
            </div>

            {data.sector && (
                <SectorFieldsInput
                    sector={data.sector}
                    values={data.sector_fields}
                    onChange={(key, value) => setData('sector_fields', { ...data.sector_fields, [key]: value })}
                />
            )}

            {data.sector && (
                <CommodityPicker
                    sector={data.sector}
                    allCommodities={commodities}
                    selected={data.commodities}
                    onChange={(rows) => setData('commodities', rows)}
                />
            )}
        </>
    );
}