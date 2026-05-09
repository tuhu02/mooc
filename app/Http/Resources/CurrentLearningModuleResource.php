<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrentLearningModuleResource extends JsonResource
{
    public function __construct($resource, protected bool $isEnrolled)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sort_order' => $this->sort_order,
            'title' => $this->title,
            'thumbnail' => $this->thumbnail,
            'video' => $this->video,
            'description' => $this->description,
            'duration' => $this->duration,
            'attachment' => $this->attachment,
            'is_preview' => $this->is_preview,
            'assignments' => $this->assignments,
            'can_submit_assignment' => $this->isEnrolled,
        ];
    }
}
