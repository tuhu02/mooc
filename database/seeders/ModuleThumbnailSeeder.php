<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class ModuleThumbnailSeeder extends Seeder
{
    public function run(): void
    {
        $thumbnails = [
            1 => 'Modul1.png',
            2 => 'Modul2.png',
            3 => 'Modul3.png',
            4 => 'Modul4.png',
            5 => 'Modul5.png',
            6 => 'Modul6.png',
        ];

        $sourceDir = public_path('modul-thumbnail');
        $destDir = storage_path('app/public/modules');

        if (!is_dir($destDir)) {
            mkdir($destDir, 0777, true);
        }

        Course::query()->get()->each(function (Course $course) use ($thumbnails, $sourceDir, $destDir): void {
            $modules = $course->modules()->orderBy('sort_order')->get();
            foreach ($modules as $index => $module) {
                $thumbnail = $thumbnails[$index + 1] ?? null;
                if ($thumbnail) {
                    $sourcePath = $sourceDir . DIRECTORY_SEPARATOR . $thumbnail;
                    $destPath = $destDir . DIRECTORY_SEPARATOR . $thumbnail;
                    if (file_exists($sourcePath)) {
                        copy($sourcePath, $destPath);
                        $module->update([
                            'thumbnail' => 'modules/' . $thumbnail,
                        ]);
                    }
                }
            }
        });
    }
}
