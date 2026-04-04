<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailChangeVerificationController extends Controller
{
    public function __invoke(Request $request, User $user, string $hash): RedirectResponse
    {
        if (! $request->hasValidSignature()) {
            return redirect()->route('login')->with('error', 'Link verifikasi tidak valid atau sudah kedaluwarsa.');
        }

        if (! $user->pending_email || ! hash_equals(sha1($user->pending_email), $hash)) {
            return redirect()->route('login')->with('error', 'Permintaan perubahan email tidak ditemukan.');
        }

        $user->forceFill([
            'email' => $user->pending_email,
            'pending_email' => null,
            'email_verified_at' => now(),
        ])->save();

        if (Auth::check() && (int) Auth::id() === (int) $user->id) {
            $route = match ($user->type) {
                'admin' => 'admin.dashboard',
                'mentor' => 'mentor.dashboard',
                default => 'dashboard',
            };

            return redirect()->route($route)->with('status', 'Email berhasil diverifikasi dan diperbarui.');
        }
        
        return redirect()->route('login')->with('status', 'Email berhasil diverifikasi, silakan login.');
    }
}
