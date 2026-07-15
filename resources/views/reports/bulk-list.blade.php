<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        h1 { font-size: 16px; margin-bottom: 4px; }
        .subtitle { color: #666; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Beneficiary List</h1>
    <p class="subtitle">
        Municipal Agriculture Office — Sta. Cruz, Davao del Sur
        @if($sector) &middot; Sector: {{ ucfirst($sector) }} @endif
        @if($barangay) &middot; Barangay: {{ $barangay }} @endif
    </p>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Sex</th>
                <th>Birthdate</th>
            </tr>
        </thead>
        <tbody>
            @foreach($profiles as $profile)
                <tr>
                    <td>{{ $profile->first_name }} {{ $profile->last_name }}</td>
                    <td>{{ $profile->barangay }}{{ $profile->street_address ? ', ' . $profile->street_address : '' }}</td>
                    <td>{{ ucfirst($profile->sex) }}</td>
                    <td>{{ $profile->birthdate }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 20px; font-size: 9px; color: #999;">
        Generated on {{ now()->format('F j, Y g:i A') }} — {{ $profiles->count() }} record(s)
    </p>
</body>
</html>