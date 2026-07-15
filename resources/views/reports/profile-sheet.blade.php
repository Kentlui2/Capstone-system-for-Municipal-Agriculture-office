<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .subtitle { color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        td, th { padding: 6px 8px; border: 1px solid #ddd; text-align: left; }
        th { background: #f5f5f5; width: 30%; }
        .section-title { font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; }
    </style>
</head>
<body>
    <h1>Beneficiary Profile Sheet</h1>
    <p class="subtitle">Municipal Agriculture Office — Sta. Cruz, Davao del Sur</p>

    <table>
        <tr><th>Full Name</th><td>{{ $profile->first_name }} {{ $profile->last_name }}</td></tr>
        <tr><th>Sector</th><td>{{ ucfirst($profile->sector) }}</td></tr>
        <tr><th>Birthdate</th><td>{{ $profile->birthdate }}</td></tr>
        <tr><th>Sex</th><td>{{ ucfirst($profile->sex) }}</td></tr>
        <tr><th>Barangay</th><td>{{ $profile->barangay }}</td></tr>
        <tr><th>Street Address</th><td>{{ $profile->street_address ?? '—' }}</td></tr>
        <tr><th>Contact Number</th><td>{{ $profile->contact_number ?? '—' }}</td></tr>
    </table>

    @if($profile->sectorProfiles->isNotEmpty())
        <p class="section-title">Sector Details</p>
        <table>
            @foreach($profile->sectorProfiles as $field)
                <tr>
                    <th>{{ ucwords(str_replace('_', ' ', $field->field_name)) }}</th>
                    <td>{{ $field->field_value }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    @if($profile->commodities->isNotEmpty())
        <p class="section-title">Commodities</p>
        <table>
            <tr><th>Commodity</th><th>Details</th></tr>
            @foreach($profile->commodities as $commodity)
                <tr>
                    <td>{{ $commodity->name }}</td>
                    <td>
                        @php
                            $details = collect([
                                $commodity->pivot->variety ? "Variety: {$commodity->pivot->variety}" : null,
                                $commodity->pivot->area_hectares ? "{$commodity->pivot->area_hectares} ha" : null,
                                $commodity->pivot->no_of_hills_trees ? "{$commodity->pivot->no_of_hills_trees} hills/trees" : null,
                                $commodity->pivot->no_of_heads ? "{$commodity->pivot->no_of_heads} heads" : null,
                                $commodity->pivot->no_of_stocks ? "{$commodity->pivot->no_of_stocks} stocks" : null,
                                $commodity->pivot->production_type ? str_replace('_', ' ', $commodity->pivot->production_type) : null,
                            ])->filter()->implode(' • ');
                        @endphp
                        {{ $details }}
                    </td>
                </tr>
            @endforeach
        </table>
    @endif

    @if($profile->aidDistributions->isNotEmpty())
        <p class="section-title">Aid Distribution History</p>
        <table>
            <tr><th>Program</th><th>Quantity</th><th>Date</th></tr>
            @foreach($profile->aidDistributions as $distribution)
                <tr>
                    <td>{{ $distribution->program->name }}</td>
                    <td>{{ $distribution->quantity }} {{ $distribution->unit }}</td>
                    <td>{{ $distribution->distribution_date }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    <p style="margin-top: 30px; font-size: 10px; color: #999;">
        Generated on {{ now()->format('F j, Y g:i A') }}
    </p>
</body>
</html>