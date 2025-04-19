<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{


    protected $fillable= ['sous_f' ,'designation','unite' ,'status'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
