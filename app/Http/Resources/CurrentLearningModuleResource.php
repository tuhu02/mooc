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
            'attachment_name' => $this->attachment_name,
            'attachments' => $this->attachments->map(fn($att) => [
                'id' => $att->id,
                'file_path' => $att->file_path,
                'file_name' => $att->file_name,
                'file_type' => $att->file_type,
                'file_size' => $att->file_size,
            ])->values()->all(),
            'is_preview' => $this->is_preview,
            'assignments' => $this->assignments,
            'canSubmitAssignment' => $this->isEnrolled,
        ];
    }
}
