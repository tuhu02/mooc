<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class PendingEmailChangeVerificationNotification extends Notification
{
    use Queueable;

    public function __construct(private User $user) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = URL::temporarySignedRoute(
            'email.change.verify',
            now()->addMinutes(60),
            [
                'user' => $this->user->id,
                'hash' => sha1($this->user->pending_email),
            ],
        );

        return (new MailMessage)
            ->subject('Verifikasi Perubahan Email')
            ->line('Admin meminta perubahan alamat email akun kamu.')
            ->line('Klik tombol di bawah untuk memverifikasi email baru.')
            ->action('Verifikasi Email Baru', $verificationUrl)
            ->line('Jika ini bukan permintaan kamu, abaikan email ini.');
    }
}
