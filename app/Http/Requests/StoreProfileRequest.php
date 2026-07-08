<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesProfileFields;
use App\Models\Profile;
use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
{
    use ValidatesProfileFields;

    public function authorize(): bool
    {
        return $this->user()->can('create', Profile::class);
    }

    public function rules(): array
    {
        return $this->profileRules();
    }

    public function withValidator($validator)
    {
        $validator->after(fn ($validator) => $this->validateSectorConsistency($validator));
    }
}