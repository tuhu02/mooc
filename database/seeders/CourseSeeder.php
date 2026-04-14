<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Pengantar Pemrograman Web',
                'category_ids' => [1, 2],
                'level' => 'Beginner',
                'description' => 'Belajar dasar HTML, CSS, dan JavaScript untuk membuat website pertama kamu.',
            ],
            [
                'title' => 'Laravel untuk Pemula',
                'category_ids' => [2],
                'level' => 'Beginner',
                'description' => 'Pelajari dasar framework Laravel dari routing hingga database.',
            ],
            [
                'title' => 'Flutter Mobile Development',
                'category_ids' => [3],
                'level' => 'Intermediate',
                'description' => 'Bangun aplikasi mobile cross-platform menggunakan Flutter dari nol.',
            ],
            [
                'title' => 'Desain UI/UX Modern',
                'category_ids' => [4],
                'level' => 'Beginner',
                'description' => 'Pelajari prinsip UI/UX untuk membuat tampilan aplikasi yang menarik.',
            ],
            [
                'title' => 'Dasar Machine Learning',
                'category_ids' => [5],
                'level' => 'Intermediate',
                'description' => 'Memahami konsep dasar machine learning dan implementasinya.',
            ],
            [
                'title' => 'JavaScript Lanjutan',
                'category_ids' => [1],
                'level' => 'Advanced',
                'description' => 'Pelajari konsep lanjutan JavaScript seperti async, closure, dan ES6.',
            ],
            [
                'title' => 'REST API dengan Laravel',
                'category_ids' => [2],
                'level' => 'Intermediate',
                'description' => 'Membangun RESTful API menggunakan Laravel untuk aplikasi modern.',
            ],
            [
                'title' => 'Android Native Development',
                'category_ids' => [3],
                'level' => 'Intermediate',
                'description' => 'Belajar membuat aplikasi Android menggunakan Kotlin.',
            ],
            [
                'title' => 'Dasar Database MySQL',
                'category_ids' => [6],
                'level' => 'Beginner',
                'description' => 'Memahami konsep database relasional dan query SQL dasar.',
            ],
            [
                'title' => 'Git dan GitHub untuk Pemula',
                'category_ids' => [7],
                'level' => 'Beginner',
                'description' => 'Belajar version control menggunakan Git dan kolaborasi di GitHub.',
            ],
        ];

        foreach ($courses as $index => $item) {
            $slug = Course::generateUniqueSlug(Str::slug($item['title']));
            $thumbnail = $this->copyThumbnailToPublicDisk($item['title'], $slug);

            $course = Course::create([
                'title' => $item['title'],
                'slug' => $slug,
                'mentor_id' => 1,
                'thumbnail' => $thumbnail,
                'description' => $item['description'],
                'level' => $item['level'],
                'is_active' => true,
                'is_highlight' => $index < 3,
            ]);

            $course->categories()->sync($item['category_ids']);

            $course->modules()->createMany([
                ['name' => 'Pengenalan'],
                ['name' => 'Fundamental'],
                ['name' => 'Praktik'],
                ['name' => 'Studi Kasus'],
            ]);
        }
    }

    private function copyThumbnailToPublicDisk(string $title, string $slug): string
    {
        $sourcePath = $this->resolveSourceImagePath($title, $slug);

        if (!$sourcePath) {
            throw new RuntimeException("Thumbnail not found for course: {$title}");
        }

        $extension = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
        $targetPath = "courses/{$slug}.{$extension}";

        Storage::disk('public')->put($targetPath, file_get_contents($sourcePath));

        return $targetPath;
    }

    private function resolveSourceImagePath(string $title, string $slug): ?string
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        $baseSlug = Str::slug($title);
        $separatorSlug = Str::of($title)->replace('/', ' ')->slug('-')->value();
        $sourceDir = public_path('courses');

        foreach ($extensions as $extension) {
            $candidates = [
                "{$sourceDir}/{$slug}.{$extension}",
                "{$sourceDir}/{$baseSlug}.{$extension}",
                "{$sourceDir}/{$separatorSlug}.{$extension}",
                "{$sourceDir}/{$title}.{$extension}",
            ];

            foreach ($candidates as $candidate) {
                if (is_file($candidate)) {
                    return $candidate;
                }
            }
        }

        return null;
    }
}
