<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAidDistributionRequest;
use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Commodity;
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
            'profiles' => Profile::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'sector']),
            'programs' => AidProgram::where('status', 'active')->get(),
            'commodities' => Commodity::where('status', 'active')->get(['id', 'name', 'category']),
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
        $program = AidProgram::findOrFail($validated['program_id']);

        $warnings = $this->aidDistributionService->checkForWarnings(
            $validated['profile_id'],
            $program,
            $validated['quantity']
        );

        $needsDuplicateConfirmation = $warnings['is_duplicate'] && ! ($validated['confirmed_duplicate'] ?? false);
        $needsAllocationConfirmation = $warnings['exceeds_allocation'] && ! ($validated['confirmed_over_allocation'] ?? false);

        if ($needsDuplicateConfirmation || $needsAllocationConfirmation) {
            // Don't save yet — send the warnings back so the frontend
            // can show a confirmation dialog and resubmit if the
            // Encoder chooses to proceed anyway (business rule 5:
            // soft warning, never a hard block)
            return back()->with('warnings', [
                'is_duplicate' => $warnings['is_duplicate'],
                'exceeds_allocation' => $warnings['exceeds_allocation'],
                'remaining_quantity' => $program->remaining_quantity,
            ]);
        }

       AidDistribution::create([
        'profile_id' => $validated['profile_id'],
        'program_id' => $validated['program_id'],
        'commodity_id' => $validated['commodity_id'] ?? null,
        'aid_type' => $validated['aid_type'],
        'description' => $validated['description'] ?? null,
        'quantity' => $validated['quantity'],
        'unit' => $validated['unit'],
        'distribution_date' => $validated['distribution_date'],
        'remarks' => $validated['remarks'] ?? null,
        'encoded_by' => $request->user()->id,
        'is_flagged' => $warnings['is_duplicate'],
        'exceeds_allocation' => $warnings['exceeds_allocation'],
    ]);

        return redirect()
            ->route('aid-distributions.index')
            ->with('success', 'Aid distribution recorded successfully.');
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