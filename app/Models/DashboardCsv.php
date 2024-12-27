<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DashboardCsv extends Model
{
    protected $table = 'hesk_tickets';

    public static function getTicketsByFilter($filter)
    {
        // Determine the date range condition based on the filter
        $dateRangeCondition = match ($filter) {
            'last_week' => "tickets.dt >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)",
            'last_3_months' => "tickets.dt >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)",
            default => "tickets.dt >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)",
        };

        // Query to get ticket details based on filter criteria
        $query = "
            SELECT 
                tickets.id AS id,
                tickets.trackid AS ticket_id,
                tickets.name AS name,
                users.name AS agent_name,
                tickets.emp_cat AS Category,
                CASE tickets.status
                    WHEN '0' THEN 'Pending'
                    WHEN '5' THEN 'On Hold'
                    WHEN '4' THEN 'In Progress'
                    WHEN '3' THEN 'Resolved'
                    WHEN '1' THEN 'Waiting Reply'
                    WHEN '2' THEN 'Replied'
                    ELSE 'Unknown' 
                END AS status,
                tickets.dt AS date_created,
                tickets.due_date AS due_date
            FROM `hesk_tickets` AS tickets
            LEFT JOIN `hesk_users` AS users ON tickets.owner = users.id
            WHERE $dateRangeCondition
        ";

        // Execute the query and return the results
        return DB::select($query);
    }
}
