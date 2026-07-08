<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'field_name',
        'field_value'
    ];

    /**
     * The profile this sector-specific field belongs to.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

}
