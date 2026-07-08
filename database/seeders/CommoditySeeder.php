<?php

namespace Database\Seeders;
use App\Models\Commodity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommoditySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $commodities = [
            // Crops — MAO-confirmed
            ['name' => 'Corn', 'category' => 'Crops'],
            ['name' => 'Coffee', 'category' => 'Crops'],
            ['name' => 'Cacao', 'category' => 'Crops'],
            ['name' => 'Coconut', 'category' => 'Crops'],
            ['name' => 'Banana', 'category' => 'Crops'],
            ['name' => 'Fruit Trees', 'category' => 'Crops'],
            ['name' => 'Vegetables', 'category' => 'Crops'],

            // Crops — additional, common in Davao del Sur
            ['name' => 'Rice', 'category' => 'Crops'],
            ['name' => 'Durian', 'category' => 'Crops'],
            ['name' => 'Mangosteen', 'category' => 'Crops'],
            ['name' => 'Rubber', 'category' => 'Crops'],
            ['name' => 'Abaca', 'category' => 'Crops'],
            ['name' => 'Cassava', 'category' => 'Crops'],
            ['name' => 'Sweet Potato', 'category' => 'Crops'],
            ['name' => 'Pineapple', 'category' => 'Crops'],

            // Aquatic — MAO-confirmed
            ['name' => 'Bangus', 'category' => 'Aquatic'],
            ['name' => 'Tilapia', 'category' => 'Aquatic'],
            ['name' => 'Shrimp', 'category' => 'Aquatic'],

            // Aquatic — additional
            ['name' => 'Catfish', 'category' => 'Aquatic'],
            ['name' => 'Crab', 'category' => 'Aquatic'],
            ['name' => 'Seaweed', 'category' => 'Aquatic'],

            // Livestock — MAO-confirmed
            ['name' => 'Chicken', 'category' => 'Livestock'],
            ['name' => 'Cow', 'category' => 'Livestock'],
            ['name' => 'Carabao', 'category' => 'Livestock'],
            ['name' => 'Goat', 'category' => 'Livestock'],
            ['name' => 'Sheep', 'category' => 'Livestock'],

            // Livestock — additional
            ['name' => 'Pig', 'category' => 'Livestock'],
            ['name' => 'Duck', 'category' => 'Livestock'],
            ['name' => 'Turkey', 'category' => 'Livestock'],
            ['name' => 'Quail', 'category' => 'Livestock'],
        ];

        foreach ($commodities as $commodity) {
            Commodity::create($commodity);
        }
    }
}
