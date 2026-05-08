<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class LiveCourseSeeder extends Seeder
{
    public function run(): void
    {
        $liveCourses = [
            [
                'title'        => 'Live Coding: Bangun REST API dengan Laravel',
                'category_ids' => [2],
                'level'        => 'Intermediate',
                'description'  => 'Sesi live coding interaktif membangun REST API lengkap dengan autentikasi, validasi, dan dokumentasi menggunakan Laravel.',
                'is_highlight' => true,
            ],
            [
                'title'        => 'Live Workshop: React & TypeScript dari Nol',
                'category_ids' => [1],
                'level'        => 'Beginner',
                'description'  => 'Workshop langsung bersama mentor untuk mempelajari React dengan TypeScript, mulai dari setup hingga deploy aplikasi pertama.',
                'is_highlight' => true,
            ],
            [
                'title'        => 'Live Session: UI/UX Design Sprint',
                'category_ids' => [4],
                'level'        => 'Beginner',
                'description'  => 'Ikuti sesi live desain sprint intensif bersama mentor berpengalaman dan buat prototype aplikasi dalam satu hari.',
                'is_highlight' => true,
            ],
            [
                'title'        => 'Live Bootcamp: Flutter Advanced',
                'category_ids' => [3],
                'level'        => 'Advanced',
                'description'  => 'Bootcamp live khusus developer Flutter yang ingin menguasai state management, animasi, dan integrasi API kompleks.',
                'is_highlight' => false,
            ],
            [
                'title'        => 'Live Q&A: Machine Learning untuk Bisnis',
                'category_ids' => [5],
                'level'        => 'Intermediate',
                'description'  => 'Sesi tanya jawab live bersama praktisi ML, bahas implementasi algoritma populer dan studi kasus nyata dari industri.',
                'is_highlight' => false,
            ],
            [
                'title'        => 'Live Mentoring: Database Design & Optimization',
                'category_ids' => [6],
                'level'        => 'Intermediate',
                'description'  => 'Sesi mentoring live untuk belajar merancang skema database yang efisien, indexing, dan query optimization di MySQL.',
                'is_highlight' => false,
            ],
        ];

        foreach ($liveCourses as $index => $item) {
            $slug      = Course::generateUniqueSlug(Str::slug($item['title']));
            $thumbnail = $this->copyThumbnailToPublicDisk($item['title'], $slug);

            $course = Course::create([
                'title'        => $item['title'],
                'slug'         => $slug,
                'mentor_id'    => 1,
                'thumbnail'    => $thumbnail,
                'description'  => $item['description'],
                'level'        => $item['level'],
                'is_active'    => true,
                'is_highlight' => $item['is_highlight'],
                'type'         => 'live',
            ]);

            $course->categories()->sync($item['category_ids']);
        }
    }

    private function copyThumbnailToPublicDisk(string $title, string $slug): string
    {
        $sourcePath = $this->resolveSourceImagePath($title, $slug);

        if (! $sourcePath) {
            // Gunakan thumbnail fallback jika tidak ada gambar spesifik live course
            $fallback = $this->resolveFallbackThumbnail();

            if (! $fallback) {
                throw new RuntimeException("Thumbnail not found for live course: {$title}");
            }

            $sourcePath = $fallback;
        }

        $extension  = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
        $targetPath = "courses/{$slug}.{$extension}";

        Storage::disk('public')->put($targetPath, file_get_contents($sourcePath));

        return $targetPath;
    }

    private function resolveSourceImagePath(string $title, string $slug): ?string
    {
        $extensions  = ['png', 'jpg', 'jpeg', 'webp'];
        $baseSlug    = Str::slug($title);
        $separatorSlug = Str::of($title)->replace('/', ' ')->slug('-')->value();
        $sourceDir   = public_path('courses');

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

    /**
     * Ambil salah satu thumbnail yang sudah ada sebagai fallback.
     */
    private function resolveFallbackThumbnail(): ?string
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        $sourceDir  = public_path('courses');

        if (! is_dir($sourceDir)) {
            return null;
        }

        foreach (scandir($sourceDir) as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, $extensions, true)) {
                return "{$sourceDir}/{$file}";
            }
        }

        return null;
    }
}
