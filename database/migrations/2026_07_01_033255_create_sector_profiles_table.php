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
        Schema::create('sector_profiles', function (Blueprint $table) {
            $table->id();

            // Links back to the main profile record
            $table->foreignId('profile_id')->constrained('profiles')->cascadeOnDelete();

            /*  Flexible name-value pair design — avoids needing separate
             farmer/fisherfolk/raiser tables since sector-specific fields
            are still pending final confirmation from MAO */
            $table->string('field_name');
            $table->string('field_value');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sector_profiles');
    }
};
