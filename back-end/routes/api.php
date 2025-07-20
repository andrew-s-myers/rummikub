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
	// Manual Sanctum token validation - works reliably in Docker environment
	$token = $request->bearerToken();
	
	if (!$token) {
		return response()->json(['message' => 'Unauthenticated.'], 401);
	}
	
	// Try to find user by token using Sanctum
	$accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
	
	if (!$accessToken) {
		return response()->json(['message' => 'Unauthenticated.'], 401);
	}
	
	return response()->json($accessToken->tokenable);
});

// TODO: Fix auth:sanctum middleware recursion in Docker + NGINX environment
// The middleware approach causes infinite recursion in this setup:
// Route::get('/user', function (Request $request) {
// 	return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/foo/bar1', [FooController::class, 'bar1Foo']);
//     Route::post('/foo/bar2', [FooController::class, 'bar2Foo']);
//     Route::post('/foo/bar3', [FooController::class, 'bar3Foo']);
// });