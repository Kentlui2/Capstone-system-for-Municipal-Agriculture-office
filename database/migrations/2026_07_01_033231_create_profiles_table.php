<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
          $table->id();

          //Basic Identity 
          $table->string('first_name');
          $table->string('last_name');
          $table->date('birthdate');
          $table->enum('sex', ['male', 'female']);

          //Location and Sector classification
          $table->string('barangay');
          $table->enum('sector',['farmer', 'fisherfolk', 'raiser']);

          // Optional contact and registry info
          $table->string('contact_number')->nullable();
          $table->string('rsbsa_number')->nullbale();
          $table->string('org_membership')->nullable();
          $table->string('photo_path')->nullable();

          // Status: soft-disable a profile without deleting (preserves aid history)
          $table->enum('status', ['active','inactive'])->default('active');

          // Audit trail: who encoded this profile
          $table->foreignId('created_by')->constrained('users');

          // Automatically track when created_by was set
          $table->softDeletes();
          $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
