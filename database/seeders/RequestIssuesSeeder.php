<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestIssuesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('requestissues')->insert([
            ['id' => 1, 'subcategory_id' => 1, 'issue_description' => 'Account creation requests'],
            ['id' => 2, 'subcategory_id' => 1, 'issue_description' => 'Password reset requests'],
            ['id' => 3, 'subcategory_id' => 1, 'issue_description' => 'Role or permission changes'],
            ['id' => 4, 'subcategory_id' => 2, 'issue_description' => 'Request for access to applications'],
            ['id' => 5, 'subcategory_id' => 2, 'issue_description' => 'Request for software installation'],
            ['id' => 6, 'subcategory_id' => 3, 'issue_description' => 'Request for new laptops/desktops'],
            ['id' => 7, 'subcategory_id' => 3, 'issue_description' => 'Request for mobile devices'],
            ['id' => 8, 'subcategory_id' => 4, 'issue_description' => 'Request for hardware upgrades'],
            ['id' => 9, 'subcategory_id' => 4, 'issue_description' => 'Request for replacing broken devices'],
            ['id' => 10, 'subcategory_id' => 5, 'issue_description' => 'Request for IT policies and procedures'],
            ['id' => 11, 'subcategory_id' => 5, 'issue_description' => 'Request for software usage guidelines'],
            ['id' => 12, 'subcategory_id' => 6, 'issue_description' => 'Inquiries about system status'],
            ['id' => 13, 'subcategory_id' => 6, 'issue_description' => 'Inquiries about maintenance schedules'],
            ['id' => 14, 'subcategory_id' => 7, 'issue_description' => 'Request for IT support assistance'],
            ['id' => 15, 'subcategory_id' => 7, 'issue_description' => 'Request for remote troubleshooting'],
            ['id' => 16, 'subcategory_id' => 8, 'issue_description' => 'Request for software training sessions'],
            ['id' => 17, 'subcategory_id' => 8, 'issue_description' => 'Request for new technology training'],
            ['id' => 18, 'subcategory_id' => 1, 'issue_description' => 'Others'],
            ['id' => 19, 'subcategory_id' => 2, 'issue_description' => 'Others'],
            ['id' => 20, 'subcategory_id' => 3, 'issue_description' => 'Others'],
            ['id' => 21, 'subcategory_id' => 4, 'issue_description' => 'Others'],
            ['id' => 22, 'subcategory_id' => 5, 'issue_description' => 'Others'],
            ['id' => 23, 'subcategory_id' => 6, 'issue_description' => 'Others'],
            ['id' => 24, 'subcategory_id' => 7, 'issue_description' => 'Others'],
            ['id' => 25, 'subcategory_id' => 8, 'issue_description' => 'Others'],
        ]);
    }
}
