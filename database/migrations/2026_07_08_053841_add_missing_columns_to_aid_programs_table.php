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

            $table->string('name')->after('id');
            $table->text('description')->nullable()->after('name');
            $table->string('aid_type')->after('description');
            $table->decimal('allocated_quantity', 10, 2)->after('aid_type');
            $table->string('unit')->after('allocated_quantity');
            $table->string('funding_source')->nullable()->after('unit');
            $table->date('start_date')->nullable()->after('funding_source');
            $table->date('end_date')->nullable()->after('start_date');
            $table->enum('status', ['active', 'closed'])->default('active')->after('end_date');
            $table->foreignId('created_by')->after('status')->constrained('users');

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
