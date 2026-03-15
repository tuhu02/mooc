<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::with('user')->get();

        return Inertia::render('admin/members/index', [
            'members' =>  $members
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/members/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'institution' => 'required|string|max:50',
            'gender' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date|before_or_equal:today',
            'address' => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create($validated);

        Member::create([
            'user_id' => $user->id,
        ]);

        return Redirect::route('admin.members.index');
    }

    public function edit(Member $member)
    {
        return Inertia::render('admin/members/edit', [
            'member' => $member
        ]);
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $member->user->id,
            'institution' => 'required|string|max:50',
            'gender' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date|before_or_equal:today',
            'address' => 'nullable|string|max:1000',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $member->user->update($validated);
    }

    public function destroy(Member $member)
    {
        $member->user->delete();

        return redirect()->back();
    }
}
