<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HeskNotice;
use Illuminate\Support\Facades\Validator;

class HeskNoticeController extends Controller
{
    public function index()
    {
        return response()->json(HeskNotice::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'message' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notice = HeskNotice::create($request->only(['title', 'message']));

        return response()->json($notice, 201);
    }

    public function show($id)
    {
        $notice = HeskNotice::find($id);

        if (!$notice) {
            return response()->json(['message' => 'Notice not found'], 404);
        }

        return response()->json($notice, 200);
    }

    public function update(Request $request, $id)
    {
        $notice = HeskNotice::find($id);

        if (!$notice) {
            return response()->json(['message' => 'Notice not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|max:255',
            'message' => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notice->update($request->only(['title', 'message']));

        return response()->json($notice, 200);
    }

    public function destroy($id)
    {
        $notice = HeskNotice::find($id);

        if (!$notice) {
            return response()->json(['message' => 'Notice not found'], 404);
        }

        $notice->delete();

        return response()->json(['message' => 'Notice deleted successfully'], 200);
    }
}
