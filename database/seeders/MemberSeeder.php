<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'Ahmad Fikri',
                'email' => 'ahmad.fikri@example.com',
                'institution' => 'Universitas Negeri Jakarta',
                'gender' => 'Laki-laki',
                'date_of_birth' => '2001-04-12',
            ],
            [
                'name' => 'Nadia Putri',
                'email' => 'nadia.putri@example.com',
                'institution' => 'Universitas Indonesia',
                'gender' => 'Perempuan',
                'date_of_birth' => '2002-09-03',
            ],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky.pratama@example.com',
                'institution' => 'Institut Teknologi Bandung',
                'gender' => 'Laki-laki',
                'date_of_birth' => '2000-11-21',
            ],
            [
                'name' => 'Salsa Amelia',
                'email' => 'salsa.amelia@example.com',
                'institution' => 'Universitas Brawijaya',
                'gender' => 'Perempuan',
                'date_of_birth' => '2003-02-18',
            ],
            [
                'name' => 'Dimas Saputra',
                'email' => 'dimas.saputra@example.com',
                'institution' => 'Universitas Diponegoro',
                'gender' => 'Laki-laki',
                'date_of_birth' => '2001-07-30',
            ],
        ];

        foreach ($members as $memberData) {
            $user = User::firstOrCreate(
                ['email' => $memberData['email']],
                [
                    'name' => $memberData['name'],
                    'password' => 'tuhu.tuhu',
                    'type' => 'member',
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('member');

            Member::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'institution' => $memberData['institution'],
                    'gender' => $memberData['gender'],
                    'date_of_birth' => $memberData['date_of_birth'],
                ]
            );
        }
    }
}
