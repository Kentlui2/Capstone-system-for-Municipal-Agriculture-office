<?php
use App\Http\Controllers\CommodityController;
use App\Http\Controllers\BeneficiaryProfileController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AidDistributionController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\Api\SyncController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\OfflineDataController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\AidProgramController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('user-accounts', UserAccountController::class)
        ->parameters(['user-accounts' => 'user'])
        ->except(['create', 'store', 'edit']); // no manual creation — self-registration only

    Route::resource('profiles', BeneficiaryProfileController::class);
    
    Route::resource('commodities', CommodityController::class)
        ->except(['show']); 
    
    Route::resource('aid-programs', AidProgramController::class);
    
    Route::resource('aid-distributions', AidDistributionController::class)
        ->only(['index', 'create', 'store', 'show']); // permanent records — no edit/update/destroy

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/profile/{profile}', [ReportController::class, 'profileSheet'])->name('reports.profile-sheet');
    Route::get('/reports/bulk/pdf', [ReportController::class, 'bulkPdf'])->name('reports.bulk-pdf');
    Route::get('/reports/bulk/excel', [ReportController::class, 'bulkExcel'])->name('reports.bulk-excel');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth')->name('dashboard');

    Route::get('/api/offline/reference-data', [OfflineDataController::class, 'referenceData']);
    Route::get('/api/offline/ping', fn() => response()->noContent());

    Route::post('/api/offline/sync/profile', [SyncController::class, 'syncProfile']);
    Route::post('/api/offline/sync/distribution', [SyncController::class, 'syncDistribution']);
    Route::post('/api/offline/sync/distribution/force', [SyncController::class, 'forceSyncDistribution']);
    Route::get('/offline-queue', fn () => Inertia::render('OfflineQueue/Index'))->name('offline-queue.index');

    Route::post('/api/push-subscriptions', function (Illuminate\Http\Request $request) {
    $request->user()->updatePushSubscription(
        $request->endpoint,
        $request->keys['p256dh'] ?? null,
        $request->keys['auth'] ?? null,
        $request->contentEncoding ?? null,
    );

    return response()->noContent();
    });
});

require __DIR__ . '/auth.php';