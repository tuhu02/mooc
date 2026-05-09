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
            'course' => new LearningCourseResource($this->resource, $this->isEnrolled),

            'current_module' => new CurrentLearningModuleResource(
                $this->currentModule,
                $this->isEnrolled
            ),

            'navigation' => [
                'previous' => $this->previousModule
                    ? new ModuleNavigationResource($this->previousModule, $this->isEnrolled)
                    : null,

                'next' => $this->nextModule
                    ? new ModuleNavigationResource($this->nextModule, $this->isEnrolled)
                    : null,
            ],
        ];
    }
}