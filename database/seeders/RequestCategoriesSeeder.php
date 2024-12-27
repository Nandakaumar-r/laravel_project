<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('requestcategories')->insert([
            ['id' => 1, 'name' => 'Access'],
            ['id' => 2, 'name' => 'Hardware'],
            ['id' => 3, 'name' => 'Information'],
            ['id' => 4, 'name' => 'Service'],
            ['id' => 5, 'name' => 'Others'],
        ]);
    }
}
