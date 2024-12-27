<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncidentSubcategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('incidentsubcategories')->insert([
            ['id' => 1, 'category_id' => 1, 'name' => 'Computers'],
            ['id' => 2, 'category_id' => 1, 'name' => 'Network Devices'],
            ['id' => 3, 'category_id' => 1, 'name' => 'Mobile Devices'],
            ['id' => 4, 'category_id' => 2, 'name' => 'Operating Systems'],
            ['id' => 5, 'category_id' => 2, 'name' => 'Applications'],
            ['id' => 6, 'category_id' => 3, 'name' => 'Internet Connectivity'],
            ['id' => 7, 'category_id' => 3, 'name' => 'Email Issues'],
            ['id' => 8, 'category_id' => 4, 'name' => 'Data Breach'],
            ['id' => 9, 'category_id' => 4, 'name' => 'Malware'],
        ]);
    }
}
