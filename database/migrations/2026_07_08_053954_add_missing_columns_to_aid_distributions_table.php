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
            if (!Schema::hasColumn('aid_distributions', 'profile_id')) {
                $table->foreignId('profile_id')->after('id')->constrained('profiles');
            }
            if (!Schema::hasColumn('aid_distributions', 'program_id')) {
                $table->foreignId('program_id')->after('profile_id')->constrained('aid_programs');
            }
            if (!Schema::hasColumn('aid_distributions', 'aid_type')) {
                $table->string('aid_type')->after('program_id');
            }
            if (!Schema::hasColumn('aid_distributions', 'description')) {
                $table->string('description')->nullable()->after('aid_type');
            }
            if (!Schema::hasColumn('aid_distributions', 'quantity')) {
                $table->decimal('quantity', 10, 2)->after('description');
            }
            if (!Schema::hasColumn('aid_distributions', 'unit')) {
                $table->string('unit')->after('quantity');
            }
            if (!Schema::hasColumn('aid_distributions', 'distribution_date')) {
                $table->date('distribution_date')->after('unit');
            }
            if (!Schema::hasColumn('aid_distributions', 'remarks')) {
                $table->text('remarks')->nullable()->after('distribution_date');
            }
            if (!Schema::hasColumn('aid_distributions', 'encoded_by')) {
                $table->foreignId('encoded_by')->after('remarks')->constrained('users');
            }
            if (!Schema::hasColumn('aid_distributions', 'is_flagged')) {
                $table->boolean('is_flagged')->default(false)->after('encoded_by');
            }
            if (!Schema::hasColumn('aid_distributions', 'exceeds_allocation')) {
                $table->boolean('exceeds_allocation')->default(false)->after('is_flagged');
            }
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
