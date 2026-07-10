<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAidProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('aid_program'));
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

    /**
     * Prevent lowering allocated_quantity below what's already been
     * distributed — would otherwise produce a negative remaining
     * balance, hiding an over-allocation instead of surfacing it clearly.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $program = $this->route('aid_program');
            $alreadyDistributed = $program->distributions()->sum('quantity');
            $newAllocatedQuantity = $this->input('allocated_quantity');

            if ($newAllocatedQuantity < $alreadyDistributed) {
                $validator->errors()->add(
                    'allocated_quantity',
                    "Cannot set allocated quantity below {$alreadyDistributed} {$program->unit} — that's already been distributed under this program."
                );
            }
        });
    }
}