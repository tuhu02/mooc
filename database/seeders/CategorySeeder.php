<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Pemrograman Dasar',
            'Web Development',
            'Mobile Development',
            'Basis Data',
            'UI/UX Design',
            'Data Science',
            'DevOps',
            'Cyber Security',
            'Software Engineering',
            'Artificial Intelligence',
            'Bahasa Inggris Akademik',
            'Public Speaking',
            'Academic Writing',
            'Communication Skills',
            'Leadership',
            'Research Methodology',
            'Pengembangan Diri',
            'Kewirausahaan',
            'Manajemen Bisnis',
            'Statistika',
            'Psikologi',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate([
                'name' => $name,
            ]);
        }
    }
}
