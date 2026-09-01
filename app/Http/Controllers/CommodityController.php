<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommodityRequest;
use App\Http\Requests\UpdateCommodityRequest;
use App\Models\Commodity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CommodityController extends Controller
{
    /**
     * List all commodities — both roles can view (Encoders need this
     * to select commodities when creating profiles).
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Commodity::class);

        $sort = request('sort', 'category');
        $direction = request('direction', 'asc');

        $allowedSorts = ['name', 'category', 'status'];
        if (! in_array($sort, $allowedSorts)) {
            $sort = 'category';
        }

        $commodities = Commodity::query()
            ->when(request('category'), fn ($q, $category) => $q->where('category', $category))
            ->when(request('status'), fn ($q, $status) => $q->where('status', $status))
            ->orderBy($sort, $direction)
            ->orderBy('name') // secondary sort for stable ordering
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Commodities/Index', [
            'commodities' => $commodities,
            'filters' => request()->only(['category', 'status', 'sort', 'direction']),
        ]);
    }
    
    /**
     * Display commodity create form — Admin only.
     */
    public function create(): Response
    {
        $this->authorize('create', Commodity::class);

        return Inertia::render('Commodities/Create');
    }

    /**
     * Store a new commodity — Admin only.
     */
    public function store(StoreCommodityRequest $request): RedirectResponse
    {
        $this->authorize('create', Commodity::class);

        Commodity::create($request->validated());

        return redirect()
            ->route('commodities.index')
            ->with('success', 'Commodity created successfully.');
    }

    /**
     * Update an existing commodity — Admin only.
     */
    public function update(UpdateCommodityRequest $request, Commodity $commodity): RedirectResponse
    {
        $commodity->update($request->validated());

        return redirect()
            ->route('commodities.index')
            ->with('success', 'Commodity updated successfully.');
    }

    /**
     * Delete a commodity — Admin only.
     *
     * Note: if this commodity is already attached to profiles via
     * profile_commodities, deletion will fail on the foreign key
     * constraint (we deliberately did NOT cascade that relationship).
     * That's intentional — prevents silently orphaning tracked
     * production data. Admin should deactivate (status = inactive)
     * instead of deleting if a commodity is actively in use.
     */
    public function destroy(Commodity $commodity): RedirectResponse
    {
        $this->authorize('delete', $commodity);

        if ($commodity->profiles()->exists()) {
            return redirect()
                ->route('commodities.index')
                ->with('error', "Cannot delete \"{$commodity->name}\" — it's still attached to one or more profiles. Deactivate it instead.");
        }

        $commodity->delete();

        return redirect()
            ->route('commodities.index')
            ->with('success', 'Commodity removed successfully.');
    }

    public function edit(Commodity $commodity): Response
    {
    $this->authorize('update', $commodity);

    return Inertia::render('Commodities/Edit', [
        'commodity' => $commodity,
    ]);
    }
}