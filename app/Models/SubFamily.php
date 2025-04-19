<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubFamily extends Model
{
    use HasFactory;

    protected $table = 'cat_sous_family';

    protected $fillable = ['cat_id', 'intitule'];

    public function family()
    {
        return $this->belongsTo(Family::class, 'cat_id');
    }
}
