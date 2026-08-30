import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { RiArrowUpSLine, RiArrowDownSLine, RiArrowUpDownLine, RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

import EmptyState from '@/Components/EmptyState';

export default function DataTable({ data, columns, pagination, emptyMessage = 'No records found.', emptyState, emptyActionLink, emptyActionLabel }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700' : ''
                                            }`}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <>
                                                    {header.column.getIsSorted() === 'asc' && <RiArrowUpSLine className="h-3.5 w-3.5" />}
                                                    {header.column.getIsSorted() === 'desc' && <RiArrowDownSLine className="h-3.5 w-3.5" />}
                                                    {!header.column.getIsSorted() && <RiArrowUpDownLine className="h-3.5 w-3.5 text-gray-300" />}
                                                </>
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-3 py-3 text-sm text-gray-700">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data.length === 0 && (
                    emptyState ? emptyState : (
                        <EmptyState
                            title={emptyMessage}
                            actionLink={emptyActionLink}
                            actionLabel={emptyActionLabel}
                        />
                    )
                )}
            </div>

            {/* Server-side pagination (Laravel paginator links) */}
            {pagination && pagination.links && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500">
                        Showing {pagination.from ?? 0}–{pagination.to ?? 0} of {pagination.total ?? 0}
                    </p>
                    <div className="flex gap-1">
                        {pagination.links.map((link, i) => {
                            const isPrev = link.label.includes('Previous');
                            const isNext = link.label.includes('Next');

                            return (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && pagination.onNavigate(link.url)}
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm ${link.active
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                >
                                    {isPrev ? <RiArrowLeftSLine className="h-4 w-4" /> :
                                        isNext ? <RiArrowRightSLine className="h-4 w-4" /> :
                                            link.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}