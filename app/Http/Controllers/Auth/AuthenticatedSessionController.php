<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\Profile;
use App\Models\AidDistribution;
use App\Models\AidProgram;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
public function create(): Response
{
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
        'stats' => [
            'profiles' => Profile::count(),
            'distributions' => AidDistribution::count(),
            'active_programs' => AidProgram::where('status', 'active')->count(),
        ],
    ]);
}

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Block login for anyone not yet approved by an Admin —
        // covers both pending and rejected accounts.
        if (! $user->isApproved()) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            $message = $user->status === 'pending'
                ? 'Your account is pending admin approval. Please wait for an admin to approve your account.'
                : 'Your account has been rejected. Please contact an admin for assistance.';

            return redirect()->route('login')
                ->withErrors(['email' => $message]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
