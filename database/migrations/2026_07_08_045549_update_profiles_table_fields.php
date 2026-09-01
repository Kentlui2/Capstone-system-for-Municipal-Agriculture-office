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
        Schema::table('profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('profiles', 'street_address')) {
                $table->string('street_address')->nullable()->after('barangay');
            }
            $toDrop = array_filter(['rsbsa_number', 'org_membership'], function ($col) {
                return Schema::hasColumn('profiles', $col);
            });
            if (!empty($toDrop)) {
                $table->dropColumn(array_values($toDrop));
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('street_address');
            $table->string('rsbsa_number')->nullable();
            $table->string('org_membership')->nullable();
        });
    }
};
