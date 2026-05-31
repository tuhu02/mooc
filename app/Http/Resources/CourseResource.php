<?php

namespace App\Http\Resources;

use App\Models\ModuleProgress;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    private $memberId;

    public function __construct($resource, $memberId = null)
    {
        parent::__construct($resource);
        $this->memberId = $memberId;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Calculate progress if memberId is provided
        $progress = null;
        if ($this->memberId) {
            $totalModules = $this->resource->modules_count ?? $this->modules()->count();
            $completedModules = ModuleProgress::where('course_id', $this->resource->id)
                ->where('member_id', $this->memberId)
                ->count();

            if ($totalModules > 0) {
                $progress = [
                    'completed' => $completedModules,
                    'total' => $totalModules,
                    'percentage' => (int) (($completedModules / $totalModules) * 100),
                ];
            } else {
                $progress = [
                    'completed' => 0,
                    'total' => 0,
                    'percentage' => 0,
                ];
            }
        }

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
                        'is_preview' => $module->is_preview,
                        'thumbnail' => $module->thumbnail,
                        'video' => $module->video,
                        'description' => $module->description,
                        'duration' => $module->duration,
                        'attachment' => $module->attachment,
                        'available_at' => $module->available_at,
                        'assignments' => $module->assignments ?? [],
                    ];
                });
            }, []),
            'modules_count' => $this->resource->modules_count !== null
                ? (int) $this->resource->modules_count
                : ($this->relationLoaded('modules') ? $this->modules->count() : 0),
            'members_count' => (int) ($this->resource->members_count ?? 0),
            'progress' => $progress,
        ];
    }
}
