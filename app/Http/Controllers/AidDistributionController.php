<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAidDistributionRequest;
use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Profile;
use App\Services\AidDistributionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AidDistributionController extends Controller
{
    public function __construct(
        protected AidDistributionService $aidDistributionService
    ) {}

    /**
     * List all recorded distributions — both roles.
     */
public function index(): Response
    {
        $this->authorize('viewAny', AidDistribution::class);

        $sort = request('sort', 'distribution_date');
        $direction = request('direction', 'desc');

        $allowedSorts = ['distribution_date', 'quantity'];
        if (! in_array($sort, $allowedSorts)) {
            $sort = 'distribution_date';
        }

        $distributions = AidDistribution::with(['profile', 'program', 'encoder'])
        ->when(request('program_id'), fn ($q, $programId) => $q->where('program_id', $programId))
        ->when(request('flagged') === 'duplicate', fn ($q) => $q->where('is_flagged', true))
        ->when(request('flagged') === 'over_allocation', fn ($q) => $q->where('exceeds_allocation', true))
        ->orderBy($sort, $direction)
        ->paginate(20)
        ->withQueryString();

        return Inertia::render('AidDistributions/Index', [
            'distributions' => $distributions,
            'programs' => AidProgram::orderBy('name')->get(['id', 'name']),
            'filters' => request()->only(['program_id', 'flagged', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the create form — needs profiles and active programs
     * for the selection dropdowns.
     */
    public function create(): Response
    {
        $this->authorize('create', AidDistribution::class);

        return Inertia::render('AidDistributions/Create', [
            'profiles' => Profile::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'sector', 'barangay']),
            'programs' => AidProgram::where('status', 'active')->get(),
        ]);
    }

    /**
     * Record a new distribution. If duplicate/over-allocation
     * warnings apply and haven't been confirmed yet, returns the
     * warnings back to the frontend instead of saving.
     */
    public function store(StoreAidDistributionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $program   = AidProgram::findOrFail($validated['program_id']);
        $profileIds = $validated['profile_ids'];

        // Use program defaults for fields removed from the form
        $aidType  = $program->aid_type;
        $quantity = $validated['quantity'] ?? 1;
        $unit     = $validated['unit'] ?? $program->unit;

        $warnings = [];
        $needsConfirmation = false;

        // Check warnings for ALL selected beneficiaries before saving any
        foreach ($profileIds as $profileId) {
            $check = $this->aidDistributionService->checkForWarnings(
                (int) $profileId,
                $program,
                $quantity
            );

            $needsDuplicateConfirmation    = $check['is_duplicate'] && ! ($validated['confirmed_duplicate'] ?? false);
            $needsAllocationConfirmation   = $check['exceeds_allocation'] && ! ($validated['confirmed_over_allocation'] ?? false);

            if ($needsDuplicateConfirmation || $needsAllocationConfirmation) {
                $needsConfirmation = true;
                $warnings = [
                    'is_duplicate'       => $check['is_duplicate'],
                    'exceeds_allocation' => $check['exceeds_allocation'],
                    'remaining_quantity' => $program->remaining_quantity,
                ];
                break; // Surface the first warning found
            }
        }

        if ($needsConfirmation) {
            return back()->with('warnings', $warnings);
        }

        // Save one distribution record per beneficiary
        foreach ($profileIds as $profileId) {
            $check = $this->aidDistributionService->checkForWarnings(
                (int) $profileId,
                $program,
                $quantity
            );

            AidDistribution::create([
                'profile_id'         => $profileId,
                'program_id'         => $validated['program_id'],
                'commodity_id'       => $validated['commodity_id'] ?? null,
                'aid_type'           => $aidType,
                'description'        => $validated['description'] ?? null,
                'quantity'           => $quantity,
                'unit'               => $unit,
                'distribution_date'  => $validated['distribution_date'],
                'remarks'            => $validated['remarks'] ?? null,
                'encoded_by'         => $request->user()->id,
                'is_flagged'         => $check['is_duplicate'],
                'exceeds_allocation' => $check['exceeds_allocation'],
            ]);
        }

        \Illuminate\Support\Facades\Cache::forget('dashboard:stats');

        $count = count($profileIds);
        $message = $count === 1
            ? 'Aid distribution recorded successfully.'
            : "{$count} aid distributions recorded successfully.";

        return redirect()
            ->route('aid-distributions.index')
            ->with('success', $message);
    }

    /**
     * Show a single distribution's details.
     */
    public function show(AidDistribution $aidDistribution): Response
    {
        $this->authorize('view', $aidDistribution);

        $aidDistribution->load(['profile', 'program', 'encoder']);
        return Inertia::render('AidDistributions/Show', [
            'distribution' => $aidDistribution,
        ]);
    }
}