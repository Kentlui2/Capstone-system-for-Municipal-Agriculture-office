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
        Schema::table('commodities', function (Blueprint $table) {
            if (!Schema::hasColumn('commodities', 'name')) {
                $table->string('name')->after('id');
            }
            if (!Schema::hasColumn('commodities', 'category')) {
                $table->string('category')->after('name');
            }
            if (!Schema::hasColumn('commodities', 'status')) {
                $table->enum('status', ['active', 'inactive'])->default('active')->after('category');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commodities', function (Blueprint $table) {
            $table->dropColumn(['name', 'category', 'status']);
        });
    }
};
