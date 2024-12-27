<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CreateTicket;

class RequestTicketController extends Controller
{
    // Fetch only "Submit a Request" tickets
    public function getRequestTickets()
    {
        // Dynamically fetch the category ID for "Submit a Request"
        $categoryId = DB::table('hesk_categories')
            ->where('name', 'Submit a Request')
            ->value('id');

        if (!$categoryId) {
            return response()->json([
                'success' => false,
                'message' => 'Category Submit a Request not found',
            ], 404);
        }

        // Fetch tickets associated with the retrieved category ID
        $tickets = CreateTicket::where('category', $categoryId)->get();

        if ($tickets->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'Not tickets found',
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ], 200);
    }
}
