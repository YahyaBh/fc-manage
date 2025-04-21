<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class InvalidateBrokenSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            Session::getId(); // Ensure session is loaded
            Session::all();   // Access something to trigger possible failure
        } catch (\Throwable $e) {
            Auth::logout();      // Logout user
            Session::flush();    // Clear session

            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return inertia()->location(route('login'));
            }

            return redirect()->route('login')->withErrors(['session' => 'Your session has expired. Please log in again.']);
        }

        return $next($request);
    }
}
