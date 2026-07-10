<?php

namespace App\Services;

use App\Models\AidDistribution;
use App\Models\AidProgram;
use App\Models\Profile;

class AidDistributionService
{
    /**
     * Duplicate check, scoped per beneficiary per
     * program. Same person can receive aid under two different
     * programs, but a second distribution under the SAME program
     * gets flagged.
     */
    public function isDuplicate(int $profileId, int $programId): bool
    {
        return AidDistribution::where('profile_id', $profileId)
            ->where('program_id', $programId)
            ->exists();
    }

    /**
     * Over-allocation check. Compares the new
     * distribution's quantity against the program's remaining
     * allocation (allocated_quantity minus everything already
     * distributed under it).
     */
    public function exceedsAllocation(AidProgram $program, float $quantity): bool
    {
        return $quantity > $program->remaining_quantity;
    }

    /**
     * Runs both checks and returns a structured result the
     * Controller can use to decide whether to save immediately
     * or send warnings back to the frontend first.
     */
    public function checkForWarnings(int $profileId, AidProgram $program, float $quantity): array
    {
        return [
            'is_duplicate' => $this->isDuplicate($profileId, $program->id),
            'exceeds_allocation' => $this->exceedsAllocation($program, $quantity),
        ];
    }
}