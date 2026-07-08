<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;

class ProfilePolicy
{
    /**
     * Both roles can view the profile list.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Both roles can view a single profile's details.
     */
    public function view(User $user, Profile $profile): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Both roles can create new profiles.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Both roles can edit existing profiles.
     */
    public function update(User $user, Profile $profile): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Only Admin can delete (soft-delete) profiles.
     */
    public function delete(User $user, Profile $profile): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only Admin can restore a soft-deleted profile.
     */
    public function restore(User $user, Profile $profile): bool
    {
        return $user->isAdmin();
    }
}