<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mentor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class MentorSeeder extends Seeder
{
    public function run(): void
    {

        $user = User::firstOrCreate(
            ['email' => 'mentor@example.com'],
            [
                'name' => 'John Mentor',
                'password' => 'tuhu.tuhu',
                'type' => 'mentor',
                'email_verified_at' => now(),
                'address' => 'Jl. Contoh Alamat 123',

            ]
        );

        $user->assignRole('mentor');

        $avatarPath = null;

        Mentor::firstOrCreate(
            ['user_id' => $user->id],
            [
                'avatar' => $avatarPath,
                'bio' => 'Mentor berpengalaman di bidang IT',
            ]
        );
    }
}
