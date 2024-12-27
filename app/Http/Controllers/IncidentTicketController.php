<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CreateTicket;

class IncidentTicketController extends Controller
{
    // Fetch only "Submit a Request" tickets
    public function getIncidentTickets()
    {
        // Dynamically fetch the category ID for "Submit a Request"
        $categoryId = DB::table('hesk_categories')
            ->where('name', 'Submit an incident')
            ->value('id');

        if (!$categoryId) {
            return response()->json([
                'success' => false,
                'message' => 'Category "Submit an incident Tickets" not found',
            ], 404);
        }

        // Fetch tickets associated with the retrieved category ID
        $tickets = CreateTicket::where('category', $categoryId)->get();

        if ($tickets->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No tickets found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ], 200);
    }
}
