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

        $commodities = Commodity::orderBy('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('Commodities/Index', [
            'commodities' => $commodities,
        ]);
    }

    /**
     * Store a new commodity — Admin only.
     */
    public function store(StoreCommodityRequest $request): RedirectResponse
    {
        Commodity::create($request->validated());

        return redirect()
            ->route('commodities.index')
            ->with('success', 'Commodity added successfully.');
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
}