<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TicketExportController  extends Controller
{
    public function exportTickets()
    {
        // Fetch data from the database
        $tickets = DB::table('hesk_tickets')
            ->join('hesk_categories', 'hesk_tickets.category', '=', 'hesk_categories.id')
            ->join('hesk_users', 'hesk_tickets.owner', '=', 'hesk_users.id')
            ->select(
                'hesk_tickets.id',
                'hesk_tickets.trackid',
                'hesk_tickets.dt',
                'hesk_tickets.lastchange',
                'hesk_tickets.name',
                'hesk_tickets.email',
                'hesk_categories.name as category_name',
                'hesk_tickets.priority',
                'hesk_tickets.status',
                'hesk_tickets.subject',
                'hesk_tickets.message',
                'hesk_users.name as owner_name',
                'hesk_tickets.time_worked',
                'hesk_tickets.due_date'
            )
            ->get();

        // Define CSV headers
        $csvData = [
            ['ID', 'Track ID', 'Date', 'Last Update', 'Name', 'Email', 'Category', 'Priority', 'Status', 'Subject', 'Message', 'Owner', 'Time Worked', 'Due Date']
        ];

        // Populate CSV rows
        foreach ($tickets as $ticket) {
            $csvData[] = [
                $ticket->id,
                $ticket->trackid,
                $ticket->dt,
                $ticket->lastchange,
                $ticket->name,
                $ticket->email,
                $ticket->category_name,
                $this->getPriorityName($ticket->priority),
                $this->getStatusName($ticket->status),
                $ticket->subject,
                $ticket->message,
                $ticket->owner_name,
                $ticket->time_worked,
                $ticket->due_date
            ];
        }

        // Create a CSV file
        $fileName = 'tickets_export_' . now()->format('Y-m-d_H-i-s') . '.csv';
        $filePath = storage_path("app/public/{$fileName}");

        $file = fopen($filePath, 'w');
        foreach ($csvData as $row) {
            fputcsv($file, $row);
        }
        fclose($file);

        // Return the CSV file as a download
        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    private function getPriorityName($priority)
    {
        return match ($priority) {
            0 => 'Critical',
            1 => 'High',
            2 => 'Medium',
            default => 'Low',
        };
    }

    private function getStatusName($status)
    {
        return match ($status) {
            0 => 'Open',
            1 => 'Pending',
            2 => 'Resolved',
            3 => 'Closed',
            default => 'Unknown',
        };
    }
}
