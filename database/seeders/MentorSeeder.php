<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mentor;
use Spatie\Permission\Models\Role;

class MentorSeeder extends Seeder
{
    public function run(): void
    {
        $mentors = [
            [
                'name' => 'Dr. Andi Pratama, M.Kom.',
                'email' => 'andi.pratama@example.com',
                'bio' => 'Dosen pengampu pemrograman web, berfokus pada arsitektur aplikasi dan praktik pengembangan modern.',
            ],
            [
                'name' => 'Siti Rahma, S.Kom., M.T.',
                'email' => 'siti.rahma@example.com',
                'bio' => 'Mengajar basis data, analisis sistem, dan rekayasa perangkat lunak di lingkungan kampus.',
            ],
            [
                'name' => 'Budi Santoso, M.T.',
                'email' => 'budi.santoso@example.com',
                'bio' => 'Spesialis jaringan komputer, cloud computing, dan keamanan infrastruktur akademik.',
            ],
            [
                'name' => 'Intan Wulandari, S.Kom., M.Sc.',
                'email' => 'intan.wulandari@example.com',
                'bio' => 'Fokus pada UI/UX, mobile development, dan data science untuk kebutuhan pembelajaran kampus.',
            ],
            [
                'name' => 'Maya Lestari, M.Pd.',
                'email' => 'maya.lestari@example.com',
                'bio' => 'Membimbing bahasa Inggris akademik, public speaking, penulisan ilmiah, dan komunikasi presentasi di kelas.',
            ],
        ];

        foreach ($mentors as $mentorData) {
            $user = User::firstOrCreate(
                ['email' => $mentorData['email']],
                [
                    'name' => $mentorData['name'],
                    'password' => 'tuhu.tuhu',
                    'type' => 'mentor',
                    'email_verified_at' => now(),
                    'address' => 'Jl. Kampus Merdeka No. 1',
                ]
            );

            $user->assignRole('mentor');

            Mentor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'avatar' => null,
                    'bio' => $mentorData['bio'],
                ]
            );
        }
    }
}
