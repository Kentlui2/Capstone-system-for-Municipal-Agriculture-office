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
        Schema::DropIfExists('profile_commodities');
        
        Schema::create('profile_commodities', function(Blueprint $table){
            $table->id();
            
            $table->foreignId('profile_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignId('commodity_id')->constrained('commodities')->cascadeOnDelete();

            //Farmer specific profile
            $table->string('variety')->nullable();
            $table->decimal('area_hectares', 10, 2)->nullable();
            $table->integer('no_of_hills_trees')->nullable();

            //Raiser specific profile
            $table->integer('no_of_heads')->nullable();
            
            //fisherfolk specific profile
            $table->integer('no_of_stocks')->nullable();
            $table->enum('production_type', ['fish_catch', 'fish_cage', 'fish_pond'])->nullable();

            $table->timestamps();

            $table->unique(['profile_id', 'commodity_id', 'production_type']);
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
