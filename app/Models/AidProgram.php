<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'aid_type',
        'allocated_quantity',
        'unit',
        'funding_source',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'allocated_quantity' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * The Admin who created this program.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * All distributions recorded under this program.
     */
    public function distributions()
    {
        return $this->hasMany(AidDistribution::class, 'program_id');
    }

    /**
     * Remaining quantity, computed live — never stored
     * Usage: $program->remaining_quantity
     */
    public function getRemainingQuantityAttribute(): float
    {
        return $this->allocated_quantity - $this->distributions()->sum('quantity');
    }

    /**
     * Utilization rate as a percentage — used directly by the Analytics module.
     * Usage: $program->utilization_rate
     */
    public function getUtilizationRateAttribute(): float
    {
        if ($this->allocated_quantity <= 0) {
            return 0;
        }

        return round(($this->distributions()->sum('quantity') / $this->allocated_quantity) * 100, 2);
    }
}