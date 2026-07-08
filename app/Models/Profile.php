<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'birthdate', 
        'sex',
        'barangay',
        'street_address',
        'contact_number',
        'sector',
        'photo_path',
        'status',
        'created_by'
    ];

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
        ];
    }

     /**
     * The user who encoded this profile.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Sector-specific fields (RSBSA, FISHR, farm_location, etc.)
     */
    public function sectorProfiles()
    {
        return $this->hasMany(SectorProfile::class);
    }

    /**
     * Commodities this profile is tracked against, with tracking details
     * (variety, area, head count, etc. via the pivot table)
     */
    public function commodities()
    {
        return $this->belongsToMany(Commodity::class, 'profile_commodities')
            ->withPivot(['variety', 'area_hectares', 'no_of_hills_trees', 'no_of_heads', 'no_of_stocks', 'production_type'])
            ->withTimestamps();
    }

    /**
     * All aid distributions this profile has received.
     */
    public function aidDistributions()
    {
        return $this->hasMany(AidDistribution::class);
    }
    
}
