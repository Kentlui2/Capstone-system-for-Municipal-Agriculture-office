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
        Schema::table('aid_programs', function (Blueprint $table) {
            if (!Schema::hasColumn('aid_programs', 'name')) {
                $table->string('name')->after('id');
            }
            if (!Schema::hasColumn('aid_programs', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn('aid_programs', 'aid_type')) {
                $table->string('aid_type')->after('description');
            }
            if (!Schema::hasColumn('aid_programs', 'allocated_quantity')) {
                $table->decimal('allocated_quantity', 10, 2)->after('aid_type');
            }
            if (!Schema::hasColumn('aid_programs', 'unit')) {
                $table->string('unit')->after('allocated_quantity');
            }
            if (!Schema::hasColumn('aid_programs', 'funding_source')) {
                $table->string('funding_source')->nullable()->after('unit');
            }
            if (!Schema::hasColumn('aid_programs', 'start_date')) {
                $table->date('start_date')->nullable()->after('funding_source');
            }
            if (!Schema::hasColumn('aid_programs', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
            if (!Schema::hasColumn('aid_programs', 'status')) {
                $table->enum('status', ['active', 'closed'])->default('active')->after('end_date');
            }
            if (!Schema::hasColumn('aid_programs', 'created_by')) {
                $table->foreignId('created_by')->after('status')->constrained('users');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aid_programs', function (Blueprint $table) {

            $table->dropForeign(['created_by']);
            $table->dropColumn(['name', 'description', 'aid_type', 'allocated_quantity', 'unit', 'funding_source', 'start_date', 'end_date', 'status', 'created_by']);
        
        });
    }
};
