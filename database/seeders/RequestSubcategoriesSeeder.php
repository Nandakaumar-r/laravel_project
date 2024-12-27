<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestSubcategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('requestsubcategories')->insert([
            ['id' => 1, 'category_id' => 1, 'name' => 'User Accounts'],
            ['id' => 2, 'category_id' => 1, 'name' => 'Software Access'],
            ['id' => 3, 'category_id' => 2, 'name' => 'New Devices'],
            ['id' => 4, 'category_id' => 2, 'name' => 'Upgrades and Replacements'],
            ['id' => 5, 'category_id' => 3, 'name' => 'Policy Information'],
            ['id' => 6, 'category_id' => 3, 'name' => 'General Inquiries'],
            ['id' => 7, 'category_id' => 4, 'name' => 'IT Support'],
            ['id' => 8, 'category_id' => 4, 'name' => 'Training Requests'],
        ]);
    }
}
