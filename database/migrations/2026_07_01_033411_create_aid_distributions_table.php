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
        Schema::create('aid_distributions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')->constrained('profiles');
            $table->foreignId('program_id')->constrained('aid_programs');

            $table->string('aid_type');
            $table->text('description')->nullable();
            $table->decimal('quantity', 10, 2);
            $table->string('unit');
            $table->date('distribution_date');
            $table->text('remarks')->nullable();

            // Audit trail: which Encoder/Admin recorded this distribution
            $table->foreignId('encoded_by')->constrained('users');

            // Duplicate check: same beneficiary receiving aid twice under
            // the SAME program gets flagged (business rule 3) — scoped per
            // program, not global, so multi-program aid is allowed
            $table->boolean('is_flagged')->default(false);

            // Panel feedback addition: flags when this distribution pushed
            // total distributed quantity past the program's allocated_quantity
            $table->boolean('exceeds_allocation')->default(false);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aid_distributions');
    }
};
