<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserAccountController extends Controller
{
    /**
     * List all user accounts — Admin only, enforced via UserPolicy.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $sort = request('sort');
        $direction = request('direction', 'asc');

        $allowedSorts = ['name', 'email', 'role'];

        $query = User::query()
            ->when(request('role'), fn ($q, $role) => $q->where('role', $role))
            ->when(request('status'), fn ($q, $status) => $q->where('status', $status));

        if ($sort && in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction);
        } else {
        $query->orderByRaw("
            CASE status
                WHEN 'pending' THEN 1
                WHEN 'approved' THEN 2
                WHEN 'rejected' THEN 3
            END
        ")->orderBy('name');
        }

        $users = $query->get(['id', 'name', 'email', 'role', 'status', 'created_at']);

        return Inertia::render('UserAccounts/Index', [
            'users' => $users,
            'filters' => request()->only(['role', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show a single user account's details — Admin only.
     */
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        return Inertia::render('UserAccounts/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Update a user's role and/or approval status.
     * Validation + authorization both handled in UpdateUserRequest.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $user->update($validated);

        $messages = [
            'approved' => "{$user->name}'s account has been approved.",
            'rejected' => "{$user->name}'s account has been rejected.",
            'pending' => "{$user->name}'s account status set back to pending.",
        ];

        $flashType = $validated['status'] === 'rejected' ? 'error' : 'success';

        return redirect()
            ->route('user-accounts.index')
            ->with($flashType, $messages[$validated['status']]);
    }
    /**
     * Delete a user account — Admin only, cannot delete self
     * (enforced in UserPolicy).
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return redirect()
            ->route('user-accounts.index')
            ->with('success', "{$user->name}'s account has been removed.");
    }
}