<?php

namespace Database\Seeders;

use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Commodity;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $barangays = ['Astorga', 'Bato', 'Coronon', 'Darong', 'Inawayan', 'Sibulan', 'Tuban', 'Zone I', 'Zone II', 'Zone III'];

        // --- Aid Programs ---
        $programs = collect([
            ['name' => 'Corn Seed Distribution 2026', 'aid_type' => 'Seeds', 'allocated_quantity' => 2000, 'unit' => 'kg'],
            ['name' => 'Fertilizer Support Program', 'aid_type' => 'Fertilizer', 'allocated_quantity' => 500, 'unit' => 'bags'],
            ['name' => 'Livestock Dispersal Program', 'aid_type' => 'Livelihood', 'allocated_quantity' => 200, 'unit' => 'heads'],
            ['name' => 'Fisherfolk Equipment Assistance', 'aid_type' => 'Equipment', 'allocated_quantity' => 100, 'unit' => 'sets'],
            ['name' => 'Cash for Work Program', 'aid_type' => 'Cash Incentive', 'allocated_quantity' => 500000, 'unit' => 'PHP'],
        ])->map(function ($data) use ($admin) {
            return AidProgram::create([
                ...$data,
                'description' => $data['name'].' under MAO Sta. Cruz.',
                'funding_source' => 'LGU',
                'status' => 'active',
                'created_by' => $admin->id,
            ]);
        });

        // --- Profiles + sector data + commodities ---
        $farmerCommodities = Commodity::where('category', 'Crops')->get();
        $fisherfolkCommodities = Commodity::where('category', 'Aquatic')->get();
        $raiserCommodities = Commodity::where('category', 'Livestock')->get();

        $farmerNames = [['Juan', 'Dela Cruz'], ['Pedro', 'Santos'], ['Maria', 'Reyes'], ['Ana', 'Garcia'], ['Jose', 'Ramos'], ['Rosa', 'Villanueva'], ['Carlos', 'Mendoza'], ['Elena', 'Torres']];
        $fisherfolkNames = [['Ramon', 'Aquino'], ['Luz', 'Bautista'], ['Antonio', 'Cruz'], ['Carmen', 'Flores']];
        $raiserNames = [['Ernesto', 'Ignacio'], ['Teresa', 'Manalo'], ['Rodrigo', 'Pascual']];

        $profiles = collect();

        foreach ($farmerNames as [$first, $last]) {
            $profile = Profile::create([
                'first_name' => $first, 'last_name' => $last,
                'birthdate' => now()->subYears(rand(25, 60))->subDays(rand(0, 365)),
                'sex' => rand(0, 1) ? 'male' : 'female',
                'barangay' => $barangays[array_rand($barangays)],
                'sector' => 'farmer', 'status' => 'active', 'created_by' => $admin->id,
            ]);
            $profile->sectorProfiles()->create(['field_name' => 'rsbsa_number', 'field_value' => 'RSBSA-'.rand(100000, 999999)]);
            $profile->sectorProfiles()->create(['field_name' => 'farm_location', 'field_value' => 'Sitio '.['Malipayon', 'Kauswagan', 'Bagong Silang'][rand(0, 2)]]);
            $profile->sectorProfiles()->create(['field_name' => 'total_farm_size_ha', 'field_value' => rand(1, 5)]);

            $commodity = $farmerCommodities->random();
            $profile->commodities()->attach($commodity->id, [
                'variety' => 'Local', 'area_hectares' => rand(1, 5),
            ]);

            $profiles->push($profile);
        }

        foreach ($fisherfolkNames as [$first, $last]) {
            $profile = Profile::create([
                'first_name' => $first, 'last_name' => $last,
                'birthdate' => now()->subYears(rand(25, 60))->subDays(rand(0, 365)),
                'sex' => rand(0, 1) ? 'male' : 'female',
                'barangay' => $barangays[array_rand($barangays)],
                'sector' => 'fisherfolk', 'status' => 'active', 'created_by' => $admin->id,
            ]);
            $profile->sectorProfiles()->create(['field_name' => 'fishr_number', 'field_value' => 'FISHR-'.rand(100000, 999999)]);

            $commodity = $fisherfolkCommodities->random();
            $profile->commodities()->attach($commodity->id, [
                'no_of_stocks' => rand(100, 1000),
                'production_type' => ['fish_catch', 'fish_cage', 'fish_pond'][rand(0, 2)],
            ]);

            $profiles->push($profile);
        }

        foreach ($raiserNames as [$first, $last]) {
            $profile = Profile::create([
                'first_name' => $first, 'last_name' => $last,
                'birthdate' => now()->subYears(rand(25, 60))->subDays(rand(0, 365)),
                'sex' => rand(0, 1) ? 'male' : 'female',
                'barangay' => $barangays[array_rand($barangays)],
                'sector' => 'raiser', 'status' => 'active', 'created_by' => $admin->id,
            ]);

            $commodity = $raiserCommodities->random();
            $profile->commodities()->attach($commodity->id, [
                'variety' => 'Native', 'no_of_heads' => rand(2, 20),
            ]);

            $profiles->push($profile);
        }

        // --- Aid Distributions (spread over the last 6 months, mostly non-duplicate, a few flagged) ---
        $encoder = User::where('role', 'encoder')->first() ?? $admin;

        foreach ($profiles as $index => $profile) {
            $program = $programs->random();
            $commodityIds = $profile->commodities->pluck('id');

            AidDistribution::create([
                'profile_id' => $profile->id,
                'program_id' => $program->id,
                'commodity_id' => $commodityIds->isNotEmpty() ? $commodityIds->random() : null,
                'aid_type' => $program->aid_type,
                'description' => $program->name,
                'quantity' => rand(10, 100),
                'unit' => $program->unit,
                'distribution_date' => now()->subMonths(rand(0, 5))->subDays(rand(0, 28)),
                'encoded_by' => $encoder->id,
                'is_flagged' => false,
                'exceeds_allocation' => false,
            ]);
        }

        // A few intentional duplicates, to populate the "flagged" analytics
        $profiles->take(2)->each(function ($profile) use ($programs, $encoder) {
            $program = $programs->first();
            AidDistribution::create([
                'profile_id' => $profile->id,
                'program_id' => $program->id,
                'commodity_id' => $profile->commodities->first()?->id,
                'aid_type' => $program->aid_type,
                'description' => $program->name.' (duplicate test)',
                'quantity' => rand(10, 50),
                'unit' => $program->unit,
                'distribution_date' => now()->subDays(rand(0, 10)),
                'encoded_by' => $encoder->id,
                'is_flagged' => true,
                'exceeds_allocation' => false,
            ]);
        });
    }
}