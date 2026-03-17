<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mentor;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;

class MentorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mentors = Mentor::with('user')->get();

        return Inertia::render('admin/mentors/index', [
            'mentors' =>  $mentors
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/mentors/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'address' => 'nullable|string|max:1000',
            'bio' => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $avatarPath = null;

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        Mentor::create([
            'user_id' => $user->id,
            'avatar' => $avatarPath,
            'address' => $validated['address'] ?? null,
            'bio' => $validated['bio'] ?? null,
        ]);

        return Redirect::route('admin.mentors.index')
            ->with('success', 'Mentor berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mentor $mentor)
    {
        $mentor->load('user');

        return Inertia::render('admin/mentors/edit', [
            'mentor' => $mentor
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
