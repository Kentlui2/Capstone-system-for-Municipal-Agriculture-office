<?php

namespace App\Policies;

use App\Models\AidDistribution;
use App\Models\User;

class AidDistributionPolicy
{
    /**
     * Both roles can view distribution records.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    public function view(User $user, AidDistribution $aidDistribution): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Both roles can record new distributions.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * No update() or delete() method defined — distributions are
     * permanent once recorded, by design. This preserves an
     * append-only audit trail for public fund distribution.
     *
     * If a genuine data entry mistake happens, the correct process
     * is to record a new corrective entry with remarks explaining
     * the correction, not to alter or remove the original record.
     */
}