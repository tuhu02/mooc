<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'course_id',
        'sort_order',
        'title',
        'thumbnail',
        'video',
        'description',
        'duration',
        'attachment',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
