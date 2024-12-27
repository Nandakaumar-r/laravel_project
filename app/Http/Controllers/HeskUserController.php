<?php

namespace App\Http\Controllers;

use App\Models\HeskUser;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class HeskUserController extends Controller
{
    // Store a new user
    public function store(UserRequest $request)
    {
        $validatedData = $request->validated();


        $validatedData['pass'] = Hash::make($validatedData['pass']); // Hash the password

        $user = HeskUser::create($validatedData);

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 201);
    }

    // Get all users
    public function index()
    {
        $users = HeskUser::all();
        return response()->json([
            'success' => true,
            'data' => $users,
        ], 200);
    }

    // Get a specific user by ID
    public function show($id)
    {
        $user = HeskUser::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 200);
    }

    // Update an existing user by ID
    public function updateUser(Request $request, $id)
    {
        $user = HeskUser::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $validatedData = $request->validate([
            'user' => 'nullable|string|max:255|unique:hesk_users,user,' . $id,
            'pass' => 'nullable|string|min:6',
            'isadmin' => 'nullable|in:0,1',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:hesk_users,email,' . $id,
            'signature' => 'nullable|string|max:1000',
            'language' => 'nullable|string|max:50',
            'categories' => 'nullable|integer|exists:hesk_categories,id',
        ]);

        if (isset($validatedData['pass'])) {
            $validatedData['pass'] = Hash::make($validatedData['pass']); // Hash the password if provided
        }

        $user->update($validatedData);

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 200);
    }

    // Delete a user by ID
    public function deleteUser($id)
    {
        $user = HeskUser::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ], 200);
    }
}
