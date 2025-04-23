<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ClientMiddleware
{
    public function handle($request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role === 'client') {
            return $next($request);
        }

        Auth::logout();

        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return inertia()->location(route('login'));
        }

        return redirect()->route('login')->withErrors(['error' => 'Please log in again.']);
    }
}
