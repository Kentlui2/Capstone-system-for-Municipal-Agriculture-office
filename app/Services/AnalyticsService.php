<?php

namespace App\Services;

use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Commodity;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function __construct(
        protected ?int $programId = null,
        protected ?string $startDate = null,
        protected ?string $endDate = null,
    ) {}

    /**
     * Applies the shared program/date filters to any aid_distributions query.
     */
    protected function filteredDistributions()
    {
        return AidDistribution::query()
            ->when($this->programId, fn ($q) => $q->where('program_id', $this->programId))
            ->when($this->startDate, fn ($q) => $q->whereDate('distribution_date', '>=', $this->startDate))
            ->when($this->endDate, fn ($q) => $q->whereDate('distribution_date', '<=', $this->endDate));
    }

    /**
     * Metric 1 & 2: Aid coverage rate per barangay, plus most/least served.
     * Uses withTrashed() on profiles since soft-deleted beneficiaries'
     * historical aid still counts toward accurate coverage statistics.
     */
    public function coverageByBarangay(): array
    {
        $barangays = Profile::withTrashed()
            ->select('barangay')
            ->distinct()
            ->pluck('barangay');

        $coverage = $barangays->map(function ($barangay) {
            $totalProfiles = Profile::withTrashed()->where('barangay', $barangay)->count();

            $servedProfiles = Profile::withTrashed()
                ->where('barangay', $barangay)
                ->whereHas('aidDistributions', function ($q) {
                    $q->when($this->programId, fn ($q) => $q->where('program_id', $this->programId))
                        ->when($this->startDate, fn ($q) => $q->whereDate('distribution_date', '>=', $this->startDate))
                        ->when($this->endDate, fn ($q) => $q->whereDate('distribution_date', '<=', $this->endDate));
                })
                ->count();

            return [
                'barangay' => $barangay,
                'total_profiles' => $totalProfiles,
                'served_profiles' => $servedProfiles,
                'coverage_rate' => $totalProfiles > 0
                    ? round(($servedProfiles / $totalProfiles) * 100, 2)
                    : 0,
            ];
        })->sortByDesc('coverage_rate')->values();

        return [
            'all' => $coverage,
            'most_served' => $coverage->first(),
            'least_served' => $coverage->last(),
        ];
    }

    /**
     * Metric 3: Commodity distribution breakdown — now accurately
     * computed from aid_distributions.commodity_id directly.
     */
    public function commodityBreakdown(): array
    {
        $total = $this->filteredDistributions()->whereNotNull('commodity_id')->count();

        if ($total === 0) {
            return [];
        }

        return $this->filteredDistributions()
            ->whereNotNull('commodity_id')
            ->join('commodities', 'aid_distributions.commodity_id', '=', 'commodities.id')
            ->select('commodities.name', DB::raw('count(*) as distribution_count'))
            ->groupBy('commodities.id', 'commodities.name')
            ->orderByDesc('distribution_count')
            ->get()
            ->map(fn ($row) => [
                'commodity' => $row->name,
                'count' => $row->distribution_count,
                'percentage' => round(($row->distribution_count / $total) * 100, 2),
            ])
            ->toArray();
    }

    /**
     * Metric 4: Program utilization rate — reuses the accessor
     * already built on the AidProgram model.
     */
    public function programUtilization(): array
    {
        return AidProgram::query()
            ->when($this->programId, fn ($q) => $q->where('id', $this->programId))
            ->get()
            ->map(fn ($program) => [
                'program' => $program->name,
                'allocated_quantity' => $program->allocated_quantity,
                'remaining_quantity' => $program->remaining_quantity,
                'utilization_rate' => $program->utilization_rate,
            ])
            ->toArray();
    }

    /**
     * Metric 5: Duplicate flag count.
     */
    public function duplicateFlagCount(): int
    {
        return $this->filteredDistributions()->where('is_flagged', true)->count();
    }

    /**
     * Metric 6: Unserved profiles count — profiles with zero
     * matching aid_distributions rows.
     */
    public function unservedProfilesCount(): int
    {
        return Profile::whereDoesntHave('aidDistributions', function ($q) {
            $q->when($this->programId, fn ($q) => $q->where('program_id', $this->programId))
                ->when($this->startDate, fn ($q) => $q->whereDate('distribution_date', '>=', $this->startDate))
                ->when($this->endDate, fn ($q) => $q->whereDate('distribution_date', '<=', $this->endDate));
        })->count();
    }
    /**
 * Distributions grouped by month, for trend visualization
 * (Area Chart / Spark Chart on the Analytics page).
 */
public function distributionsOverTime(): array
{
    return $this->filteredDistributions()
        ->selectRaw("TO_CHAR(distribution_date, 'YYYY-MM') as month, COUNT(*) as count")
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->map(fn ($row) => [
            'month' => $row->month,
            'Distributions' => $row->count,
        ])
        ->toArray();
}
    /**
     * Bundles all 6 metrics into one result for the Controller.
     */
 public function getAllMetrics(): array
{
    $coverage = $this->coverageByBarangay();

    return [
        'coverage_by_barangay' => $coverage['all'],
        'most_served_barangay' => $coverage['most_served'],
        'least_served_barangay' => $coverage['least_served'],
        'commodity_breakdown' => $this->commodityBreakdown(),
        'program_utilization' => $this->programUtilization(),
        'duplicate_flag_count' => $this->duplicateFlagCount(),
        'unserved_profiles_count' => $this->unservedProfilesCount(),
        'distributions_over_time' => $this->distributionsOverTime(), 
    ];
}
}