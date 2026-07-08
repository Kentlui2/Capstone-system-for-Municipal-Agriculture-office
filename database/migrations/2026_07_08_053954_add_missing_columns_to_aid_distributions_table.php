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
        Schema::table('aid_distributions', function (Blueprint $table) {

            $table->foreignId('profile_id')->after('id')->constrained('profiles');
            $table->foreignId('program_id')->after('profile_id')->constrained('aid_programs');
            $table->string('aid_type')->after('program_id');
            $table->string('description')->nullable()->after('aid_type');
            $table->decimal('quantity', 10, 2)->after('description');
            $table->string('unit')->after('quantity');
            $table->date('distribution_date')->after('unit');
            $table->text('remarks')->nullable()->after('distribution_date');
            $table->foreignId('encoded_by')->after('remarks')->constrained('users');
            $table->boolean('is_flagged')->default(false)->after('encoded_by');
            $table->boolean('exceeds_allocation')->default(false)->after('is_flagged');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aid_distributions', function (Blueprint $table) {

            $table->dropForeign(['profile_id']);
            $table->dropForeign(['program_id']);
            $table->dropForeign(['encoded_by']);
            $table->dropColumn(['profile_id', 'program_id', 'aid_type', 'description', 
            'quantity', 'unit', 'distribution_date', 'remarks', 'encoded_by', 'is_flagged', 'exceeds_allocation']);
        
        });
    }
};
