<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    Route::post('/article/add' , [DashboardController::class , 'addArticle'])->name('article.add');
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
