export default function SectorFieldsInput({ sector, values, onChange }) {
    const fieldsBySector = {
        farmer: [
            { key: 'rsbsa_number', label: 'RSBSA Number' },
            { key: 'ncfs_number', label: 'NCFS Number (coconut farmers only)' },
            { key: 'farm_location', label: 'Farm Location' },
            { key: 'total_farm_size_ha', label: 'Total Farm Size (hectares)' },
        ],
        fisherfolk: [
            { key: 'fishr_number', label: 'FISHR Number' },
            { key: 'boatr_number', label: 'BOATR Number' },
        ],
        raiser: [],
    };

    const fields = fieldsBySector[sector] || [];

    if (fields.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
                <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    <input
                        type="text"
                        value={values[field.key] || ''}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 text-sm"
                    />
                </div>
            ))}
        </div>
    );
}