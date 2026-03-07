<?php

namespace App\Http\Controllers\Web\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::select('id', 'name')->where('name', '!=', 'admin')->get();
        return Inertia::render('admin/roles/index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/roles/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        Role::create($validated);

        return Redirect::route('admin.roles.index')->with('success', 'Role has been successfully added!');
    }

    public function edit(Role $role)
    {
        return Inertia::render('admin/roles/roles-edit', [
            'role' => $role
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        $role->update($validated);

        return Redirect::route('admin.roles.index')->with('success', 'Role berhasil diperbarui!');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully!');
    }
}
