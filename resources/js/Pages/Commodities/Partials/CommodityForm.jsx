import { Select, SelectItem } from '@tremor/react';

export default function CommodityForm({ data, setData, errors }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="block w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                    <SelectItem value="Crops">Crops</SelectItem>
                    <SelectItem value="Aquatic">Aquatic</SelectItem>
                    <SelectItem value="Livestock">Livestock</SelectItem>
                </Select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </Select>
            </div>
        </div>
    );
}