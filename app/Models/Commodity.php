<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commodity extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category', 'status'];

    /**
     * Profiles tracked against this commodity, with tracking details via pivot.
     */
    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_commodities')
            ->withPivot(['variety', 'area_hectares', 'no_of_hills_trees', 'no_of_heads', 'no_of_stocks', 'production_type'])
            ->withTimestamps();
    }
}