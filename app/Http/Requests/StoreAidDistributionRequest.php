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
            'profile_ids'   => ['required', 'array', 'min:1'],
            'profile_ids.*' => ['required', 'exists:profiles,id'],
            'program_id'    => ['required', 'exists:aid_programs,id'],

            // Removed from form — kept nullable for backwards compat / offline sync
            'commodity_id'  => ['nullable', 'exists:commodities,id'],
            'aid_type'      => ['nullable', 'string', 'max:255'],
            'quantity'      => ['nullable', 'numeric', 'min:0.01'],
            'unit'          => ['nullable', 'string', 'max:50'],

            'description'   => ['nullable', 'string', 'max:255'],
            'distribution_date' => ['required', 'date'],
            'remarks'       => ['nullable', 'string'],

            // Confirmation flags sent by frontend after seeing a warning
            'confirmed_duplicate'       => ['sometimes', 'boolean'],
            'confirmed_over_allocation' => ['sometimes', 'boolean'],
        ];
    }
}