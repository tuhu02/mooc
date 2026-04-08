<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\Mentor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $thumbnailDirectory = 'seeders/courses';

        $courses = [
            [
                'title' => 'Pengantar Pemrograman Web',
                'mentor_email' => 'andi.pratama@example.com',
                'description' => 'Mata kuliah dasar untuk memahami HTML, CSS, PHP, dan alur pengembangan aplikasi web dari nol.',
                'categories' => ['Pemrograman Dasar', 'Web Development', 'Software Engineering'],
            ],
            [
                'title' => 'Framework Laravel Lanjutan',
                'mentor_email' => 'andi.pratama@example.com',
                'description' => 'Pembahasan routing, controller, authentication, authorization, dan pola pengembangan aplikasi kampus dengan Laravel.',
                'categories' => ['Web Development', 'Software Engineering'],
            ],
            [
                'title' => 'Basis Data dan SQL',
                'mentor_email' => 'siti.rahma@example.com',
                'description' => 'Belajar desain tabel, normalisasi, query SQL, relasi antar data, dan praktik database untuk sistem akademik.',
                'categories' => ['Basis Data', 'Software Engineering'],
            ],
            [
                'title' => 'Rekayasa Perangkat Lunak',
                'mentor_email' => 'siti.rahma@example.com',
                'description' => 'Mengenal analisis kebutuhan, UML, perancangan aplikasi, hingga pengelolaan proyek perangkat lunak.',
                'categories' => ['Software Engineering', 'Pemrograman Dasar'],
            ],
            [
                'title' => 'Jaringan Komputer Dasar',
                'mentor_email' => 'budi.santoso@example.com',
                'description' => 'Materi topologi, protokol jaringan, konfigurasi dasar, dan pemahaman infrastruktur laboratorium komputer.',
                'categories' => ['Cyber Security', 'DevOps'],
            ],
            [
                'title' => 'Cloud Computing untuk Kampus',
                'mentor_email' => 'budi.santoso@example.com',
                'description' => 'Membahas deployment, penyimpanan cloud, dan pengelolaan layanan digital yang sering dipakai di dunia perkuliahan.',
                'categories' => ['DevOps', 'Software Engineering'],
            ],
            [
                'title' => 'UI/UX Design untuk Produk Digital',
                'mentor_email' => 'intan.wulandari@example.com',
                'description' => 'Dasar desain antarmuka, user flow, wireframe, dan prototyping untuk aplikasi pembelajaran dan layanan kampus.',
                'categories' => ['UI/UX Design'],
            ],
            [
                'title' => 'Mobile App Development',
                'mentor_email' => 'intan.wulandari@example.com',
                'description' => 'Pengembangan aplikasi mobile dengan fokus pada struktur proyek, navigasi, state management, dan integrasi API.',
                'categories' => ['Mobile Development', 'Software Engineering'],
            ],
            [
                'title' => 'Data Science dan Analitik',
                'mentor_email' => 'intan.wulandari@example.com',
                'description' => 'Analisis data, visualisasi, dan pengenalan pipeline data untuk tugas akhir maupun riset kampus.',
                'categories' => ['Data Science', 'Artificial Intelligence'],
            ],
            [
                'title' => 'Artificial Intelligence Dasar',
                'mentor_email' => 'intan.wulandari@example.com',
                'description' => 'Pengenalan konsep AI, machine learning dasar, dan penerapan sederhana pada studi kasus akademik.',
                'categories' => ['Artificial Intelligence', 'Data Science'],
            ],
            [
                'title' => 'English Grammar for Academic Writing',
                'mentor_email' => 'maya.lestari@example.com',
                'description' => 'Latihan grammar bahasa Inggris untuk menulis tugas kuliah, artikel, dan laporan akademik dengan lebih tepat.',
                'categories' => ['Bahasa Inggris Akademik', 'Academic Writing'],
            ],
            [
                'title' => 'Public Speaking untuk Presentasi Kelas',
                'mentor_email' => 'maya.lestari@example.com',
                'description' => 'Melatih cara bicara percaya diri, struktur penyampaian, dan teknik menjawab pertanyaan saat presentasi di kelas.',
                'categories' => ['Public Speaking', 'Communication Skills'],
            ],
            [
                'title' => 'Academic Writing dan Referensi Ilmiah',
                'mentor_email' => 'maya.lestari@example.com',
                'description' => 'Menyusun esai, makalah, dan laporan ilmiah lengkap dengan sitasi, daftar pustaka, dan gaya penulisan formal.',
                'categories' => ['Academic Writing', 'Research Methodology'],
            ],
            [
                'title' => 'Leadership dan Kerja Tim di Proyek Kampus',
                'mentor_email' => 'maya.lestari@example.com',
                'description' => 'Belajar memimpin tim, membagi peran, menyusun target, dan menyelesaikan proyek kelompok secara efektif.',
                'categories' => ['Leadership', 'Communication Skills'],
            ],
        ];

        foreach ($courses as $courseData) {
            $mentor = Mentor::whereHas('user', function ($query) use ($courseData) {
                $query->where('email', $courseData['mentor_email']);
            })->first();

            if (!$mentor) {
                continue;
            }

            $slug = Str::slug($courseData['title']);
            $thumbnailPath = $thumbnailDirectory . '/' . $slug . '.svg';

            Storage::disk('public')->put($thumbnailPath, $this->buildThumbnailSvg(
                $courseData['title'],
            ));

            $course = Course::firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $courseData['title'],
                    'mentor_id' => $mentor->id,
                    'thumbnail' => $thumbnailPath,
                    'description' => $courseData['description'],
                    'is_active' => true,
                ]
            );

            $categoryIds = collect($courseData['categories'])
                ->map(fn(string $categoryName) => Category::firstOrCreate([
                    'name' => $categoryName,
                ])->id)
                ->filter()
                ->values();

            if ($categoryIds->isEmpty()) {
                $categoryIds = collect([
                    Category::firstOrCreate(['name' => 'Pengembangan Diri'])->id,
                ]);
            }

            $course->categories()->syncWithoutDetaching($categoryIds->all());
        }

        $fallbackCategoryId = Category::firstOrCreate([
            'name' => 'Pengembangan Diri',
        ])->id;

        Course::doesntHave('categories')
            ->get()
            ->each(fn(Course $course) => $course->categories()->syncWithoutDetaching([
                $fallbackCategoryId,
            ]));
    }

    private function buildThumbnailSvg(string $title): string
    {
        $safeTitle = e($title);

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="{$safeTitle}">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2563eb" />
            <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)" />
    <circle cx="1040" cy="120" r="180" fill="rgba(255,255,255,0.08)" />
    <circle cx="180" cy="620" r="220" fill="rgba(255,255,255,0.06)" />
    <text x="80" y="140" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="44" font-weight="700">MOOC</text>
    <text x="80" y="320" fill="#ffffff" font-family="Arial, sans-serif" font-size="72" font-weight="700">{$safeTitle}</text>
    <text x="80" y="400" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="34">Perkuliahan digital untuk mahasiswa</text>
    <text x="80" y="470" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">Materi praktis, studi kasus, dan pembelajaran terstruktur</text>
</svg>
SVG;
    }
}
