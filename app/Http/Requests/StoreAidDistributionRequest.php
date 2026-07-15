<?php

namespace App\Http\Requests;

use App\Models\AidDistribution;
use Illuminate\Foundation\Http\FormRequest;

class StoreAidDistributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', AidDistribution::class);
    }

    public function rules(): array
    {
        return [
            'profile_id' => ['required', 'exists:profiles,id'],
            'program_id' => ['required', 'exists:aid_programs,id'],
            'commodity_id' => ['nullable', 'exists:commodities,id'],
            'aid_type' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'unit' => ['required', 'string', 'max:50'],
            'distribution_date' => ['required', 'date'],
            'remarks' => ['nullable', 'string'],

            // These come from the frontend AFTER the user has seen a
            // warning and explicitly confirmed they want to proceed
            // despite a duplicate or over-allocation flag
            'confirmed_duplicate' => ['sometimes', 'boolean'],
            'confirmed_over_allocation' => ['sometimes', 'boolean'],
        ];
    }
}