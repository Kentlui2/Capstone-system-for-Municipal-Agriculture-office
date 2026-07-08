<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Only Admins can view the user account management list.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only Admins can view a specific user's account details.
     */
    public function view(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only Admins can approve, reject, or edit accounts
     * (covers role changes, status changes, etc.)
     */
    public function update(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only Admins can delete accounts.
     * An Admin should not be able to delete their own account
     * (prevents accidental lockout with zero admins left).
     */
    public function delete(User $user, User $model): bool
    {
        return $user->isAdmin() && $user->id !== $model->id;
    }
}