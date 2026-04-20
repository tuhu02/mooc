<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class LevelController extends Controller
{
    public function index()
    {
        $levels = ['Beginner', 'Intermediate', 'Advanced'];

        return response()->json([
            'message' => 'Data level berhasil diambil.',
            'levels' => $levels,
        ]);
    }
}
