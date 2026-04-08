<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Course extends Model
{
    use Searchable;

    protected $fillable = [
        'title',
        'thumbnail',
        'description',
        'slug',
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


    public function toSearchableArray(): array
    {
        $courseData = [
            'id' => (int) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'slug' => $this->slug,
        ];

        $courseData['mentor_name'] = $this->mentor ? $this->mentor->name : null;

        return $courseData;
    }
}
