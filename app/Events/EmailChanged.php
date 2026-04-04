<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmailChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $newEmail;
    public $role;

    /**
     * Create a new event instance.
     */
    public function __construct($userId, $newEmail, $role)
    {
        $this->userId = $userId;
        $this->newEmail = $newEmail;
        $this->role = $role;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->userId),
        ];
    }

    public function broadcastWith()
    {
        return [
            'message' => "Admin meminta perubahan email ke {$this->newEmail}. Silakan cek email baru kamu untuk verifikasi."
        ];
    }
}
