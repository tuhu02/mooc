<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{

    protected $fillable = [
        'title',
        'thumbnail',
        'description',
        'slug',
        'is_active',
        'mentor_id',
        'level',
    ];

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_course');
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function members()
    {
        return $this->belongsToMany(Member::class, 'member_course')
            ->withPivot('enrolled_at')
            ->withTimestamps();
    }


    public static function generateUniqueSlug(string $slug, ?int $excludeId = null): string
    {
        $original = $slug;
        $counter = 1;

        while (true) {
            $query = Course::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }

            if (!$query->exists()) {
                break;
            }

            $slug = $original . '-' . $counter++;
        }

        return $slug;
    }
}
