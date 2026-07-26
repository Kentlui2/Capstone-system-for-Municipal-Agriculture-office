<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAidDistributionRequest;
use App\Http\Requests\StoreProfileRequest;
use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Profile;
use App\Notifications\DistributionNeedsReview;
use App\Models\User;
use App\Services\AidDistributionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SyncController extends Controller
{
    public function __construct(
        protected AidDistributionService $aidDistributionService
    ) {}

    /**
     * Syncs a single profile that was encoded offline. Reuses the
     * same validation rules as the normal web flow, just triggered
     * via JSON instead of a redirect-based form submission.
     */
    public function syncProfile(StoreProfileRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $profile = DB::transaction(function () use ($request, $validated) {
            $profile = Profile::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birthdate' => $validated['birthdate'],
                'sex' => $validated['sex'],
                'barangay' => $validated['barangay'],
                'street_address' => $validated['street_address'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'sector' => $validated['sector'],
                'photo_path' => null, // photos are never synced from offline queue
                'status' => 'active',
                'created_by' => $request->user()->id,
            ]);

            foreach ($validated['sector_fields'] ?? [] as $fieldName => $fieldValue) {
                if ($fieldValue !== null && $fieldValue !== '') {
                    $profile->sectorProfiles()->create([
                        'field_name' => $fieldName,
                        'field_value' => $fieldValue,
                    ]);
                }
            }

            foreach ($validated['commodities'] ?? [] as $commodityEntry) {
                $profile->commodities()->attach($commodityEntry['commodity_id'], [
                    'variety' => $commodityEntry['variety'] ?? null,
                    'area_hectares' => $commodityEntry['area_hectares'] ?? null,
                    'no_of_hills_trees' => $commodityEntry['no_of_hills_trees'] ?? null,
                    'no_of_heads' => $commodityEntry['no_of_heads'] ?? null,
                    'no_of_stocks' => $commodityEntry['no_of_stocks'] ?? null,
                    'production_type' => $commodityEntry['production_type'] ?? null,
                ]);
            }

            return $profile;
        });

        return response()->json(['id' => $profile->id, 'status' => 'synced']);
    }

    /**
     * Syncs a single aid distribution encoded offline. Runs the
     * REAL duplicate/over-allocation check here (pass 2, authoritative)
     * — the offline check was only ever a local approximation.
     * Offline-synced records are auto-confirmed rather than
     * re-prompting the Encoder, since they already committed to the
     * entry while in the field with no way to interactively confirm.
     */
   public function syncDistribution(Request $request): JsonResponse
{
    $validated = $request->validate([
        'profile_id' => ['required', 'exists:profiles,id'],
        'program_id' => ['required', 'exists:aid_programs,id'],
        'aid_type' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string', 'max:255'],
        'quantity' => ['required', 'numeric', 'min:0.01'],
        'unit' => ['required', 'string', 'max:50'],
        'distribution_date' => ['required', 'date'],
        'remarks' => ['nullable', 'string'],
    ]);

    $program = AidProgram::findOrFail($validated['program_id']);

    $warnings = $this->aidDistributionService->checkForWarnings(
        $validated['profile_id'],
        $program,
        $validated['quantity']
    );

    // If either warning applies, don't commit yet — hold for review.
    // No interactive Encoder is present during background sync, so
    // we can't ask "confirm anyway?" the way the online flow does.
  if ($warnings['is_duplicate'] || $warnings['exceeds_allocation']) {
    $admins = User::where('role', 'admin')->where('status', 'approved')->get();

    foreach ($admins as $admin) {
        try {
            $admin->notify(new DistributionNeedsReview($warnings));
        } catch (\Throwable $e) {
            \Log::error('Notification failed', ['admin_id' => $admin->id, 'error' => $e->getMessage()]);
        }
    }

    return response()->json([
        'status' => 'needs_review',
        'warnings' => $warnings,
    ]);
    }

    $distribution = AidDistribution::create([
        ...$validated,
        'encoded_by' => $request->user()->id,
        'is_flagged' => false,
        'exceeds_allocation' => false,
        'remarks' => trim(($validated['remarks'] ?? '') . ' [Synced from offline entry]'),
    ]);

    return response()->json([
        'id' => $distribution->id,
        'status' => 'synced',
    ]);
}
/**
 * Force-saves a distribution that was held for review, after a
 * human has explicitly confirmed it should be saved despite the
 * duplicate/over-allocation warning.
 */
public function forceSyncDistribution(Request $request): JsonResponse
{
    $validated = $request->validate([
        'profile_id' => ['required', 'exists:profiles,id'],
        'program_id' => ['required', 'exists:aid_programs,id'],
        'aid_type' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string', 'max:255'],
        'quantity' => ['required', 'numeric', 'min:0.01'],
        'unit' => ['required', 'string', 'max:50'],
        'distribution_date' => ['required', 'date'],
        'remarks' => ['nullable', 'string'],
    ]);

    $program = AidProgram::findOrFail($validated['program_id']);

    $warnings = $this->aidDistributionService->checkForWarnings(
        $validated['profile_id'],
        $program,
        $validated['quantity']
    );

    $distribution = AidDistribution::create([
        ...$validated,
        'encoded_by' => $request->user()->id,
        'is_flagged' => $warnings['is_duplicate'],
        'exceeds_allocation' => $warnings['exceeds_allocation'],
        'remarks' => trim(($validated['remarks'] ?? '') . ' [Synced from offline entry, manually confirmed]'),
    ]);

    return response()->json(['id' => $distribution->id, 'status' => 'synced']);
}
}