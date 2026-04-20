<?php

namespace App\Http\Controllers\Web\Admin;

use App\Events\EmailChanged;
use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use App\Notifications\PendingEmailChangeVerificationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;


class MemberController extends Controller
{
    public function index()
    {
        $members = Member::with('user')->orderBy('id')->cursorPaginate(10);

        return Inertia::render('admin/members/index', [
            'members' => fn() => $members
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

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'type' => 'member'
            ]);

            Member::create([
                'user_id' => $user->id,
                'institution' => $validated['institution'],
                'gender' => $validated['gender'],
                'date_of_birth' => $validated['date_of_birth'],
                'address' => $validated['address'],
            ]);
        });

        return Redirect::route('admin.members.index')->with('success', 'Member Successfully Created!');;
    }

    public function edit(Member $member)
    {
        $member->load('user');

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

        DB::transaction(function () use ($validated, $member) {
            $user = $member->user;

            $user->fill([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            if ($user->isDirty('email')) {
                $user->verified_at = null;
            }

            if (!empty($validated['password'])) {
                $user['password'] = $validated['password'];
            }

            $user->save();

            $member->update([
                'institution' => $validated['institution'],
                'gender' => $validated['gender'],
                'date_of_birth' => $validated['date_of_birth'],
                'address' => $validated['address'],
            ]);
        });

        return Redirect::route('admin.members.index')->with('success', 'Member Successfully Updated!');;
    }

    public function destroy(Member $member)
    {
        DB::transaction(function () use ($member) {
            $member->delete();
            $member->user->delete();
        });

        return redirect()->back()->with('success', 'Member Successfully Deleted!');;
    }
}
