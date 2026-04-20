<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::with('user')->cursorPaginate(10);
        return Inertia::render('admin/admins/index', [
            'admins' => fn() => $admins
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/admins/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'type' => 'admin'
            ]);

            Admin::create([
                'user_id' => $user->id,
            ]);
        });

        return Redirect::route('admin.admins.index')->with('success', 'Admin Successfully Created!');
    }

    public function edit(Admin $admin)
    {
        $admin->load('user');

        return Inertia::render('admin/admins/edit', [
            'admin' => fn() => $admin,
        ]);
    }

    public function update(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $admin->user_id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        DB::transaction(function () use ($validated, $admin) {
            $user = $admin->user;
            $user->name = $validated['name'];
            $user->email = $validated['email'];

            if (!empty($validated['password'])) {
                $user->password = $validated['password'];
            }

            $user->save();
        });

        return Redirect::route('admin.admins.index')
            ->with('success', 'Admin Successfully Updated!');
    }

    public function destroy(Admin $admin)
    {
        DB::transaction(function () use ($admin) {
            $admin->delete();
            $admin->user->delete();
        });

        return redirect()->back()->with('success', 'Admin Successfully Deleted!');
    }
}
