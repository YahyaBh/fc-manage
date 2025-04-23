<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Family;
use App\Models\SubFamily;
use App\Models\Unite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
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

    public function article()
    {
        $user = Auth::user();

        $articles = $user->articles()->with(['family', 'subFamily'])->get();
        $categories = Family::with('subFamilies')->get();
        $unites = Unite::all();

        return Inertia::render('referentiel/articles', [
            'articles' => $articles,
            'categories' => $categories,
            'unites' => $unites
        ]);
    }

    public function showArticle(Request $request)
    {
        $article = Article::find($request->id);

        if ($request->ajax()) {
            return response()->json([
                'article' => $article,
            ]);
        } else {
            return back()->with(['message' => 'Article not found.']);
        }
    }

    public function addArticle(Request $request)
    {
        $user = Auth::user();
        $article = new Article();
        $article->designation = $request->designation;
        $article->cat_family_id = $request->family_id;
        $article->cat_sous_family_id = $request->sous_family_id;
        $article->unite_id = $request->unite;
        $article->status = $request->status;
        $article->user_id = $user->id;
        $article->save();

        Inertia::render('Dashboard');
    }

    public function editArticle(Request $request, $id)
    {

        try {
            $article = Article::find($id);

            if ($request->designation && $article->designation != $request->designation) {
                $article->designation = $request->designation;
            }

            if ($request->family_id && $article->cat_family_id != $request->family_id) {
                $article->cat_family_id = $request->family_id;
            }

            if ($request->sous_family_id && $article->cat_sous_family_id != $request->sous_family_id) {
                $article->cat_sous_family_id = $request->sous_family_id;
            }

            if ($request->unite && $article->unite_id != $request->unite) {
                $article->unite_id = $request->unite;
            }

            if ($request->has('status') && $article->status !== $request->status) {
                $article->status = $request->status;
            }


            $article->save();


            return back()->with(['message' => 'Article updated successfully.']);
        } catch (\Exception $e) {
            return back()->with(['message' => $e]);
        }
    }


    public function deleteArticle(Request $request)
    {
        if (is_array($request->ids)) {
            foreach ($request->ids as $id) {
                Article::destroy($id);
            }
        } else if ($request->ids) {
            Article::destroy($request->ids);
        } else {
            return back()->with(['message' => 'No article selected.']);
        }

        return back()->with(['message' => 'Article(s) deleted successfully.']);
    }


    public function categories(Request $request)
    {
        $categories = Family::with('subFamilies')->get();

        return Inertia::render('referentiel/category', [
            'categories' => $categories,
        ]);
    }

    public function addCategory(Request $request)
    {
        if (Family::where('intitule', $request->intitule)->exists()) {
            return Redirect::back()->with('error', 'Category already exists.');
        }

        $category = new Family();
        $category->intitule = $request->intitule;
        $category->save();

        return Redirect::back()->with('message', 'Category added successfully.');
    }

    public function showCategory(Request $request)
    {
        $category = Family::find($request->id);

        if ($request->ajax()) {
            return response()->json([
                'category' => $category,
            ]);
        } else {
            return back()->with(['message' => 'Category not found.']);
        }
    }

    public function editCategory(Request $request, $id)
    {
        $category = Family::find($id);

        if ($request->intitule && $category->intitule != $request->intitule) {
            $category->intitule = $request->intitule;
        }

        if ($request->has('status') && $category->status !== $request->status) {
            $category->status = $request->status;
        }

        $category->save();

        return back()->with(['message' => 'Category updated successfully.']);
    }

    public function deleteCategory(Request $request)
    {
        if (is_array($request->ids)) {
            foreach ($request->ids as $id) {
                Family::destroy($id);
            }
        } else if ($request->ids) {
            Family::destroy($request->ids);
        } else {
            return back()->with(['message' => 'No category selected.']);
        }

        return back()->with(['message' => 'Category(s) deleted successfully.']);
    }



    public function sousCategories(Request $request)
    {
        $sousCategories = SubFamily::with('Family')->get();
        $categories = Family::all();

        return Inertia::render('referentiel/subcategory', [
            'sub_categories' => $sousCategories,
            'categories' => $categories
        ]);
    }

    public function addSousCategory(Request $request) {}

    public function showSousCategory(Request $request)
    {
        $sousCategory = SubFamily::find($request->id);

        if ($request->ajax()) {
            return response()->json([
                'sousCategory' => $sousCategory,
            ]);
        } else {
            return back()->with(['message' => 'Sous category not found.']);
        }
    }




    public function unite(Request $request)
    {
        $unites = Unite::all();

        return Inertia::render('referentiel/unite', [
            'unites' => $unites
        ]);
    }
}
