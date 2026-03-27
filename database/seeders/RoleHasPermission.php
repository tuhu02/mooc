<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleHasPermission extends Seeder
{
    public function run(): void
    {
        // Roles
        $learner = Role::firstOrCreate(['name' => 'member']);
        $instructor = Role::firstOrCreate(['name' => 'mentor']);
        $admin = Role::firstOrCreate(['name' => 'admin']);

        // Permissions
        $manageRoles = Permission::firstOrCreate(['name' => 'manage.roles']);
        $manageSystem = Permission::firstOrCreate(['name' => 'manage.system']);
        $manageCourses = Permission::firstOrCreate(['name' => 'manage.courses']);
        $accessCourses = Permission::firstOrCreate(['name' => 'access.courses']);

        // Assign permission
        $admin->givePermissionTo($manageRoles);
        $admin->givePermissionTo($manageSystem);
        $instructor->givePermissionTo($manageCourses);
        $learner->givePermissionTo($accessCourses);
        

        $user = User::firstOrCreate([
            'name' => 'Tuhu Pangestu',
            'email' => 'tuhuwkwk@gmail.com',
            'password' => 'tuhu.tuhu',
            'email_verified_at' => now()
        ]);

        $user->assignRole('admin');
        $user->type = 'admin';
        $user->save();

        Admin::firstOrCreate([
            'user_id' => $user->id,
        ]);
    }
}
