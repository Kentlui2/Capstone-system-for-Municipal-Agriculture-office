import { RiCloseLine } from '@remixicon/react';

export default function ActiveFilters({ filters = [], onClearAll }) {
    const activeFilters = filters.filter((f) => f.value && f.value !== '' && f.value !== 'All Barangays');

    if (activeFilters.length === 0) return null;

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Active Filters:</span>
            {activeFilters.map((f) => (
                <span
                    key={f.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-200/60"
                >
                    <span>{f.label}: <strong className="font-semibold">{f.displayValue || f.value}</strong></span>
                    <button
                        type="button"
                        onClick={f.onRemove}
                        className="rounded-full p-0.5 hover:bg-emerald-200 text-emerald-700 hover:text-emerald-900 transition-colors"
                        title={`Remove ${f.label} filter`}
                    >
                        <RiCloseLine className="h-3.5 w-3.5" />
                    </button>
                </span>
            ))}
            {onClearAll && (
                <button
                    type="button"
                    onClick={onClearAll}
                    className="text-xs font-medium text-gray-500 hover:text-gray-900 underline ml-2 transition-colors"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
