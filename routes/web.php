<?php
use App\Http\Controllers\CommodityController;
use App\Http\Controllers\BeneficiaryProfileController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AidDistributionController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\OfflineDataController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\AidProgramController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
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
        ->except(['create', 'show', 'edit']); // inline add/edit on the index page, no separate pages
    
    Route::resource('aid-programs', AidProgramController::class)
        ->except(['create', 'show', 'edit']);
    
    Route::resource('aid-distributions', AidDistributionController::class)
        ->only(['index', 'create', 'store', 'show']); // permanent records — no edit/update/destroy

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/profile/{profile}', [ReportController::class, 'profileSheet'])->name('reports.profile-sheet');
    Route::get('/reports/bulk/pdf', [ReportController::class, 'bulkPdf'])->name('reports.bulk-pdf');
    Route::get('/reports/bulk/excel', [ReportController::class, 'bulkExcel'])->name('reports.bulk-excel');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth')->name('dashboard');

    Route::get('/api/offline/reference-data', [OfflineDataController::class, 'referenceData']);
    Route::get('/api/offline/ping', fn () => response()->noContent());
});

require __DIR__.'/auth.php';