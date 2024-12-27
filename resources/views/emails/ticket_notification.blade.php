<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <p>Dear Team,</p>
    <p>The following tickets are still open:</p>
    <table>
        <thead>
            <tr>
                <th>Ticket ID</th>
                <th>Date Created</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tickets as $ticket)
            <tr>
                <td>{{ $ticket->trackid }}</td>
                <td>{{ $ticket->dt }}</td>
                <td>{{ $ticket->emp_cat }}</td>
                <td>{{ $ticket->message }}</td>
                <td>
                    {{ 
                        $ticket->status == 0 ? 'New' : 
                        ($ticket->status == 1 ? 'Waiting Reply' : 
                        ($ticket->status == 2 ? 'Replied' : 
                        ($ticket->status == 3 ? 'Resolved' : 
                        ($ticket->status == 4 ? 'In Progress' : 
                        ($ticket->status == 5 ? 'On Hold' : 'Other'))))) 
                    }}
                </td>

            </tr>
            @endforeach
        </tbody>
    </table>
    <p>Please review the tickets listed above.</p>
    <p>Regards,</p>
    <p>Fidelis Tech Team</p>
</body>
</html>
