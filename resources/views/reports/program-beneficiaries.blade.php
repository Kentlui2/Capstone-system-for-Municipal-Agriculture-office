<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        h1 { font-size: 16px; margin-bottom: 2px; }
        h2 { font-size: 13px; font-weight: normal; color: #555; margin-bottom: 4px; }
        .subtitle { color: #777; margin-bottom: 16px; font-size: 10px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px; background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 4px; padding: 10px; }
        .meta-item label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
        .meta-item span { font-size: 11px; font-weight: 600; color: #222; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead th { background: #1d7a4f; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        tbody td { padding: 5px 8px; border-bottom: 1px solid #eee; }
        tbody tr:nth-child(even) td { background: #f8faf9; }
        .no-data { text-align: center; padding: 20px; color: #999; font-style: italic; }
        .footer { margin-top: 20px; font-size: 9px; color: #aaa; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
</head>
<body>
    <h1>Aid Program Beneficiary List</h1>
    <h2>{{ ->name }}</h2>
    <p class="subtitle">Municipal Agriculture Office — Sta. Cruz, Davao del Sur</p>

    <div class="meta-grid">
        <div class="meta-item">
            <label>Aid Type</label>
            <span>{{ ->aid_type }}</span>
        </div>
        <div class="meta-item">
            <label>Status</label>
            <span>{{ ucfirst(->status) }}</span>
        </div>
        <div class="meta-item">
            <label>Funding Source</label>
            <span>{{ ->funding_source ?: '—' }}</span>
        </div>
        <div class="meta-item">
            <label>Total Beneficiaries</label>
            <span>{{ ->count() }}</span>
        </div>
    </div>

    @if(->isEmpty())
        <p class="no-data">No beneficiaries have received aid under this program yet.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Sector</th>
                    <th>Barangay</th>
                    <th>Contact</th>
                </tr>
            </thead>
            <tbody>
                @foreach( as  => C:\Users\KEN LUI\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1)
                    <tr>
                        <td>{{  + 1 }}</td>
                        <td>{{ C:\Users\KEN LUI\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1->first_name }} {{ C:\Users\KEN LUI\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1->last_name }}</td>
                        <td style="text-transform: capitalize;">{{ C:\Users\KEN LUI\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1->sector }}</td>
                        <td>{{ C:\Users\KEN LUI\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1->barangay }}</td>
                        <td>{{ C:\Users\KEN LUI\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1->contact_number ?: '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <p class="footer">
        Generated on {{ now()->format('F j, Y g:i A') }} &middot; {{ ->count() }} beneficiar{{ ->count() === 1 ? 'y' : 'ies' }}
    </p>
</body>
</html>
