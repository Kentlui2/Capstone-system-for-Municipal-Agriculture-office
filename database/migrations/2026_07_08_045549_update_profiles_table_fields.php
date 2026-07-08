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
            
            $table->string('street_address')->nullable()->after('barangay');
            $table->dropColumn(['rsbsa_number', 'org_membership']);
            
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
