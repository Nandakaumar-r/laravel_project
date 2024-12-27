<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Ticket Assigned to You</title>
</head>
<body>
    <p>Dear {{ $details['recipient'] }},</p>

    <p>A new support ticket has been assigned to you. Ticket details:</p>

    <p><strong>Ticket Subject:</strong> {{ $details['message'] ?? 'No subject provided' }}</p>
    <p><strong>Tracking ID:</strong> {{ $details['track_id'] }}</p>

    <p>You can manage this ticket here:</p>
    <p><a href="{{ $details['track_url'] }}">{{ $details['track_url'] }}</a></p>

    <p>If the above link is not clickable, please copy and paste it into your web browser's address bar.</p>

    <p>Regards,</p>
    <p>{{ $details['site_title'] }}</p>
    <p><a href="{{ $details['site_url'] }}">{{ $details['site_url'] }}</a></p>
</body>
</html>
