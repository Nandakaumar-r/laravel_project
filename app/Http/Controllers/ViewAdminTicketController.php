<?php

namespace App\Http\Controllers;

use App\Mail\TicketCreatedMail;
use App\Mail\TicketResolvedMail;
use App\Models\AssetDetails;
use App\Models\CreateTicket;
use App\Models\HeskReply;
use App\Models\HeskUser;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;

class ViewAdminTicketController extends Controller
{
    /**
     * View all tickets.
     */
    public function getAllTickets(Request $request)
    {
        // Fetch all tickets with optional category and owner filters
        $category = $request->category;
        $owner = $request->owner;
        $searchTerm = $request->input('search');
        $tickets = CreateTicket::getAllTickets($category, $owner, $searchTerm);

        if (!$tickets) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'tickets' => $tickets,
        ], 200);
    }

    /**
     * View a specific ticket.
     */
    public function getTicket($id)
    {
        try {
            $ticket = CreateTicket::getTicketWithDetails($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket not found',
                ], 404);
            }

            // Fetch replies related to the ticket using the model
            $replies = HeskReply::where('replyto', $id)->get(['id', 'name', 'message', 'message_html', 'dt', 'attachments', 'staffid', 'read', 'rating']);

            // $bearerToken = 'your_bearer_token';
            // Fetch user by email
            //  $user = AssetDetails::getUserByEmail($ticket->email, $bearerToken);

            // Fetch the assets assigned to the user
            //  $assets = AssetDetails::getAssetsByUserId($user['id'], $bearerToken);

            // Attach asset data to the ticket response


            return response()->json([
                'success' => true,
                'ticket' => $ticket,
                'replies' => $replies,

            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Edit a ticket.
     */
    public function editTicket(Request $request, $id)
    {
        $ticket = CreateTicket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        $validatedData = $request->validate([
            'category' => 'sometimes|integer',
            'priority' => 'sometimes|in:0,1,2,3',
            'subject' => 'sometimes|string|max:250',
            'message' => 'sometimes|string',
            'status' => 'sometimes|integer',
            'due_date' => 'sometimes|date',
        ]);

        // Exclude the message field when updating the ticket
        $ticketUpdateData = $validatedData;
        unset($ticketUpdateData['message']);

        // Update the ticket fields, excluding 'message'
        $ticket->update($ticketUpdateData);

        // Add an entry to the hesk_replies table if a message is provided
        if (isset($validatedData['message']) && $validatedData['message'] !== '') {
            $attachmentDetails = []; // Update with actual logic for attachments if applicable

            HeskReply::create([
                'replyto' => $ticket->id,
                'name' => $ticket->name, // Fetch the name from the hesk_tickets table
                'message' => $validatedData['message'],
                'message_html' => nl2br(e($validatedData['message'])),
                'dt' => now(),
                'attachments' => implode(',', $attachmentDetails), // Adjust as necessary
                'staffid' => 0, // Assuming this is a customer reply
                'rating' => null,
                'read' => '0',
            ]);
        }

        // Check if the status is being updated to "Resolved"
        if (isset($validatedData['status']) && $validatedData['status'] == 3) {
            // Trigger email notification
            $this->sendResolvedEmail($ticket);

            return response()->json([
                'success' => true,
                'message' => 'Ticket resolved and notification email sent.',
                'ticket' => $ticket,
            ], 200);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ticket updated successfully.',
            'ticket' => $ticket,
        ], 200);
    }

    /**
     * Send an email to the employee when the ticket is resolved.
     */
    private function sendResolvedEmail($ticket)
    {
        $details = [
            'name' => $ticket->name, // Adjust based on your data structure
            'trackid' => $ticket->trackid, // Adjust based on your data structure
            'track_url' => url("/ticket-status/{$ticket->trackid}"),
            'site_title' => config('app.name'),
            'site_url' => config('app.url'),
        ];
        try {
            Mail::to($ticket->email)->send(new TicketResolvedMail($details));
        } catch (\Exception $e) {
            // \Log::error("Failed to send resolved email for ticket ID {$ticket->id}: " . $e->getMessage());
        }
    }


    /**
     * Delete a ticket if the user is an admin.
     */
    public function deleteTicket(Request $request, $id)
    {
        $user = HeskUser::find($request->id); // Assume auth user
        if (!$user || !$user->isadmin) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this ticket',
            ], 403);
        }

        $ticket = CreateTicket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket deleted successfully',
        ], 200);
    }

    // /**
    //  * Reassign a ticket to another user.
    //  */
    // public function reassignTicket(Request $request, $id)
    // {
    //     $validatedData = $request->validate([
    //         'user_id' => 'required|exists:hesk_users,id', // Ensure user exists
    //     ]);

    //     $ticket = CreateTicket::find($id);

    //     if (!$ticket) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Ticket not found',
    //         ], 404);
    //     }

    //     $newUser = HeskUser::find($validatedData['user_id']);

    //     if (!$newUser) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found',
    //         ], 404);
    //     }

    //     // Update the ticket's assigned user
    //     $ticket->owner = $newUser->id;
    //     $ticket->save();

    //     // Send notification email to the new assigned user
    //     $this->sendAssignedEmail($ticket, $newUser);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Ticket reassigned successfully.',
    //         'ticket' => $ticket,
    //     ], 200);
    // }

    // /**
    //  * Send an email to the new assigned user.
    //  */
    // private function sendAssignedEmail($ticket, $newUser)
    // {
    //     $details = [
    //         'recipient' => $newUser->name,
    //         'name' => $ticket->name,
    //         'emp_cat' => $ticket->emp_cat,
    //         'track_id' => $ticket->trackid,
    //         'track_url' => url("/ticket-status/{$ticket->trackid}"),
    //         'site_title' => config('app.name'),
    //         'site_url' => config('app.url'),
    //     ];
    //     $details['recipient'] = $newUser->name;
    //     $details['role'] = 'Assigned User'; // Include role information for clarity in the email

    //     try {
    //         Mail::to($newUser->email)->send(new TicketCreatedMail($details));
    //     } catch (\Exception $e) {
    //         //\Log::error("Failed to send assigned email for ticket ID {$ticket->id}: " . $e->getMessage());
    //     }
    // }
}
