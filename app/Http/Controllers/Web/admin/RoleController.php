<?php

namespace App\Http\Controllers\Web\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class RoleController extends Controller
{
    public function index(){
        $roles = Role::select('id', 'name')->get();
        return Inertia::render('admin/roles/roles-index', [
            'roles' => $roles
        ]);
    }

    public function add(){
        return Inertia::render('admin/roles/roles-add');
    }

    public function store(Request $request)
    {
        // 1. Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ], [
            // Custom pesan error (opsional)
            'name.unique' => 'Nama role ini sudah ada, gunakan nama lain.',
            'name.required' => 'Nama role wajib diisi.',
        ]);

        // 2. Simpan ke database
        Role::create($validated);

        // 3. Redirect kembali dengan pesan sukses (opsional)
        // Inertia akan otomatis menangkap flash message jika dikonfigurasi
        return Redirect::route('admin.roles.index')->with('success', 'Role berhasil ditambahkan!');
    }

    public function edit(Role $role)
    {
        return Inertia::render('admin/roles/roles-edit', [
            'role' => $role
        ]);
    }

    public function update(Request $request, Role $role)
    {
        // 1. Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ], [
            'name.unique' => 'Nama role ini sudah ada, gunakan nama lain.',
            'name.required' => 'Nama role wajib diisi.',
        ]);

        // 2. Update role
        $role->update($validated);

        // 3. Redirect dengan pesan sukses
        return Redirect::route('admin.roles.index')->with('success', 'Role berhasil diperbarui!');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully!');
    }


}
