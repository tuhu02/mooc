<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Mentor extends Model
{
    use Searchable;

    protected $fillable = [
        'user_id',
        'avatar',
        'bio'
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => (int) $this->id,
            'name' => $this->user?->name,
            'bio' => $this->bio,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
