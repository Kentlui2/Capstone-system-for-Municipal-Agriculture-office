<?php

namespace App\Http\Controllers;

use App\Models\AidProgram;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $service = new AnalyticsService(
            programId: $request->integer('program_id') ?: null,
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date'),
        );

        return Inertia::render('Analytics/Index', [
            'metrics' => $service->getAllMetrics(),
            'programs' => AidProgram::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['program_id', 'start_date', 'end_date']),
        ]);
    }
}