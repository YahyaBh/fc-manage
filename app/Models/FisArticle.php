<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FisArticle extends Model
{
    protected $fillable = ['id_article', 'user_id', 'status'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
