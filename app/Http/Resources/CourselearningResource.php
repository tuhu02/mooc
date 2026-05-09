<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Course;
use App\Models\Module;

class CourseLearningResource extends JsonResource
{
    public function __construct(
        Course $resource,
        protected Module $currentModule,
        protected ?Module $previousModule,
        protected ?Module $nextModule,
        protected bool $isEnrolled,
    ) {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'course' => [
                'id' => $this->id,
                'title' => $this->title,
                'slug' => $this->slug,
                'thumbnail' => $this->thumbnail,
                'description' => $this->description,
                'level' => $this->level,
                'is_active' => $this->is_active,
                'is_highlight' => $this->is_highlight,

                'categories' => $this->whenLoaded('categories', function () {
                    return $this->categories->map(fn($category) => [
                        'id' => $category->id,
                        'name' => $category->name,
                    ]);
                }, []),

                'modules_count' => $this->modules_count,
                'members_count' => $this->members_count,

                'modules' => $this->whenLoaded('modules', function () {
                    return $this->modules->map(fn($module) => [
                        'id' => $module->id,
                        'sort_order' => $module->sort_order,
                        'title' => $module->title,
                        'thumbnail' => $module->thumbnail,
                        'is_preview' => $module->is_preview,
                        'is_locked' => !$module->is_preview && !$this->isEnrolled,
                        'duration' => $module->duration,
                    ]);
                }, []),
            ],

            'current_module' => [
                'id' => $this->currentModule->id,
                'sort_order' => $this->currentModule->sort_order,
                'title' => $this->currentModule->title,
                'thumbnail' => $this->currentModule->thumbnail,
                'video' => $this->currentModule->video,
                'description' => $this->currentModule->description,
                'duration' => $this->currentModule->duration,
                'attachment' => $this->currentModule->attachment,
                'is_preview' => $this->currentModule->is_preview,
                'assignments' => $this->currentModule->assignments,
                'can_submit_assignment' => $this->isEnrolled,
            ],

            'navigation' => [
                'previous' => $this->formatNavigationModule($this->previousModule),
                'next' => $this->formatNavigationModule($this->nextModule),
            ],
        ];
    }

    private function formatNavigationModule(?Module $module): ?array
    {
        if (!$module) {
            return null;
        }

        return [
            'sort_order' => $module->sort_order,
            'title' => $module->title,
            'is_preview' => $module->is_preview,
            'is_locked' => !$module->is_preview && !$this->isEnrolled,
        ];
    }
}
