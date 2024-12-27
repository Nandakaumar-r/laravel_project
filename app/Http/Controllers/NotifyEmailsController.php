<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NotifyTickets;

class NotifyEmailsController extends Controller
{
    // GET API: Fetch all email settings
    public function index()
    {
        return response()->json(NotifyTickets::all(), 200);
    }

    // POST API: Create a new email setting
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tech_team_email' => 'required|email|max:255',
            'tech_leader_email' => 'required|email|max:255',
            'hr_officer_email' => 'required|email|max:255',
        ]);

        $emailSetting = NotifyTickets::create($validated);

        return response()->json(['message' => 'Email settings created successfully', 'data' => $emailSetting], 201);
    }

    // PUT API: Update an existing email setting
    public function update(Request $request, $id)
    {
        $emailSetting = NotifyTickets::find($id);

        if (!$emailSetting) {
            return response()->json(['message' => 'Email setting not found'], 404);
        }

        $validated = $request->validate([
            'tech_team_email' => 'sometimes|email|max:255',
            'tech_leader_email' => 'sometimes|email|max:255',
            'hr_officer_email' => 'sometimes|email|max:255',
        ]);

        $emailSetting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Email settings updated successfully', 
            'data' => $emailSetting],
             200);
    }

    // DELETE API: Delete an email setting
    public function destroy($id)
    {
        $emailSetting = NotifyTickets::find($id);

        if (!$emailSetting) {
            return response()->json(['message' => 'Email setting not found'], 404);
        }

        $emailSetting->delete();

        return response()->json(['message' => 'Email settings deleted successfully'], 200);
    }
}
