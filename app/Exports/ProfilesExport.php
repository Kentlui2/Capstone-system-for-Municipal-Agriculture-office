<?php

namespace App\Exports;

use App\Models\Profile;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProfilesExport implements FromCollection, WithHeadings
{
    public function __construct(
        protected ?string $sector = null,
        protected ?string $barangay = null,
    ) {}

    public function collection(): Collection
    {
        return Profile::query()
            ->when($this->sector, fn ($q) => $q->where('sector', $this->sector))
            ->when($this->barangay, fn ($q) => $q->where('barangay', $this->barangay))
            ->get()
            ->map(fn ($profile) => [
                'name' => "{$profile->first_name} {$profile->last_name}",
                'address' => $profile->barangay . ($profile->street_address ? ", {$profile->street_address}" : ''),
                'sex' => ucfirst($profile->sex),
                'birthdate' => $profile->birthdate->format('Y-m-d'),
            ]);
    }

    public function headings(): array
    {
        return ['Name', 'Address', 'Sex', 'Birthdate'];
    }
}