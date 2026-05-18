<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Module;
use Carbon\Carbon;

class ModuleNavigationResource extends JsonResource
{
    public function __construct($resource, protected bool $isEnrolled)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        // Check if module is locked due to availability schedule (for event courses)
        $isNotYetAvailable = $this->available_at && Carbon::now()->isBefore($this->available_at);
        $isLockedByAvailability = $isNotYetAvailable;

        return [
            'id' => $this->id,
            'sort_order' => $this->sort_order,
            'title' => $this->title,
            'is_preview' => $this->is_preview,
            'is_locked' => !$this->is_preview && (!$this->isEnrolled || $isLockedByAvailability),
        ];
    }
}
