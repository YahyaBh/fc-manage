<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class UniteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $unites = [
            (object)[
                'intitule' => 'Kg',
                'code' => 'kg',
            ],
            (object)[
                'intitule' => 'Litre',
                'code' => 'l',
            ],
            (object)[
                'intitule' => 'Unité',
                'code' => 'u',
            ],
            (object)[
                'intitule' => 'Paquet',
                'code' => 'p',
            ],
            (object)[
                'intitule' => 'Boite',
                'code' => 'b',
            ],
        ];


        foreach ($unites as $unite) {
            DB::table('unites')->insert([
                'intitule' => $unite->intitule,
                'code' => $unite->code,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
