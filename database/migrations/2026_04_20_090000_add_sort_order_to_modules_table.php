<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->nullable()->after('course_id');
        });

        $courseId = null;
        $sortOrder = 0;

        DB::table('modules')
            ->select(['id', 'course_id'])
            ->orderBy('course_id')
            ->orderBy('id')
            ->each(function (object $module) use (&$courseId, &$sortOrder): void {
                if ($courseId !== $module->course_id) {
                    $courseId = $module->course_id;
                    $sortOrder = 1;
                } else {
                    $sortOrder++;
                }

                DB::table('modules')
                    ->where('id', $module->id)
                    ->update(['sort_order' => $sortOrder]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
