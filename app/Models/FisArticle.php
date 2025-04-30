<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FisArticle extends Model
{


    protected $fillable = ['article_id', 'user_id', 'fis_id', 'price' , 'price_prev' , 'status'];


    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function family()
    {
        return $this->belongsTo(Family::class, 'family_id');
    }

    public function subFamily()
    {
        return $this->belongsTo(SubFamily::class, 'cat_sous_family_id');
    }


    public function unite()
    {
        return $this->belongsTo(Unite::class);
    }
}
