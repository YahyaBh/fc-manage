<?php

namespace Database\Seeders;


use App\Models\Family;
use App\Models\SubFamily;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class FamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            'Poissons d\'eau douce' => [
                'Carpe',
                'Silure',
                'Perche',
                'Brochet',
                'Truite'
            ],
            'Poissons de mer' => [
                'Thon',
                'Maquereau',
                'Sardine',
                'Bar',
                'Dorade'
            ],
            'Poissons exotiques' => [
                'Poisson-clown',
                'Poisson-ange',
                'Poisson-lion',
                'Poisson-papillon'
            ],
            'Fruits de mer' => [
                'Crevette',
                'Crabe',
                'Homard',
                'Moule',
                'Calamar'
            ]
        ];

        foreach ($categories as $category => $subcategories) {
            $catId = DB::table('cat_family')->insertGetId([
                'intitule' => $category,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            foreach ($subcategories as $sub) {
                DB::table('cat_sous_family')->insert([
                    'cat_id' => $catId,
                    'intitule' => $sub,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
