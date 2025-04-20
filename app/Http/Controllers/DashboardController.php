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

        $articles = $user->articles()->with(['family', 'subFamily'])->get();
        $categories = Family::with('subFamilies')->get();

        return Inertia::render('Dashboard', [
            'articles' => $articles,
            'categories' => $categories,
        ]);
    }


    public function addArticle(Request $request) {
        $user = Auth::user();
        $article = new Article();
        $article->designation = $request->designation;
        $article->cat_family_id = $request->family_id;
        $article->cat_sous_family_id = $request->sous_family_id;
        $article->qty = $request->qty;
        $article->status = $request->status;
        $article->user_id = $user->id;
        $article->unite = 0;
        $article->save();

        Inertia::render('Dashboard');
    }
}
