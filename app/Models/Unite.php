<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unite extends Model
{




    protected $fillable = [
        'intitule',
        'code',
    ];



    public function articles()
    {
        return $this->hasMany(Article::class, 'article_id');
    }
}
