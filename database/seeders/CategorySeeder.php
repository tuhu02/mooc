<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Web Development', 'icon' => 'Globe'],
            ['name' => 'Backend Development', 'icon' => 'Server'],
            ['name' => 'Mobile Development', 'icon' => 'Mobile'],
            ['name' => 'UI/UX Design', 'icon' => 'Palette'],
            ['name' => 'Machine Learning', 'icon' => 'Brain'],
            ['name' => 'Database', 'icon' => 'Database'],
            ['name' => 'Version Control', 'icon' => 'Git Branch'],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(['name' => $data['name']], ['icon' => $data['icon']]);
        }
    }
}
