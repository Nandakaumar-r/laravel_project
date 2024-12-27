<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncidentIssuesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('incidentissues')->insert([
            ['id' => 1, 'subcategory_id' => 1, 'issue_description' => 'Computer not turn on'],
            ['id' => 2, 'subcategory_id' => 1, 'issue_description' => 'Slow performance'],
            ['id' => 3, 'subcategory_id' => 1, 'issue_description' => 'Blue screen errors'],
            ['id' => 4, 'subcategory_id' => 1, 'issue_description' => 'Peripheral devices not working'],
            ['id' => 5, 'subcategory_id' => 2, 'issue_description' => 'Router or switch not responding'],
            ['id' => 6, 'subcategory_id' => 2, 'issue_description' => 'connectivity issues'],
            ['id' => 7, 'subcategory_id' => 3, 'issue_description' => 'Phone not charge'],
            ['id' => 8, 'subcategory_id' => 3, 'issue_description' => 'App crashes or not open'],
            ['id' => 9, 'subcategory_id' => 4, 'issue_description' => 'System crashes or freezes'],
            ['id' => 10, 'subcategory_id' => 4, 'issue_description' => 'Update failures'],
            ['id' => 11, 'subcategory_id' => 4, 'issue_description' => 'Corrupted system files'],
            ['id' => 12, 'subcategory_id' => 5, 'issue_description' => 'Application crashes'],
            ['id' => 13, 'subcategory_id' => 5, 'issue_description' => 'Error messages on launch'],
            ['id' => 14, 'subcategory_id' => 6, 'issue_description' => 'No internet connection'],
            ['id' => 15, 'subcategory_id' => 6, 'issue_description' => 'Intermittent connectivity'],
            ['id' => 16, 'subcategory_id' => 7, 'issue_description' => 'Unable to send or receive emails'],
            ['id' => 17, 'subcategory_id' => 7, 'issue_description' => 'Email account hacked'],
            ['id' => 18, 'subcategory_id' => 8, 'issue_description' => 'Unauthorized access to systems'],
            ['id' => 19, 'subcategory_id' => 8, 'issue_description' => 'Data loss or theft'],
            ['id' => 20, 'subcategory_id' => 9, 'issue_description' => 'Virus infections'],
            ['id' => 21, 'subcategory_id' => 9, 'issue_description' => 'Ransomware attacks'],
            ['id' => 22, 'subcategory_id' => 1, 'issue_description' => 'Others'],
            ['id' => 23, 'subcategory_id' => 2, 'issue_description' => 'Others'],
            ['id' => 24, 'subcategory_id' => 3, 'issue_description' => 'Others'],
            ['id' => 25, 'subcategory_id' => 4, 'issue_description' => 'Others'],
            ['id' => 26, 'subcategory_id' => 5, 'issue_description' => 'Others'],
            ['id' => 27, 'subcategory_id' => 6, 'issue_description' => 'Others'],
            ['id' => 28, 'subcategory_id' => 7, 'issue_description' => 'Others'],
            ['id' => 29, 'subcategory_id' => 8, 'issue_description' => 'Others'],
            ['id' => 30, 'subcategory_id' => 9, 'issue_description' => 'Others'],
        ]);
    }
}
