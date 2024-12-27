<!DOCTYPE html>
<html>
<head>
    <title>Ticket Created</title>
</head>
<body>
    <p>Dear {{ $details['name'] }},</p>

    <p>
    Our team is committed to responding as quickly as possible, typically within 2 to 4 hours. 
    If we anticipate any delays, we will promptly inform you via email with an updated timeline.
    </p>

    <p>
        <strong>Ticket tracking ID:</strong> {{ $details['track_id'] }}
    </p>

    <p>
    You can monitor the status of your ticket at the following link:<br>
        <a href="{{ $details['track_url'] }}">{{$details['track_url'] }}</a>
    </p>

    <p>We appreciate your patience and look forward to assisting you.</p>

    <p>
        Sincerely,<br>
        {{ $details['site_title'] }}<br>
        <a href="{{ $details['site_url'] }}">{{ $details['site_url'] }}</a>
    </p>
</body>
</html>
