<?php

namespace Database\Seeders;


use App\Models\Family;
use App\Models\SubFamily;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $families = collect([
            'Electronics',
            'Clothing',
            'Books',
            'Home & Kitchen',
            'Sports & Outdoors',
        ]);

        $families->each(function ($name) {
            $family = Family::create([
                'intitule' => $name,
            ]);

            // Create 3 to 5 subfamilies
            for ($i = 1; $i <= rand(3, 5); $i++) {
                SubFamily::create([
                    'cat_id' => $family->id,
                    'intitule' => $name . ' Sub ' . $i,
                ]);
            }
        });
    }
}
