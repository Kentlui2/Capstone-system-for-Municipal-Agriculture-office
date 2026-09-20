<?php

namespace App\Http\Controllers;

use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Profile;
use App\Services\AnalyticsService;
use Inertia\Inertia;
use App\Models\Commodity;
use Inertia\Response;

class DashboardController extends Controller
{

    public function index(): Response
    {
        $stats = \Illuminate\Support\Facades\Cache::remember('dashboard:stats:v2', 300, function () {
            $analytics = new AnalyticsService();

            return [
                'total_profiles' => Profile::count(),
                'profiles_by_sector' => [
                    'farmer' => Profile::where('sector', 'farmer')->count(),
                    'fisherfolk' => Profile::where('sector', 'fisherfolk')->count(),
                    'raiser' => Profile::where('sector', 'raiser')->count(),
                ],
                'active_programs' => AidProgram::where('status', 'active')->count(),
                'total_distributions' => AidDistribution::count(),
                'duplicate_flag_count' => $analytics->duplicateFlagCount(),
                'unserved_profiles_count' => $analytics->unservedProfilesCount(),
                'farmers_per_commodity' => Commodity::withCount('profiles')
                     ->orderByDesc('profiles_count')
                     ->get(['id', 'name', 'category'])
                     ->filter(fn ($commodity) => $commodity->profiles_count > 0)
                     ->values()
                     ->toArray(),
            ];
        });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}