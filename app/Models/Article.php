<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{


    protected $fillable = ['sous_f', 'designation', 'unite', 'user_id', 'status', 'family_id'];

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
}
