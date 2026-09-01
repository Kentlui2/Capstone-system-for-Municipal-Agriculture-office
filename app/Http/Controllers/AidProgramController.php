<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAidProgramRequest;
use App\Http\Requests\UpdateAidProgramRequest;
use App\Models\AidProgram;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AidProgramController extends Controller
{
    /**
     * List all aid programs — both roles can view (Encoders need
     * this to select a program when recording distributions).
     */
   public function index(): Response
    {
        $this->authorize('viewAny', AidProgram::class);

        $programs = AidProgram::query()
        ->when(request('aid_type'), fn ($q, $type) => $q->where('aid_type', $type))
        ->when(request('status'), fn ($q, $status) => $q->where('status', $status))
        ->orderBy('status')
        ->orderBy('name')
        ->paginate(20)
        ->withQueryString();

        return Inertia::render('AidPrograms/Index', [
        'programs' => $programs,
        'filters' => request()->only(['aid_type', 'status']),
    ]);
    }

    /**
     * Store a new aid program — Admin only.
     */
    public function store(StoreAidProgramRequest $request): RedirectResponse
    {
        AidProgram::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('aid-programs.index')
            ->with('success', 'Aid program created successfully.');
    }
    
    public function create(): Response
    {
        $this->authorize('create', AidProgram::class);

        return Inertia::render('AidPrograms/Create');
    }

    
    public function edit(AidProgram $aidProgram): Response
    {
        $this->authorize('update', $aidProgram);

        return Inertia::render('AidPrograms/Edit', [
            'program' => $aidProgram,
        ]);
    }
    
    /**
     * Update an existing aid program — Admin only.
     */
    public function update(UpdateAidProgramRequest $request, AidProgram $aidProgram): RedirectResponse
    {
        $aidProgram->update($request->validated());

        return redirect()
            ->route('aid-programs.index')
            ->with('success', 'Aid program updated successfully.');
    }

    /**
     * Delete an aid program — Admin only.
     *
     * Blocked if any distributions already exist under this program,
     * same safety pattern as Commodity deletion — preserves aid
     * history rather than allowing it to be silently orphaned.
     */
    public function destroy(AidProgram $aidProgram): RedirectResponse
    {
        $this->authorize('delete', $aidProgram);

        if ($aidProgram->distributions()->exists()) {
            return redirect()
                ->route('aid-programs.index')
                ->with('error', "Cannot delete \"{$aidProgram->name}\" — it already has recorded distributions. Close the program instead.");
        }

        $aidProgram->delete();

        return redirect()
            ->route('aid-programs.index')
            ->with('success', 'Aid program removed successfully.');
    }

    public function show(AidProgram $aidProgram): Response
    {
        $this->authorize('view', $aidProgram);

        $aidProgram->load(['distributions.profile']);

        // Unique profiles who received aid under this program —
    // a profile could appear multiple times in distributions
    // (different dates/quantities), but should only be listed once here
    $profiles = $aidProgram->distributions
        ->pluck('profile')
        ->unique('id')
        ->values();

        return Inertia::render('AidPrograms/Show', [
            'program' => $aidProgram,
            'profiles' => $profiles,
        ]);
    }
}