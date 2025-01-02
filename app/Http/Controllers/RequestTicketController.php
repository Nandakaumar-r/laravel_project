<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CreateTicket;

class RequestTicketController extends Controller
{
    // Fetch only "Submit a Request" tickets
    public function getRequestTickets(Request $request)
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

        $searchTerm = $request->input('search');
        // Fetch tickets associated with the retrieved category ID
        $query = CreateTicket::where('category', $categoryId);
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('trackid', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }
        $tickets = $query->paginate(10);

        if ($tickets->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'Not tickets found',
                'tickets' => $tickets,
            ], 200);
        }

        return response()->json([
            'success' => true,
            'tickets' => $tickets,
        ], 200);
    }
}
