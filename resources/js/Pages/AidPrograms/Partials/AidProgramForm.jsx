import { Select, SelectItem, TextInput } from '@tremor/react';

export default function AidProgramForm({ data, setData, errors, currentStep }) {
    const showStep1 = !currentStep || currentStep === 1;
    const showStep2 = !currentStep || currentStep === 2;

    return (
        <div className="space-y-6">
            {showStep1 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Program Name <span className="text-red-500">*</span></label>
                        <TextInput value={data.name} onValueChange={(v) => setData('name', v)} error={!!errors.name} errorMessage={errors.name} placeholder="e.g. Rice Hybrid Seed Subsidy 2026" />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Aid Type <span className="text-red-500">*</span></label>
                        <Select value={data.aid_type} onValueChange={(v) => setData('aid_type', v)}>
                            <SelectItem value="Seeds">Seeds</SelectItem>
                            <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Cash Incentive">Cash Incentive</SelectItem>
                            <SelectItem value="Livelihood">Livelihood</SelectItem>
                        </Select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Funding Source</label>
                        <TextInput value={data.funding_source} onValueChange={(v) => setData('funding_source', v)} placeholder="e.g. LGU Municipal Fund / DA-RFU XI" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                        <TextInput value={data.description} onValueChange={(v) => setData('description', v)} placeholder="Program objectives and target coverage..." />
                    </div>
                </div>
            )}

            {showStep2 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Allocated Quantity <span className="text-red-500">*</span></label>
                        <TextInput
                            type="number"
                            value={data.allocated_quantity}
                            onValueChange={(v) => setData('allocated_quantity', v)}
                            error={!!errors.allocated_quantity}
                            errorMessage={errors.allocated_quantity}
                            placeholder="e.g. 500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Unit <span className="text-red-500">*</span></label>
                        <TextInput value={data.unit} onValueChange={(v) => setData('unit', v)} placeholder="kg, bags, heads, PHP..." />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Program Status</label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
}