<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add indexes to columns used in WHERE, JOIN, and ORDER BY clauses
     * across the application — critical for performance at scale.
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->index('barangay');
            $table->index('sector');
            $table->index('status');
            $table->index('last_name'); // used in default sort
        });

        Schema::table('aid_distributions', function (Blueprint $table) {
            $table->index('distribution_date');
            $table->index('program_id');
            $table->index('is_flagged');
            $table->index('exceeds_allocation');
            $table->index(['profile_id', 'program_id']); // matches the duplicate-check query in AidDistributionService exactly
        });

        Schema::table('aid_programs', function (Blueprint $table) {
            $table->index('status');
            $table->index('aid_type');
        });

        Schema::table('commodities', function (Blueprint $table) {
            $table->index('category');
            $table->index('status');
        });

        Schema::table('profile_commodities', function (Blueprint $table) {
            $table->index('commodity_id');
        });

        Schema::table('sector_profiles', function (Blueprint $table) {
            $table->index('profile_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropIndex(['barangay']);
            $table->dropIndex(['sector']);
            $table->dropIndex(['status']);
            $table->dropIndex(['last_name']);
        });

        Schema::table('aid_distributions', function (Blueprint $table) {
            $table->dropIndex(['distribution_date']);
            $table->dropIndex(['program_id']);
            $table->dropIndex(['is_flagged']);
            $table->dropIndex(['exceeds_allocation']);
            $table->dropIndex(['profile_id', 'program_id']);
        });

        Schema::table('aid_programs', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['aid_type']);
        });

        Schema::table('commodities', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropIndex(['status']);
        });

        Schema::table('profile_commodities', function (Blueprint $table) {
            $table->dropIndex(['commodity_id']);
        });

        Schema::table('sector_profiles', function (Blueprint $table) {
            $table->dropIndex(['profile_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['status']);
        });
    }
};
