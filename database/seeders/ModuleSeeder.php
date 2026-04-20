<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $moduleTemplates = [
            [
                'title' => 'Orientasi Kelas dan Peta Belajar',
                'duration' => 20,
                'description' => <<<'MD'
## Tujuan Modul

Pada modul ini, Anda akan memahami arah pembelajaran secara menyeluruh, mulai dari target akhir, alur materi, hingga pola belajar yang efektif agar progres tetap konsisten.

## Apa yang Akan Dipelajari

- Cara membaca roadmap kelas dari awal sampai akhir.
- Strategi membagi waktu belajar harian dan mingguan.
- Metode mencatat materi agar mudah ditinjau ulang.
- Kesalahan umum pemula saat memulai kursus dan cara menghindarinya.

## Studi Singkat

Peserta yang memiliki rencana belajar jelas cenderung menyelesaikan kelas lebih cepat dibandingkan peserta yang belajar tanpa target. Kunci utamanya adalah ritme yang konsisten dan evaluasi berkala.

## Latihan Refleksi

Tuliskan target belajar Anda selama 2 minggu ke depan, termasuk topik yang paling menantang, waktu belajar per hari, dan indikator sederhana untuk mengukur kemajuan.
MD,
            ],
            [
                'title' => 'Konsep Dasar dan Fondasi Inti',
                'duration' => 35,
                'description' => <<<'MD'
## Ringkasan Materi

Modul ini membahas konsep inti yang menjadi fondasi sebelum masuk ke implementasi. Fokus utama adalah memahami "mengapa" sebuah pendekatan digunakan, bukan hanya "bagaimana" menulis kodenya.

## Poin Penting

1. Memahami istilah dasar dan hubungan antar konsep.
2. Mengenali alur data dari input sampai output.
3. Menentukan struktur solusi yang mudah dikembangkan.
4. Membaca dokumentasi secara efektif untuk kebutuhan harian.

## Checklist Pemahaman

- Anda bisa menjelaskan konsep dengan bahasa sendiri.
- Anda bisa menyebutkan minimal dua contoh penerapan nyata.
- Anda tahu batasan dari pendekatan yang sedang dipelajari.

## Catatan Praktis

Jika suatu konsep terasa sulit, pecah menjadi bagian kecil: definisi, contoh, kontra contoh, lalu praktik sederhana. Pendekatan ini mempercepat pemahaman jangka panjang.
MD,
            ],
            [
                'title' => 'Implementasi Bertahap dari Nol',
                'duration' => 50,
                'description' => <<<'MD'
## Tujuan Implementasi

Anda akan membangun fitur secara bertahap dimulai dari versi paling sederhana, lalu ditingkatkan dengan validasi, struktur kode yang rapi, dan pola yang mudah dirawat.

## Alur Pengerjaan

1. Siapkan struktur awal dan skenario input.
2. Bangun versi minimum yang berfungsi.
3. Tambahkan validasi dan penanganan error.
4. Rapikan kode agar lebih mudah dibaca tim.
5. Uji fungsi utama dengan data realistis.

## Prinsip Penting

- Mulai kecil, lalu iterasi.
- Jangan menambah kompleksitas sebelum dibutuhkan.
- Prioritaskan keterbacaan dan konsistensi.

## Tantangan Kecil

Refactor satu bagian implementasi agar lebih modular. Bandingkan sebelum dan sesudah dari sisi keterbacaan, kemudahan debug, dan potensi reuse.
MD,
            ],
            [
                'title' => 'Analisis Kasus Dunia Nyata',
                'duration' => 40,
                'description' => <<<'MD'
## Studi Kasus

Sebuah tim produk perlu merilis fitur baru dalam waktu singkat, tetapi tetap harus menjaga stabilitas sistem lama. Tantangan ini sangat umum pada proyek nyata.

## Langkah Analisis

- Identifikasi kebutuhan inti pengguna.
- Petakan risiko teknis dan non teknis.
- Tentukan prioritas pengembangan.
- Buat rencana rilis bertahap.

## Hasil yang Diharapkan

Peserta mampu mengambil keputusan teknis berdasarkan konteks bisnis, bukan hanya preferensi pribadi. Ini adalah kompetensi penting saat bekerja dalam tim lintas fungsi.

## Diskusi

Jika Anda menjadi lead engineer, fitur mana yang dirilis terlebih dahulu dan mengapa? Jelaskan trade-off yang Anda ambil.
MD,
            ],
            [
                'title' => 'Optimasi, Debugging, dan Best Practice',
                'duration' => 45,
                'description' => <<<'MD'
## Fokus Modul

Setelah fitur berjalan, tahap berikutnya adalah memastikan performa stabil, error mudah dilacak, dan standar kualitas tetap terjaga.

## Materi Utama

- Teknik debugging yang sistematis.
- Cara membaca log untuk mempercepat investigasi.
- Identifikasi bottleneck performa paling umum.
- Praktik penulisan kode yang memudahkan maintenance.

## Pola Kerja yang Direkomendasikan

1. Reproduksi masalah secara konsisten.
2. Isolasi area yang paling mungkin menjadi akar masalah.
3. Lakukan perbaikan kecil yang terukur.
4. Verifikasi hasil dan dokumentasikan pembelajaran.

## Output

Anda memiliki kerangka kerja yang bisa digunakan berulang kali saat menghadapi bug atau penurunan performa di proyek mana pun.
MD,
            ],
            [
                'title' => 'Rangkuman, Evaluasi, dan Rencana Lanjutan',
                'duration' => 30,
                'description' => <<<'MD'
## Penutup Pembelajaran

Modul terakhir membantu Anda merangkum seluruh perjalanan belajar, mengukur capaian saat ini, dan menyusun rencana peningkatan berikutnya secara terstruktur.

## Aktivitas Utama

- Review konsep dari modul awal hingga akhir.
- Evaluasi kekuatan dan area yang masih perlu ditingkatkan.
- Susun mini roadmap 30 hari setelah kelas selesai.

## Template Rencana 30 Hari

1. Minggu 1: Penguatan konsep inti dan latihan dasar.
2. Minggu 2: Implementasi mini project.
3. Minggu 3: Refactor, testing, dan dokumentasi.
4. Minggu 4: Publikasi hasil dan minta umpan balik.

## Pesan Akhir

Kemajuan besar biasanya berasal dari kebiasaan kecil yang dilakukan terus menerus. Konsistensi lebih penting daripada kecepatan sesaat.
MD,
            ],
        ];

        Course::query()->get()->each(function (Course $course) use ($moduleTemplates): void {
            $course->modules()->delete();

            foreach ($moduleTemplates as $index => $template) {
                $course->modules()->create([
                    'sort_order' => $index + 1,
                    'title' => $template['title'] . ' - ' . $course->title,
                    'description' => $template['description'],
                    'duration' => $template['duration'],
                    'thumbnail' => null,
                    'video' => null,
                    'attachment' => null,
                ]);
            }
        });
    }
}
