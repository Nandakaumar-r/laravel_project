<?php

namespace App\Http\Controllers;

use App\Models\IncidentCategory;
use App\Models\RequestCategory;
use Illuminate\Http\Request;

class CategoryDropdownController extends Controller
{
    // Get all incident categories
    public function getIncidentCategories()
    {
        $incidentCategories = IncidentCategory::all();
        return response()->json($incidentCategories);
    }

    // Get all request categories
    public function getRequestCategories()
    {
        $requestCategories = RequestCategory::all();
        return response()->json($requestCategories);
    }
}
