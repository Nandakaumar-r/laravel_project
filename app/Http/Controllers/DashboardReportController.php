<?php

namespace App\Http\Controllers;

use App\Models\DashboardCsv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class DashboardReportController extends Controller
{
    public function downloadReport(Request $request)
    {
        // Set CSV headers for download
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename=ticket_report.csv',
        ];

        // Create a file pointer connected to the output stream
        $output = fopen('php://output', 'w');

        fputcsv($output, ['Id', 'Tracking Id', 'Employee Name', 'Assigned Agent', 'Category', 'Status', 'Created Date', 'Due Date']);
        $filter = $request->input('filter', 'last_month');

        $results = DashboardCsv::getTicketsByFilter($filter);

        // Fetch each row and add it to the CSV
        foreach ($results as $row) {
            fputcsv($output, [
                $row->id,
                $row->ticket_id,
                $row->name,
                $row->agent_name ?? 'Unassigned',
                $row->Category,
                $row->status,
                $row->date_created,
                $row->due_date
            ]);
        }

        // Return the response as a stream
        return Response::stream(function () use ($output) {
            fclose($output);
        }, 200, $headers);
    }
}
