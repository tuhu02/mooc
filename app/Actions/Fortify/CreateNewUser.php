<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use App\Models\Institution;

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
            'institutions' => ['required', 'string', 'max:255'],
            'password' => $this->passwordRules(),
        ])->validate();

        $institution = Institution::firstOrCreate([
            'name' => trim($input['institutions'])
        ]);

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'institution_id' => $institution->id,
            'password' => $input['password'],
        ]);
    }
}
