<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Resolved</title>
</head>
<body>
    <p>Dear {{ $details['name'] }},</p>

    <p>Your support ticket "<strong>{{ $details['trackid'] }}</strong>" has been updated to a Closed/Resolved status.</p>

    <p>You can view the status of your ticket here:</p>
    <p><a href="{{ $details['track_url'] }}">{{ $details['track_url'] }}</a></p>

    <p>If the above link is not clickable, try copying and pasting it into the address bar of your web browser.</p>

    <p>Sincerely,</p>
    <p>{{ $details['site_title'] }}</p>
    <p><a href="{{ $details['site_url'] }}">{{ $details['site_url'] }}</a></p>
</body>
</html>
