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
        Schema::create('aid_programs', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description');
            $table->string('aid_type');

            // Panel feedback addition: tracks total quantity allocated
            // to this program so utilization/over-allocation can be computed
            $table->decimal('allocated_quantity', 10, 2)->nullable();
            $table->string('unit');
            $table->decimal('value',10,2)->nullable();

            $table->string('funding_source')->nullable();
            $table->date('start_date');
            $table->enum('status',['active','closed'])->default('active');

            // Audit trail: which Admin created this program
            $table->foreignId('created_by')->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aid_programs');
    }
};
