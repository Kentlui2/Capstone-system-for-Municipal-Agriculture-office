<?php

namespace App\Http\Controllers;

use App\Models\Commodity;
use App\Models\Profile;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use App\Exports\ProfilesExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    /**
     * Show the reports page — profile picker + bulk export filters.
     * Both roles can access (no Policy needed, just auth).
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('Reports/Index', [
            'profiles' => Profile::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'sector', 'barangay']),
        ]);
    }

    /**
     * Generate a single profile's PDF sheet.
     */
    public function profileSheet(Profile $profile): Response
    {
        $profile->load(['sectorProfiles', 'commodities', 'aidDistributions.program']);

        $pdf = Pdf::loadView('reports.profile-sheet', ['profile' => $profile]);

        return $pdf->download("profile-{$profile->last_name}-{$profile->id}.pdf");
    }

    public function bulkPdf(Request $request)
    {
        $query = Profile::query()
            ->when($request->sector, fn ($q) => $q->where('sector', $request->sector))
            ->when($request->barangay, fn ($q) => $q->where('barangay', $request->barangay));

        if ($query->count() > 200) {
            \App\Jobs\GenerateBulkReport::dispatch(
                $request->sector,
                $request->barangay,
                'pdf',
                $request->user()->id
            );

            return back()->with('info', 'Report export has been queued due to large dataset size. You will be notified when ready.');
        }

        $profiles = $query->orderBy('last_name')->get();

        $pdf = Pdf::loadView('reports.bulk-list', [
            'profiles' => $profiles,
            'sector' => $request->sector,
            'barangay' => $request->barangay,
        ]);

        return $pdf->download('beneficiary-list.pdf');
    }

    public function bulkExcel(Request $request)
    {
        $query = Profile::query()
            ->when($request->sector, fn ($q) => $q->where('sector', $request->sector))
            ->when($request->barangay, fn ($q) => $q->where('barangay', $request->barangay));

        if ($query->count() > 200) {
            \App\Jobs\GenerateBulkReport::dispatch(
                $request->sector,
                $request->barangay,
                'xlsx',
                $request->user()->id
            );

            return back()->with('info', 'Report export has been queued due to large dataset size. You will be notified when ready.');
        }

        return Excel::download(
            new ProfilesExport($request->sector, $request->barangay),
            'beneficiary-list.xlsx'
        );
    }

}