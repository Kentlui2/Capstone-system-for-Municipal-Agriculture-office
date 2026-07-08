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
        Schema::table('sector_profiles', function (Blueprint $table) {
            $table->foreignId('profile_id')->after('id')->constrained('profiles')->cascadeOnDelete();
            $table->string('field_name')->after('profile_id');
            $table->string('field_value')->after('field_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sector_profiles', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropColumn(['profile_id', 'field_name', 'field_value']);
        });
    }
};
