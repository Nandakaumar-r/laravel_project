<?php

namespace App\Http\Controllers;

use App\Models\CreateTicket; // Import the model
use App\Models\HeskReply;
use Illuminate\Http\Request;

class ViewTicketController extends Controller
{
    /**
     * Fetch ticket details based on trackid and email.
     */
    public function show(Request $request)
    {
        $validatedData = $request->validate([
            'trackid' => 'required|string', 
            'email' => 'required|email',   
        ]);

        // Fetch the ticket based on trackid and email
        $ticket = CreateTicket::where('trackid', $validatedData['trackid'])
            ->where('email', $validatedData['email'])
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'No ticket found with the provided track ID and email.',
            ], 404);
        }
        // Fetch replies related to the ticket using the model
        $replies = HeskReply::where('replyto', $ticket->id)->get(['id', 'name', 'message', 'message_html', 'dt', 'attachments', 'staffid', 'read', 'rating']);

        return response()->json([
            'success' => true,
            'data' => $ticket,
            'replies' => $replies,
        ]);
    }

    /**
     * Update ticket details based on trackid and email passed as URL parameters.
     */
    public function update(Request $request, $trackid, $email)
    {
        // Fetch the ticket to update based on trackid and email
        $ticket = CreateTicket::where('trackid', $trackid)
            ->where('email', $email)
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'No ticket found with the provided track ID and email.',
            ], 404);
        }

        // Validate incoming request
        $validatedData = $request->validate([
            'message' => 'nullable|string', // Optional: New message for reply
        ]);

        // Extract and unset 'message' to prevent it from updating the ticket
        $ticketUpdateData = $validatedData;
        unset($ticketUpdateData['message']);

        // Update other ticket fields, excluding 'message'
        if (!empty($ticketUpdateData)) {
            $ticket->update($ticketUpdateData);
        }

        // Add a new entry to the hesk_replies table if a message is provided
        if (isset($validatedData['message']) && $validatedData['message'] !== '') {
            $attachmentDetails = []; // Placeholder for attachment logic

            HeskReply::create([
                'replyto' => $ticket->id,
                'name' => $ticket->name, // Use the name from the hesk_tickets table
                'message' => $validatedData['message'],
                'message_html' => nl2br(e($validatedData['message'])),
                'dt' => now(),
                'attachments' => implode(',', $attachmentDetails), // Placeholder for attachments
                'staffid' => 0, // Assuming this is a customer reply
                'rating' => null,
                'read' => '0',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ticket updated successfully.',
            'data' => $ticket,
        ]);
    }
}
