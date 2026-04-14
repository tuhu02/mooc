<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail,
            'description' => $this->description,
            'level' => $this->level,
            'is_active' => $this->is_active,
            'is_highlight' => $this->is_highlight,
            'categories' => $this->whenLoaded('categories', function () {
                return $this->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
                });
            }, []),
            'modules_count' => $this->whenCounted('modules'),
            'members_count' => $this->whenCounted('members'),
        ];
    }
}
