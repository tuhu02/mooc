<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();

        return response()->json([
            'message' => 'Data kategori berhasil diambil.',
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Kategori berhasil dibuat.',
            'category' => $category
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diupdate.',
            'category' => $category
        ]);
    }
}
