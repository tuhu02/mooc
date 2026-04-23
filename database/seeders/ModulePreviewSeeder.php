<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class ModulePreviewSeeder extends Seeder
{
    public function run(): void
    {
        Course::query()
            ->with(['modules' => fn($query) => $query->orderBy('sort_order')->orderBy('id')])
            ->get()
            ->each(function (Course $course): void {
                if ($course->modules->isEmpty()) {
                    return;
                }

                $firstModuleId = $course->modules->first()->id;

                $course->modules()->update([
                    'is_preview' => false,
                ]);

                $course->modules()->whereKey($firstModuleId)->update([
                    'is_preview' => true,
                ]);
            });
    }
}
