<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Commodity;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class OfflineDataController extends Controller
{
    /**
     * Returns the reference data an Encoder needs cached locally to
     * keep working offline: profiles (for selecting a beneficiary),
     * active programs (for selecting a program + seeing remaining
     * allocation), commodities, and recent distributions (for local
     * duplicate-checking, pass 1 of the two-pass check).
     */
    public function referenceData(): JsonResponse
    {
        return response()->json([
            'profiles' => Profile::select('id', 'first_name', 'last_name', 'sector', 'barangay')->get(),
            'programs' => AidProgram::where('status', 'active')->get(),
            'commodities' => Commodity::where('status', 'active')->get(['id', 'name', 'category']),
            // Only recent distributions — capping this prevents the
            // cache from growing unbounded as the system accumulates
            // years of history; recent data is what matters for
            // catching duplicates in the field
            'distributions' => AidDistribution::select('id', 'profile_id', 'program_id')
                ->orderByDesc('created_at')
                ->limit(500)
                ->get(),
        ]);
    }
}