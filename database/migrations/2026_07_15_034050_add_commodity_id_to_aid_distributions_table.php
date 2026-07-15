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
        // Nullable: not every aid type maps cleanly to a commodity
        // (e.g., Cash Incentive has no associated commodity)
        $table->foreignId('commodity_id')->nullable()->after('program_id')->constrained('commodities');
    });
}

public function down(): void
{
    Schema::table('aid_distributions', function (Blueprint $table) {
        $table->dropForeign(['commodity_id']);
        $table->dropColumn('commodity_id');
    });
}
};
