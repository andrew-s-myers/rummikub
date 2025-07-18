<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FooController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check endpoint for Docker
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

Route::get('/user', function (Request $request) {
	return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/foo/bar1', [FooController::class, 'bar1Foo']);
//     Route::post('/foo/bar2', [FooController::class, 'bar2Foo']);
//     Route::post('/foo/bar3', [FooController::class, 'bar3Foo']);
// });