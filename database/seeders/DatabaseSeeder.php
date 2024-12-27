<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Add All seeder class
        $this->call([
            RequestCategoriesSeeder::class,
            RequestSubcategoriesSeeder::class,
            RequestIssuesSeeder::class,
            IncidentCategoriesSeeder::class,
            IncidentSubcategoriesSeeder::class,
            IncidentIssuesSeeder::class,    
        ]);
    

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
