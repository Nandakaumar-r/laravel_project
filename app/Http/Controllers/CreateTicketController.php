<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTicketRequest;
use App\Mail\TicketCreatedMail;
use App\Models\CreateTicket as ModelsCreateTicket;
use App\Models\EmailList;
use App\Models\HeskAttachment;
use App\Models\HeskReply;
use App\Models\HeskUser;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CreateTicketController extends Controller
{

    public function createTicket(CreateTicketRequest $request)
    {
        $validatedData = $request->validated();

    // Check if email exists and is not locked
    $emailRecord = EmailList::where('email', $validatedData['email'])->first();

    if (!$emailRecord) {
        return response()->json([
            'success' => false,
            'message' => 'The email is not in the allowed list. Ticket creation denied.',
        ], 403);
    }

    if ($emailRecord->lock) {
        return response()->json([
            'success' => false,
            'message' => 'The email is locked. Ticket creation denied.',
        ], 403);
    }

        $trackid = $this->generateUniqueTrackID();
        $validatedData['trackid'] = $trackid;

        // Automatically assign the ticket to a user from 'hesk_users' table
        $assignedUser = HeskUser::where('isadmin', '0')->inRandomOrder()->first();

        if (!$assignedUser) {
            return response()->json([
                'success' => false,
                'message' => 'No users available to assign the ticket.',
            ], 500);
        }

        $validatedData['owner'] = $assignedUser->id;

        $attachments = $request->attachments ?? [];
        $attachmentDetails = [];
        foreach ($attachments as $attachment) {
            if ($attachment['size'] > 2 * 1024 * 1024) {
                return response()->json([
                    'success' => false,
                    'message' => "Attachment {$attachment['real_name']} exceeds the size limit of 2MB.",
                ], 400);
            }

            $savedName = $trackid . '_' . uniqid() . '.' . pathinfo($attachment['real_name'], PATHINFO_EXTENSION);

            $attachmentRecord = HeskAttachment::create([
                'ticket_id' => $trackid,
                'saved_name' => $savedName,
                'real_name' => $attachment['real_name'],
                'size' => $attachment['size'],
                'type' => '0',
            ]);

            $attachmentDetails[] = $attachmentRecord->id . '#' . $attachmentRecord->real_name;
        }

        // Concatenate all attachment details into a single string for the database
        $validatedData['attachments'] = implode(',', $attachmentDetails);

        // Set the due_date based on priority
        $priority = (int)$validatedData['priority'];
        $dueDate = match ($priority) {
            0 => now()->addDay(),
            1 => now()->addHours(8),
            2 => now()->addHours(4),
            default => null,
        };
        $validatedData['due_date'] = $dueDate;

        $ticket = ModelsCreateTicket::create($validatedData);

        // Add an entry in the hesk_replies table
        HeskReply::create([
            'replyto' => $ticket->id,
            'name' => $validatedData['name'],
            'message' => $validatedData['message'],
            'message_html' => nl2br(e($validatedData['message'])),
            'dt' => now(),
            'attachments' => implode(',', $attachmentDetails),
            'staffid' => 0, // Assuming this is a customer reply
            'rating' => null,
            'read' => '0',
        ]);
        //Prepare ticket details for email notifications
        $emplyeeDetails = [
            'name' => $validatedData['name'], // User's name
            'track_id' => $ticket->trackid,
            'track_url' => url("/ticket-details?trackid={$ticket->trackid}&email={$validatedData['email']}"),
            'site_title' => config('app.name'),
            'site_url' => config('app.url'),
        ];

        //Email to user
        Mail::to($validatedData['email'])->send(new TicketCreatedMail($emplyeeDetails));

        $ticketDetails = [
            'name' => $validatedData['name'], // User's name
            'message' => $ticket->message,
            'track_id' => $ticket->trackid,
            'track_url' => url("/admin/tickets/{$ticket->id}"),
            'site_title' => config('app.name'),
            'site_url' => config('app.url'),
        ];
        // Email to assigned owner
        $ticketDetails['recipient'] = $assignedUser->name; // Add assigned user's name for email personalization
        $ticketDetails['role'] = 'Assigned User'; // Include role information for clarity in the email

        Mail::to($assignedUser->email)->send(new TicketCreatedMail($ticketDetails)); // Use a dedicated Mailable for assignment

        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully and assigned to a user!',
            'data' => $ticket,
            'assigned_user' => $assignedUser->name,
            'attachments' => $attachmentDetails,
        ], 201);
    }


    /**
     * Generate a unique track ID.
     *
     * @return string
     */
    private function generateUniqueTrackID()
    {
        $parts = [];
        for ($i = 0; $i < 3; $i++) {
            $parts[] = Str::upper(Str::random(3));
        }
        return implode('-', $parts);
    }
}
