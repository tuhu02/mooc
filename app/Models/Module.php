<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'course_id',
        'sort_order',
        'is_preview',
        'available_at',
        'title',
        'thumbnail',
        'video',
        'description',
        'duration',
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'available_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function attachments()
    {
        return $this->hasMany(ModuleAttachment::class, 'module_id');
    }
}