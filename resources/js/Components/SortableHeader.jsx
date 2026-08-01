import { router } from '@inertiajs/react';

export default function SortableHeader({ label, field, currentSort, currentDirection, routeName, otherParams = {} }) {
    const isActive = currentSort === field;
    const nextDirection = isActive && currentDirection === 'asc' ? 'desc' : 'asc';

    const handleSort = () => {
        router.get(route(routeName), {
            ...otherParams,
            sort: field,
            direction: nextDirection,
        }, { preserveState: true });
    };

    return (
        <th
            onClick={handleSort}
            className="cursor-pointer select-none pb-3 pr-4 hover:text-gray-700"
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {isActive && (
                    <span className="text-xs">
                        {currentDirection === 'asc' ? '▲' : '▼'}
                    </span>
                )}
            </span>
        </th>
    );
}