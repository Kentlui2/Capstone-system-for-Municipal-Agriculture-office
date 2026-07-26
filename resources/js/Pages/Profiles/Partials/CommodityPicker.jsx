export default function CommodityPicker({ sector, allCommodities, selected, onChange }) {
    const trackingFieldsBySector = {
        farmer: [
            { key: 'variety', label: 'Variety', type: 'text' },
            { key: 'area_hectares', label: 'Area (hectares)', type: 'number' },
            { key: 'no_of_hills_trees', label: 'No. of Hills/Trees', type: 'number' },
        ],
        fisherfolk: [
            { key: 'no_of_stocks', label: 'No. of Stocks', type: 'number' },
            {
                key: 'production_type',
                label: 'Production Type',
                type: 'select',
                options: ['fish_catch', 'fish_cage', 'fish_pond'],
            },
        ],
        raiser: [
            { key: 'variety', label: 'Breed', type: 'text' },
            { key: 'no_of_heads', label: 'No. of Heads', type: 'number' },
        ],
    };

    const trackingFields = trackingFieldsBySector[sector] || [];

    const addRow = () => {
        onChange([...selected, { commodity_id: '', ...Object.fromEntries(trackingFields.map(f => [f.key, ''])) }]);
    };

    const updateRow = (index, key, value) => {
        const updated = [...selected];
        updated[index] = { ...updated[index], [key]: value };
        onChange(updated);
    };

    const removeRow = (index) => {
        onChange(selected.filter((_, i) => i !== index));
    };

    const relevantCommodities = allCommodities.filter((c) => {
        if (sector === 'farmer') return c.category === 'Crops';
        if (sector === 'fisherfolk') return c.category === 'Aquatic';
        if (sector === 'raiser') return c.category === 'Livestock';
        return true;
    });

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Commodities</label>
                <button
                    type="button"
                    onClick={addRow}
                    className="text-sm text-indigo-600 hover:underline"
                >
                    + Add Commodity
                </button>
            </div>

            {selected.map((row, index) => (
                <div key={index} className="mb-3 flex items-end gap-3 rounded border border-gray-200 p-3">
                    <div>
                        <label className="block text-xs text-gray-500">Commodity</label>
                        <select
                            value={row.commodity_id}
                            onChange={(e) => updateRow(index, 'commodity_id', e.target.value)}
                            className="mt-1 rounded border-gray-300 text-sm"
                        >
                            <option value="">Select...</option>
                            {relevantCommodities.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {trackingFields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs text-gray-500">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    value={row[field.key] || ''}
                                    onChange={(e) => updateRow(index, field.key, e.target.value)}
                                    className="mt-1 rounded border-gray-300 text-sm"
                                >
                                    <option value="">Select...</option>
                                    {field.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    value={row[field.key] || ''}
                                    onChange={(e) => updateRow(index, field.key, e.target.value)}
                                    className="mt-1 w-32 rounded border-gray-300 text-sm"
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}