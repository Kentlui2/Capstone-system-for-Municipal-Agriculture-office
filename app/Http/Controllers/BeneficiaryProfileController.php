<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\Commodity;
use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BeneficiaryProfileController extends Controller
{
    public function index(): Response
{
    $this->authorize('viewAny', Profile::class);

    $sort = request('sort', 'last_name');
    $direction = request('direction', 'asc');

    $allowedSorts = ['last_name', 'sector', 'barangay'];
    if (! in_array($sort, $allowedSorts)) {
        $sort = 'last_name';
    }

    $profiles = Profile::query()
        ->when(request('sector'), fn ($q, $sector) => $q->where('sector', $sector))
        ->when(request('barangay'), fn ($q, $barangay) => $q->where('barangay', $barangay))
        ->when(request('commodity_id'), function ($q, $commodityId) {
            $q->whereHas('commodities', fn ($q) => $q->where('commodities.id', $commodityId));
        })
        ->when(request('search'), function ($q, $search) {
            $q->where(fn ($q) => $q
                ->where('first_name', 'ilike', "%{$search}%")
                ->orWhere('last_name', 'ilike', "%{$search}%"));
        })
        ->orderBy($sort, $direction)
        ->paginate(20)
        ->withQueryString();

    return Inertia::render('Profiles/Index', [
        'profiles' => $profiles,
        'filters' => request()->only(['sector', 'barangay', 'commodity_id', 'search', 'sort', 'direction']),
    ]);
}

    public function create(): Response
    {
        $this->authorize('create', Profile::class);

        return Inertia::render('Profiles/Create', [
            'commodities' => Commodity::where('status', 'active')->get(['id', 'name', 'category']),
        ]);
    }

    public function store(StoreProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $photoPath = $request->hasFile('photo')
                ? $request->file('photo')->store('profile-photos', 'public')
                : null;

            $profile = Profile::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birthdate' => $validated['birthdate'],
                'sex' => $validated['sex'],
                'barangay' => $validated['barangay'],
                'street_address' => $validated['street_address'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'sector' => $validated['sector'],
                'photo_path' => $photoPath,
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
        });

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Profile created successfully.');
    }

    public function show(Profile $profile): Response
    {
        $this->authorize('view', $profile);

        $profile->load(['sectorProfiles', 'commodities', 'aidDistributions.program']);

        return Inertia::render('Profiles/Show', [
            'profile' => $profile,
        ]);
    }

    public function edit(Profile $profile): Response
    {
        $this->authorize('update', $profile);

        $profile->load(['sectorProfiles', 'commodities']);

        return Inertia::render('Profiles/Edit', [
            'profile' => $profile,
            'commodities' => Commodity::where('status', 'active')->get(['id', 'name', 'category']),
        ]);
    }

    public function update(UpdateProfileRequest $request, Profile $profile): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated, $profile) {
            $photoPath = $profile->photo_path;

            if ($request->hasFile('photo')) {
                if ($profile->photo_path) {
                    Storage::disk('public')->delete($profile->photo_path);
                }

                $photoPath = $request->file('photo')->store('profile-photos', 'public');
            }

            $profile->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birthdate' => $validated['birthdate'],
                'sex' => $validated['sex'],
                'barangay' => $validated['barangay'],
                'street_address' => $validated['street_address'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'sector' => $validated['sector'],
                'photo_path' => $photoPath,
            ]);

            $profile->sectorProfiles()->delete();
            foreach ($validated['sector_fields'] ?? [] as $fieldName => $fieldValue) {
                if ($fieldValue !== null && $fieldValue !== '') {
                    $profile->sectorProfiles()->create([
                        'field_name' => $fieldName,
                        'field_value' => $fieldValue,
                    ]);
                }
            }

            $profile->commodities()->detach();
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
        });

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Profile updated successfully.');
    }

    public function destroy(Profile $profile): RedirectResponse
    {
        $this->authorize('delete', $profile);

        $profile->delete();

        return redirect()
            ->route('profiles.index')
            ->with('success', 'Profile removed successfully.');
    }
}