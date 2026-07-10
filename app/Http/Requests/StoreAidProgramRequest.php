<?php

namespace App\Http\Requests;

use App\Models\AidProgram;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAidProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', AidProgram::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'aid_type' => ['required', Rule::in(['Seeds', 'Fertilizer', 'Equipment', 'Cash Incentive', 'Livelihood'])],
            'allocated_quantity' => ['required', 'numeric', 'min:0.01'],
            'unit' => ['required', 'string', 'max:50'],
            'funding_source' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(['active', 'closed'])],
        ];
    }
}