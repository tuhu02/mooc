<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;


class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user->type == 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->type == 'mentor') {
            return redirect()->route('mentor.dashboard');
        }

        return redirect()->route('member.dashboard');
    }
}
