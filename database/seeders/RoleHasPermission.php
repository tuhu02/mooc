<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleHasPermission extends Seeder
{
    public function run(): void
    {
        // Roles
        $learner = Role::firstOrCreate(['name' => 'learner']); // ganti member
        $instructor = Role::firstOrCreate(['name' => 'instructor']);
        $admin = Role::firstOrCreate(['name' => 'admin']);

        // Permissions
        $manageRoles = Permission::firstOrCreate(['name' => 'manage.roles']);
        $manageCourses = Permission::firstOrCreate(['name' => 'manage.courses']);
        $accessCourses = Permission::firstOrCreate(['name' => 'access.courses']);

        // Assign permission
        $admin->givePermissionTo($manageRoles);
        $instructor->givePermissionTo($manageCourses);
        $learner->givePermissionTo($accessCourses);
    }
}