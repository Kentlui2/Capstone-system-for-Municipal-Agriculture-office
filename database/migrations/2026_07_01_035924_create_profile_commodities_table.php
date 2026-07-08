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
        Schema::create('profile_commodities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignId('commodity_id')->constrained('commodities')->cascadeOnDelete();

            $table->timestamps();

            // Prevents the same profile-commodity pair from being added twice
            $table->unique(['profile_id', 'commodity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_commodities');
    }
};
