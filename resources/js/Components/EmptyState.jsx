import { Link } from '@inertiajs/react';
import { RiAddLine, RiInboxLine } from '@remixicon/react';

export default function EmptyState({
    icon: Icon = RiInboxLine,
    title = 'No records found',
    description = 'There are no records matching your request at this time.',
    actionLink,
    actionLabel,
    actionOnClick,
}) {
    return (
        <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-2xs">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">{description}</p>
            {(actionLink || actionOnClick) && (
                <div className="mt-4">
                    {actionLink ? (
                        <Link
                            href={actionLink}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                        >
                            <RiAddLine className="h-4 w-4" /> {actionLabel}
                        </Link>
                    ) : (
                        <button
                            onClick={actionOnClick}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                        >
                            <RiAddLine className="h-4 w-4" /> {actionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
