<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('articles')->insert([
            [
                'id' => 1,
                'designation' => 'NewProduct2',
                'cat_sous_family_id' => '1',
                'cat_family_id' => '2',
                'unite_id' => '2',
                'status' => '1',
                'user_id' => '1',
                'created_at' => Carbon::now(),
                'updated_at' => null,
            ],
            [
                'id' => 2,
                'designation' => 'NewProduct',
                'cat_sous_family_id' => '1',
                'cat_family_id' => '2',
                'unite_id' => '2',
                'status' => '1',
                'user_id' => '1',
                'created_at' => Carbon::now(),
                'updated_at' => null,
            ],
        ]);
    }
}
