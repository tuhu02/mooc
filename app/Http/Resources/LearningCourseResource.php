<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Module;


class LearningCourseResource extends JsonResource
{
    public function __construct($resource, protected bool $isEnrolled)
    {
        parent::__construct($resource);
    }

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
                return $this->categories->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]);
            }, []),

            'modules_count' => $this->modules_count ?? 0,
            'members_count' => $this->members_count ?? 0,

            'modules' => $this->whenLoaded('modules', function () {
                return $this->modules->map(fn ($module) => new LearningModuleListResource(
                    $module,
                    $this->isEnrolled
                ));
            }, []),
        ];
    }
}