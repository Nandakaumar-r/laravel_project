<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmailList;

class EmailListController extends Controller
{
    // GET API to retrieve all email entries
    public function index()
    {

        $emails = EmailList::all();
        return response()->json($emails);
    }

    // DELETE API to remove an email entry by its ID
    public function destroy($id)
    {
        $email = EmailList::find($id);

        if ($email) {
            $email->delete();
            return response()->json(['message' => 'Email deleted successfully.']);
        }

        return response()->json(['message' => 'Email not found.'], 404);
    }

     // PATCH API to update the lock field of an email entry
     public function updateLock(Request $request, $id)
     {
         $email = EmailList::find($id);
 
         if ($email) {
             $request->validate([
                 'lock' => 'required|boolean',
             ]);
 
             $email->lock = $request->lock;
             $email->save();
 
             return response()->json([
                 'message' => 'Email lock status updated successfully.',
                 'email' => $email,
             ]);
         }
 
         return response()->json(['message' => 'Email not found.'], 404);
     }
}
