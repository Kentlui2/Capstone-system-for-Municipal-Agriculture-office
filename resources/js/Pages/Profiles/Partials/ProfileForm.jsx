import SectorFieldsInput from './SectorFieldsInput';
import CommodityPicker from './CommodityPicker';
import SearchableSelect from '@/Components/SearchableSelect';
import { BARANGAYS } from '@/constants/barangays';
import { TextInput, Select, SelectItem } from '@tremor/react';

export default function ProfileForm({ data, setData, errors, commodities, existingPhotoUrl, currentStep }) {
    const handleSectorChange = (newSector) => {
        setData({
            ...data,
            sector: newSector,
            sector_fields: {},
            commodities: [],
        });
    };

    const showStep1 = !currentStep || currentStep === 1;
    const showStep2 = !currentStep || currentStep === 2;
    const showStep3 = !currentStep || currentStep === 3;

    return (
        <div className="space-y-6">
            {/* Step 1: Personal Details */}
            {showStep1 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <TextInput
                            value={data.first_name}
                            onValueChange={(v) => setData('first_name', v)}
                            error={!!errors.first_name}
                            errorMessage={errors.first_name}
                            placeholder="e.g. Juan"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <TextInput
                            value={data.last_name}
                            onValueChange={(v) => setData('last_name', v)}
                            error={!!errors.last_name}
                            errorMessage={errors.last_name}
                            placeholder="e.g. Dela Cruz"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Birthdate</label>
                        <input
                            type="date"
                            value={data.birthdate}
                            onChange={(e) => setData('birthdate', e.target.value)}
                            className="block w-full rounded-tremor-default border border-gray-300 px-3 py-2 text-sm shadow-tremor-input focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                        {errors.birthdate && <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Sex</label>
                        <Select value={data.sex} onValueChange={(v) => setData('sex', v)} placeholder="Select...">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </Select>
                        {errors.sex && <p className="mt-1 text-sm text-red-600">{errors.sex}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Contact Number</label>
                        <TextInput
                            value={data.contact_number}
                            onValueChange={(v) => setData('contact_number', v)}
                            placeholder="e.g. 09171234567"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
                        {existingPhotoUrl && (
                            <img src={existingPhotoUrl} alt="Current photo" className="mb-2 h-16 w-16 rounded-lg object-cover" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photo', e.target.files[0])}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                    </div>
                </div>
            )}

            {/* Step 2: Location & Sector Selection */}
            {showStep2 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Barangay <span className="text-red-500">*</span></label>
                            <SearchableSelect
                                value={data.barangay}
                                onChange={(v) => setData('barangay', v)}
                                options={BARANGAYS}
                                placeholder="Select barangay..."
                            />
                            {errors.barangay && <p className="mt-1 text-sm text-red-600">{errors.barangay}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Street Address</label>
                            <TextInput
                                value={data.street_address}
                                onValueChange={(v) => setData('street_address', v)}
                                placeholder="Purok / Street"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Agricultural Sector <span className="text-red-500">*</span></label>
                        <Select value={data.sector} onValueChange={handleSectorChange} placeholder="Select sector...">
                            <SelectItem value="farmer">Farmer</SelectItem>
                            <SelectItem value="fisherfolk">Fisherfolk</SelectItem>
                            <SelectItem value="raiser">Raiser (Livestock / Poultry)</SelectItem>
                        </Select>
                        {errors.sector && <p className="mt-1 text-sm text-red-600">{errors.sector}</p>}
                    </div>
                </div>
            )}

            {/* Step 3: Sector Specific Fields & Commodity Picker */}
            {showStep3 && (
                <div className="space-y-6">
                    {data.sector ? (
                        <>
                            <SectorFieldsInput
                                sector={data.sector}
                                values={data.sector_fields}
                                onChange={(key, value) => setData('sector_fields', { ...data.sector_fields, [key]: value })}
                            />

                            <CommodityPicker
                                sector={data.sector}
                                allCommodities={commodities}
                                selected={data.commodities}
                                onChange={(rows) => setData('commodities', rows)}
                            />
                        </>
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                            <p className="text-sm font-medium text-gray-500">Please select an Agricultural Sector in Step 2 to configure sector-specific details and commodities.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}