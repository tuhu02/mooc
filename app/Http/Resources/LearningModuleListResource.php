<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Module;
use Carbon\Carbon;

class LearningModuleListResource extends JsonResource
{
    public function __construct($resource, protected bool $isEnrolled)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        $isNotYetAvailable = $this->available_at && Carbon::now()->isBefore($this->available_at);
        $isLockedByAvailability = $isNotYetAvailable;

        return [
            'id' => $this->id,
            'sort_order' => $this->sort_order,
            'title' => $this->title,
            'thumbnail' => $this->thumbnail,
            'is_preview' => $this->is_preview,
            'is_locked' => !$this->is_preview && (!$this->isEnrolled || $isLockedByAvailability),
            'duration' => $this->duration,
        ];
    }
}
