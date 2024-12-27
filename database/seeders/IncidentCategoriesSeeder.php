<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncidentCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('incidentcategories')->insert([
            ['id' => 1, 'name' => 'Hardware'],
            ['id' => 2, 'name' => 'Software'],
            ['id' => 3, 'name' => 'Network'],
            ['id' => 4, 'name' => 'Security'],
            ['id' => 5, 'name' => 'Others'],
        ]);
    }
}
