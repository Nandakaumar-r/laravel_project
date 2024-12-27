<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\EmailList;
use Illuminate\Support\Facades\DB;

class EmailImportCsvController extends Controller
{
    public function importCsv(Request $request)
    {

        // Validate file input
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt',
        ]);

        // Open and read the CSV file
        $file = $request->file('csv_file');
        $fileHandle = fopen($file->getPathname(), 'r');

        // Validate CSV headers
        $headers = fgetcsv($fileHandle);
        $expectedHeaders = ['email'];

        if ($headers !== $expectedHeaders) {
            return response()->json(['error' => 'Invalid CSV headers. Expected: ' . implode(', ', $expectedHeaders)], 422);
        }

        $emailsToInsert = [];
        $duplicateEmails = [];
        $invalidEmails = [];

        // Process rows
        while (($row = fgetcsv($fileHandle)) !== false) {
            $email = trim($row[0]);

            // Validate email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $invalidEmails[] = $email;
                continue;
            }

            // Check for duplicates in the database
            if (EmailList::where('email', $email)->exists()) {
                $duplicateEmails[] = $email;
                continue;
            }

            // Prepare for bulk insert
            $emailsToInsert[] = [
                'email' => $email,
                'created_at' => now(),
            ];
        }

        fclose($fileHandle);

        // Bulk insert valid emails
        if (!empty($emailsToInsert)) {
            DB::table('email_list')->insert($emailsToInsert);
        }

        // Return response with results
        return response()->json([
            'message' => 'CSV file processed successfully.',
            'inserted' => count($emailsToInsert),
            'duplicates' => $duplicateEmails,
            'invalid' => $invalidEmails,
        ]);
    }
}
