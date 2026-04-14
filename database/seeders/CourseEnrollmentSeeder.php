<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Member;
use Illuminate\Database\Seeder;

class CourseEnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $courseIds = Course::query()->pluck('id');

        if ($courseIds->isEmpty()) {
            return;
        }

        Member::query()->get()->each(function (Member $member) use ($courseIds): void {
            $joinedCourseIds = $courseIds
                ->shuffle()
                ->take(min(3, $courseIds->count()))
                ->all();

            $syncPayload = [];

            foreach ($joinedCourseIds as $courseId) {
                $syncPayload[$courseId] = [
                    'enrolled_at' => now()->subDays(rand(1, 30)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $member->courses()->syncWithoutDetaching($syncPayload);
        });
    }
}
