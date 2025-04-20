<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    use HasFactory;

    protected $table = 'cat_family';

    protected $fillable = ['intitule'];

    public function subFamilies()
    {
        return $this->hasMany(SubFamily::class, 'cat_id');
    }
}
