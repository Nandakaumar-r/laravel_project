<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDashboardController extends Controller
{
    public function getTicketData(Request $request)
    {
        $filter = $request->query('filter', 'last_month');

        // Define the date range based on the filter
        switch ($filter) {
            case 'last_week':
                $dateRange = now()->subWeek();
                break;
            case 'last_3_months':
                $dateRange = now()->subMonths(3);
                break;
            default:
                $dateRange = now()->subMonth();
                break;
        }

        // Fetch ticket counts for each status within the date range
        $statusCounts = DB::table('hesk_tickets')
            ->selectRaw('
                COUNT(CASE WHEN status = 0 THEN 1 END) AS pending,
                COUNT(CASE WHEN status = 5 THEN 1 END) AS on_hold,
                COUNT(CASE WHEN status = 4 THEN 1 END) AS in_progress,
                COUNT(CASE WHEN status = 3 THEN 1 END) AS resolved,
                COUNT(CASE WHEN status = 1 THEN 1 END) AS waiting_reply,
                COUNT(CASE WHEN status = 2 THEN 1 END) AS replied
            ')
            ->where('dt', '>=', $dateRange)
            ->first();

        // Fetch the latest 10 tickets
        $newTickets = DB::table('hesk_tickets AS tickets')
            ->join('hesk_users AS users', 'tickets.owner', '=', 'users.id', 'left')
            ->select('tickets.trackid', 'tickets.name', 'tickets.message', 'users.name AS owner_name')
            ->orderByDesc('tickets.dt')
            ->limit(10)
            ->get();

        // Fetch overdue tickets
        $overdueTickets = DB::table('hesk_tickets AS tickets')
            ->join('hesk_users AS users', 'tickets.owner', '=', 'users.id', 'left')
            ->select('tickets.trackid', 'tickets.name', 'tickets.message', 'users.name AS owner_name')
            ->where('tickets.due_date', '<', now())
            ->where('tickets.status', '!=', 3) // Exclude resolved tickets
            ->orderByDesc('tickets.due_date')
            ->get();

        // Fetch ticket data by user for charts
        $userData = DB::table('hesk_tickets AS tickets')
            ->join('hesk_users AS users', 'tickets.owner', '=', 'users.id')
            ->selectRaw('
                users.name AS user_name,
                COUNT(CASE WHEN tickets.status = 0 THEN 1 END) AS pending,
                COUNT(CASE WHEN tickets.status = 3 THEN 1 END) AS resolved,
                COUNT(CASE WHEN tickets.status = 4 THEN 1 END) AS in_progress,
                COUNT(CASE WHEN tickets.status = 5 THEN 1 END) AS on_hold,
                COUNT(CASE WHEN tickets.status = 2 THEN 1 END) AS replied
            ')
            ->where('tickets.dt', '>=', $dateRange)
            ->groupBy('users.name')
            ->get();

        // Calculate totals
        $totals = [
            'pending' => $userData->sum('pending'),
            'resolved' => $userData->sum('resolved'),
            'in_progress' => $userData->sum('in_progress'),
            'on_hold' => $userData->sum('on_hold'),
            'replied' => $userData->sum('replied'),
        ];

        return response()->json([
            'statusCounts' => $statusCounts,
            'newTickets' => $newTickets,
            'overdueTickets' => $overdueTickets,
            'userData' => $userData,
            'totals' => $totals,
        ]);
    }

    // public function exportToCsv(Request $request)
    // {
    //     $filter = $request->query('filter', 'last_month');
    //     // Define the date range based on the filter
    //     switch ($filter) {
    //         case 'last_week':
    //             $dateRange = now()->subWeek();
    //             break;
    //         case 'last_3_months':
    //             $dateRange = now()->subMonths(3);
    //         }
    //     }
}
