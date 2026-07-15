<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AidDistribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'program_id',
        'commodity_id',
        'aid_type',
        'description',
        'quantity',
        'unit',
        'distribution_date',
        'remarks',
        'encoded_by',
        'is_flagged',
        'exceeds_allocation',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'distribution_date' => 'date',
            'is_flagged' => 'boolean',
            'exceeds_allocation' => 'boolean',
        ];
    }

    /**
     * The beneficiary who received this aid.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * The program this distribution was recorded under.
     */
    public function program()
    {
        return $this->belongsTo(AidProgram::class, 'program_id');
    }

    /**
     * The Encoder/Admin who recorded this distribution.
     */
    public function encoder()
    {
        return $this->belongsTo(User::class, 'encoded_by');
    }

    /**
     * The commodity distributed (if any).
     */
    public function commodity()
    {
        return $this->belongsTo(Commodity::class);
    }
}