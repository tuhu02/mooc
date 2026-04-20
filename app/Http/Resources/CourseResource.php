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
            'mentor' => $this->whenLoaded('mentor', function () {
                return [
                    'id' => $this->mentor->id,
                    'name' => $this->mentor->user?->name,
                    'email' => $this->mentor->user?->email,
                ];
            }),
            'categories' => $this->whenLoaded('categories', function () {
                return $this->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
                });
            }, []),
            'modules' => $this->whenLoaded('modules', function () {
                return $this->modules->map(function ($module) {
                    return [
                        'id' => $module->id,
                        'sort_order' => $module->sort_order,
                        'title' => $module->title,
                        'thumbnail' => $module->thumbnail,
                        'video' => $module->video,
                        'description' => $module->description,
                        'duration' => $module->duration,
                        'attachment' => $module->attachment,
                    ];
                });
            }, []),
            'modules_count' => $this->whenCounted('modules'),
            'members_count' => $this->whenCounted('members'),
        ];
    }
}
