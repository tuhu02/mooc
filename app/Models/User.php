<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use App\Notifications\ApiVerifyEmailNotification;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasRoles, HasFactory, Notifiable, TwoFactorAuthenticatable;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function sendEmailVerificationNotification()
    {
        $isApiRequest = request()->is('api/*') || request()->expectsJson();

        if ($isApiRequest) {
            $otp = rand(100000, 999999);

            $this->otps()->create([
                'otp' => $otp,
                'type' => 'email_verification',
                'expires_at' => Carbon::now()->addMinutes(60),
            ]);

            $this->notify(new ApiVerifyEmailNotification($otp));
        } else {
            $this->notify(new VerifyEmail);
        }
    }

    public function otps()
    {
        return $this->hasMany(Otp::class);
    }


    public function member()
    {
        return $this->hasOne(Member::class);
    }


    public function mentor()
    {
        return $this->hasOne(Mentor::class);
    }
}
