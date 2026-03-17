<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'thumbnail',
        'description',
        'is_active',
        'mentor_id',
    ];

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_course');
    }
}
