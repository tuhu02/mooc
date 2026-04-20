<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->renameColumn('name', 'title');

            $table->string('thumbnail')->nullable();
            $table->string('video')->nullable();
            $table->text('description')->nullable();
            $table->integer('duration')->nullable();
            $table->string('attachment')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->renameColumn('title', 'name');

            $table->dropColumn([
                'thumbnail',
                'video',
                'description',
                'duration',
                'attachment',
            ]);
        });
    }
};
