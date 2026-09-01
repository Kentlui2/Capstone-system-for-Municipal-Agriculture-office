<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Validation\Rule;

trait ValidatesProfileFields
{
    /**
     * Base validation rules shared between create and update.
     */
    protected function profileRules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'birthdate' => ['required', 'date', 'before:today'],
            'sex' => ['required', Rule::in(['male', 'female'])],
            'barangay' => ['required', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'sector' => ['required', Rule::in(['farmer', 'fisherfolk', 'raiser'])],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048', 'dimensions:min_width=100,min_height=100'],

            'sector_fields' => ['nullable', 'array'],
            'sector_fields.*' => ['nullable', 'string', 'max:255'],

            'commodities' => ['nullable', 'array'],
            'commodities.*.commodity_id' => ['required', 'exists:commodities,id'],
            'commodities.*.variety' => ['nullable', 'string', 'max:255'],
            'commodities.*.area_hectares' => ['nullable', 'numeric', 'min:0'],
            'commodities.*.no_of_hills_trees' => ['nullable', 'integer', 'min:0'],
            'commodities.*.no_of_heads' => ['nullable', 'integer', 'min:0'],
            'commodities.*.no_of_stocks' => ['nullable', 'integer', 'min:0'],
            'commodities.*.production_type' => ['nullable', Rule::in(['fish_catch', 'fish_cage', 'fish_pond'])],
        ];
    }

    /**
     * Cross-field validation: sector-specific fields and commodity
     * tracking fields must match the profile's actual sector.
     */
    protected function validateSectorConsistency($validator): void
    {
        $sector = $this->input('sector');

        $allowedSectorFields = [
            'farmer' => ['rsbsa_number', 'ncfs_number', 'farm_location', 'total_farm_size_ha'],
            'fisherfolk' => ['fishr_number', 'boatr_number'],
            'raiser' => [],
        ];

        $allowed = $allowedSectorFields[$sector] ?? [];
        $sectorFields = $this->input('sector_fields', []);

        foreach (array_keys($sectorFields) as $fieldName) {
            if (! in_array($fieldName, $allowed)) {
                $validator->errors()->add(
                    "sector_fields.{$fieldName}",
                    "This field is not valid for the {$sector} sector."
                );
            }
        }

        $allowedCommodityFields = [
            'farmer' => ['variety', 'area_hectares', 'no_of_hills_trees'],
            'fisherfolk' => ['no_of_stocks', 'production_type'],
            'raiser' => ['variety', 'no_of_heads'],
        ];

        $allowedForSector = $allowedCommodityFields[$sector] ?? [];
        $allCommodityFields = ['variety', 'area_hectares', 'no_of_hills_trees', 'no_of_heads', 'no_of_stocks', 'production_type'];

        $commodities = $this->input('commodities', []);

        foreach ($commodities as $index => $commodityEntry) {
            foreach ($allCommodityFields as $field) {
                $value = $commodityEntry[$field] ?? null;

                if ($value !== null && $value !== '' && ! in_array($field, $allowedForSector)) {
                    $validator->errors()->add(
                        "commodities.{$index}.{$field}",
                        "The {$field} field is not valid for the {$sector} sector."
                    );
                }
            }
        }
    }
}