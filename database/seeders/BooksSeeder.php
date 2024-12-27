<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BooksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $faker = \Faker\Factory::create();
       for ($i =0; $i < 50; $i++) {
        Book::create([
            'title' => $faker->sentence,
            'author' => $faker->name,
            'description' => $faker->sentence
        ]);
       }
    }
}
