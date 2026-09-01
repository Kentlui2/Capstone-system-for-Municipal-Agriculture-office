<?php

namespace App\Jobs;

use App\Exports\ProfilesExport;
use App\Models\Profile;
use App\Models\User;
use App\Notifications\ReportReady;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class GenerateBulkReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public ?string $sector,
        public ?string $barangay,
        public string $format,
        public int $userId
    ) {}

    public function handle(): void
    {
        $user = User::find($this->userId);
        if (! $user) {
            return;
        }

        $timestamp = time();
        $filename = "reports/bulk-list-{$timestamp}.{$this->format}";

        if ($this->format === 'pdf') {
            $profiles = Profile::query()
                ->when($this->sector, fn ($q) => $q->where('sector', $this->sector))
                ->when($this->barangay, fn ($q) => $q->where('barangay', $this->barangay))
                ->orderBy('last_name')
                ->get();

            $pdf = Pdf::loadView('reports.bulk-list', [
                'profiles' => $profiles,
                'sector' => $this->sector,
                'barangay' => $this->barangay,
            ]);

            Storage::disk('public')->put($filename, $pdf->output());
        } else {
            Excel::store(
                new ProfilesExport($this->sector, $this->barangay),
                $filename,
                'public'
            );
        }

        $downloadUrl = Storage::disk('public')->url($filename);
        $user->notify(new ReportReady($downloadUrl, $this->format));
    }
}
