<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Route::middleware(['auth', 'client'])->get('/client-dashboard', function () {
//     return Inertia::render('ClientDashboard');
// });

// Route::middleware(['auth', 'admin'])->get('/admin-dashboard', function () {
//     return Inertia::render('AdminDashboard');
// });

// Route::middleware(['auth', 'provider'])->get('/provider-dashboard', function () {
//     return Inertia::render('ProviderDashboard');
// });




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
