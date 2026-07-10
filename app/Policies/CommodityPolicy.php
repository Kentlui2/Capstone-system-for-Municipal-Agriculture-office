<?php

namespace App\Policies;

use App\Models\Commodity;
use App\Models\User;

class CommodityPolicy
{
    /**
     * Both roles can view the commodity list (Encoders need this
     * to select commodities when creating profiles).
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    public function view(User $user, Commodity $commodity): bool
    {
        return $user->isAdmin() || $user->isEncoder();
    }

    /**
     * Only Admin can create, edit, or delete commodities.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Commodity $commodity): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Commodity $commodity): bool
    {
        return $user->isAdmin();
    }
}