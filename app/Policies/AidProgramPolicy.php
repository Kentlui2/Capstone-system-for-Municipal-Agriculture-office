<?php

namespace App\Policies;

use App\Models\AidProgram;
use App\Models\User;

class AidProgramPolicy
{
    /**
     * Both roles can view programs — Encoders need this to select
     * a program when recording aid distributions.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    public function view(User $user, AidProgram $aidProgram): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Only Admin can create, edit, or close programs.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, AidProgram $aidProgram): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, AidProgram $aidProgram): bool
    {
        return $user->isAdmin();
    }
}