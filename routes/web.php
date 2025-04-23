<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Request;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('home');


    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/referentiel/articles', [DashboardController::class, 'article'])->name('articles');
    Route::post('/article/add', [DashboardController::class, 'addArticle'])->name('article.add');
    Route::get('/article/{id}', [DashboardController::class, 'showArticle'])->name('article.show');
    Route::put('/article/{article}/edit', [DashboardController::class, 'editArticle'])->name('article.edit');
    Route::delete('/article/delete', [DashboardController::class, 'deleteArticle'])->name('article.delete');


    Route::get('/referentiel/famille', [DashboardController::class, 'categories'])->name('famille');
    Route::post('/famille/add', [DashboardController::class, 'addCategory'])->name('famille.add');
    Route::get('/famille/{id}', [DashboardController::class, 'showCategory'])->name('famille.show');
    Route::put('/famille/{famille}/edit', [DashboardController::class, 'editCategory'])->name('famille.edit');
    Route::delete('/famille/delete', [DashboardController::class, 'deleteCategory'])->name('famille.delete');

    Route::get('/referentiel/sous-famille', [DashboardController::class, 'sousCategories'])->name('sous-famille');
    Route::post('/sous-famille/add', [DashboardController::class, 'addSousCategory'])->name('sous-famille.add');
    Route::get('/sous-famille/{id}', [DashboardController::class, 'showSousCategory'])->name('sous-famille.show');
    Route::post('/sous-famille/{sous-famille}/edit', [DashboardController::class, 'editSousCategory'])->name('sous-famille.edit');
    Route::delete('/sous-famille/{sous-famille}/delete', [DashboardController::class, 'deleteSousCategory'])->name('sous-famille.delete');

    Route::get('/referentiel/unite', [DashboardController::class, 'unite'])->name('unite');
    Route::post('/unite/add', [DashboardController::class, 'addUnite'])->name('unite.add');
    Route::get('/unite/{unite}', [DashboardController::class, 'showUnite'])->name('unite.show');
    Route::post('/unite/{unite}/edit', [DashboardController::class, 'editUnite'])->name('unite.edit');
    Route::delete('/unite/{unite}/delete', [DashboardController::class, 'deleteUnite'])->name('unite.delete');



    
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
