<?php

namespace App\Http\Controllers;

use App\Models\AdminCategory;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    /**
     * Fetch all categories.
     */
    public function index()
    {
        $categories = AdminCategory::all();
        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Fetch a single category by ID.
     */
    public function show($id)
    {
        $category = AdminCategory::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Create a new category.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:hesk_categories',
            'cat_order' => 'nullable|integer',
            'autoassign' => 'nullable|in:0,1',
            'autoassign_config' => 'nullable|string|max:1000',
            'type' => 'nullable|in:0,1',
            'priority' => 'nullable|in:0,1,2,3',
            'default_due_date_amount' => 'nullable|integer',
            'default_due_date_unit' => 'nullable|string|max:10',
        ]);

        $category = AdminCategory::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => $category,
        ], 201);
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, $id)
    {
        $category = AdminCategory::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'cat_order' => 'nullable|integer',
            'autoassign' => 'nullable|in:0,1',
            'autoassign_config' => 'nullable|string|max:1000',
            'type' => 'nullable|in:0,1',
            'priority' => 'nullable|in:0,1,2,3',
            'default_due_date_amount' => 'nullable|integer',
            'default_due_date_unit' => 'nullable|string|max:10',
        ]);

        $category->update(array_filter($validatedData));

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'data' => $category,
        ]);
    }

    /**
     * Delete a category.
     */
    public function destroy($id)
    {
        $category = AdminCategory::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.',
        ]);
    }
}
