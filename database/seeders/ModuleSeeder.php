<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $moduleTemplates = [
            'Pengenalan',
            'Fundamental',
            'Praktik',
            'Studi Kasus',
        ];

        Course::query()->get()->each(function (Course $course) use ($moduleTemplates): void {
            foreach ($moduleTemplates as $name) {
                $course->modules()->create([
                    'name' => "{$name} {$course->title}",
                ]);
            }
        });
    }
}
