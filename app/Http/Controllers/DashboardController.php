<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $articles = $user->articles()->with('category')->get(); // eager load category
        $categories = Family::all();

        return Inertia::render('Dashboard', [
            'articles' => $articles,
            'categories' => $categories,
        ]);
    }
}
