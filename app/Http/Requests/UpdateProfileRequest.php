<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesProfileFields;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    use ValidatesProfileFields;

    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('profile'));
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