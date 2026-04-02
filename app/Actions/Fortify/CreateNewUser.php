<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use App\Models\Member;
use App\Models\Mentor;
use Illuminate\Support\Facades\DB;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'type' => 'required|in:member,mentor',
            'institution' => 'required_if:type,member|nullable|string|max:50',
            'password' => $this->passwordRules(),
        ])->validate();


        return DB::transaction(function () use ($input) {
            $type = $input['type'];

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'type' => $type,
            ]);

            if ($type === 'member') {
                Member::create([
                    'user_id' => $user->id,
                    'institution' => $input['institution'],
                ]);
            }

            if ($type === 'mentor') {
                Mentor::create([
                    'user_id' => $user->id,
                ]);
            }

            return $user;
        });
    }
}
