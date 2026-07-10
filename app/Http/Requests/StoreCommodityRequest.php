<?php

namespace App\Http\Requests;

use App\Models\Commodity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommodityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Commodity::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['Crops', 'Livestock', 'Aquatic'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}