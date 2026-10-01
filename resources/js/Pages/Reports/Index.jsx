import Sidebar from '@/Layouts/Sidebar';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import { BARANGAYS } from '@/constants/barangays';
import { RiFilePdfLine, RiFileExcelLine, RiDownloadLine, RiSearchLine, RiFileTextLine, RiEyeLine, RiCloseLine } from '@remixicon/react';

const sectorColor = { farmer: 'green', fisherfolk: 'blue', raiser: 'amber' };

// ── PDF Preview Modal ─────────────────────────────────────────────────────────
function PdfPreviewModal({ previewUrl, downloadUrl, title, onClose }) {
    if (!previewUrl) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative flex flex-col w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex items-center gap-2">
                        <RiFilePdfLine className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-semibold text-gray-800">{title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={downloadUrl}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                        >
                            <RiDownloadLine className="h-4 w-4" /> Download
                        </a>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                        >
                            <RiCloseLine className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                {/* Preview iframe */}
                <iframe
                    src={previewUrl}
                    className="flex-1 w-full"
                    title="PDF Preview"
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Index({ profiles }) {
    const [sector, setSector] = useState('');
    const [barangay, setBarangay] = useState('');
    const [searchProfile, setSearchProfile] = useState('');
    const [preview, setPreview] = useState(null); // { previewUrl, downloadUrl, title }

    const filteredProfiles = useMemo(() => {
        if (!searchProfile.trim()) return profiles;
        const q = searchProfile.toLowerCase();
        return profiles.filter(
            (p) =>
                p.first_name.toLowerCase().includes(q) ||
                p.last_name.toLowerCase().includes(q) ||
                p.barangay.toLowerCase().includes(q)
        );
    }, [profiles, searchProfile]);

    const openProfilePreview = (profile) => {
        setPreview({
            previewUrl: route('reports.profile-sheet-preview', profile.id),
            downloadUrl: route('reports.profile-sheet', profile.id),
            title: `${profile.first_name} ${profile.last_name} — Profile Sheet`,
        });
    };

    const openBulkPreview = () => {
        setPreview({
            previewUrl: route('reports.bulk-pdf-preview', { sector, barangay }),
            downloadUrl: route('reports.bulk-pdf', { sector, barangay }),
            title: 'Beneficiary List Report',
        });
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => (
                <span className="font-medium text-gray-900">
                    {info.row.original.first_name} {info.row.original.last_name}
                </span>
            ),
        },
        {
            accessorKey: 'sector',
            header: 'Sector',
            cell: (info) => (
                <Badge color={sectorColor[info.getValue()] || 'gray'}>
                    <span className="capitalize">{info.getValue()}</span>
                </Badge>
            ),
        },
        {
            accessorKey: 'barangay',
            header: 'Barangay',
            cell: (info) => info.getValue(),
        },
        {
            id: 'actions',
            header: 'Action',
            enableSorting: false,
            cell: (info) => (
                <button
                    onClick={() => openProfilePreview(info.row.original)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800"
                >
                    <RiEyeLine className="h-4 w-4" /> Preview PDF
                </button>
            ),
        },
    ], []);

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Reports</h2>}>
            <Head title="Reports" />

            {/* PDF Preview Modal */}
            {preview && (
                <PdfPreviewModal
                    previewUrl={preview.previewUrl}
                    downloadUrl={preview.downloadUrl}
                    title={preview.title}
                    onClose={() => setPreview(null)}
                />
            )}

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-8">

                    {/* Bulk Export Section */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <RiFileTextLine className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Bulk Beneficiary List Export</h3>
                                <p className="text-xs text-gray-500">
                                    Export full lists of registered beneficiaries with filtered details in PDF or Excel format.
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Sector Filter</label>
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">All Sectors</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="fisherfolk">Fisherfolk</option>
                                    <option value="raiser">Raiser</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500">Barangay Filter</label>
                                <select
                                    value={barangay}
                                    onChange={(e) => setBarangay(e.target.value)}
                                    className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">All Barangays</option>
                                    {BARANGAYS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={openBulkPreview}
                                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                            >
                                <RiEyeLine className="h-4 w-4" /> Preview PDF Report
                            </button>

                            <a
                                href={route('reports.bulk-pdf', { sector, barangay })}
                                className="flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                                <RiFilePdfLine className="h-4 w-4" /> Download PDF
                            </a>

                            <a
                                href={route('reports.bulk-excel', { sector, barangay })}
                                className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                            >
                                <RiFileExcelLine className="h-4 w-4" /> Download Excel Report
                            </a>
                        </div>
                    </div>

                    {/* Single Profile Sheet Section */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Individual Profile Sheets</h3>
                                <p className="text-xs text-gray-500">
                                    Preview and print PDF summary sheets for individual beneficiaries.
                                </p>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <RiSearchLine className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search beneficiary..."
                                    value={searchProfile}
                                    onChange={(e) => setSearchProfile(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 pl-9 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <DataTable data={filteredProfiles} columns={columns} emptyMessage="No profiles found." />
                    </div>

                </div>
            </div>
        </Sidebar>
    );
}
