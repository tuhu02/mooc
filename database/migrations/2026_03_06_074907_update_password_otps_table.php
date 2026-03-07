<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('password_otps', 'otps');

        Schema::table('otps', function (Blueprint $table) {
            $table->string('type')->nullable()->after('otp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('otps', 'password_otps', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
