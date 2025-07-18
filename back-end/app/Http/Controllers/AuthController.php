<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
	public function register(Request $r)
	{
		$data = $r->validate([
			'name'                  => 'required|string|max:255',
			'email'                 => 'required|email|unique:users',
			'password'              => 'required|confirmed|min:8',
		]);

		$user = User::create([
			'name'     => $data['name'],
			'email'    => $data['email'],
			'password' => Hash::make($data['password']),
		]);


		$user->sendEmailVerificationNotification(); // send verification email (built-in notification via User MustVerifyEmail)

		return response()->json([
			'user'  => $user,
			'token' => $user->createToken('API Token')->plainTextToken,
		], 201);
	}

	public function login(Request $r)
	{
		$r->validate([
			'email'    => 'required|email',
			'password' => 'required',
		]);

		$user = User::where('email', $r->email)->first();

		if (!$user || ! Hash::check($r->password, $user->password)) {
			throw ValidationException::withMessages([
				'email' => ['The provided credentials are incorrect.'],
			]);
		}

		return [
			'user'  => $user,
			'token' => $user->createToken('API Token')->plainTextToken, // function of User HasApiTokens
		];
	}

	public function logout(Request $r)
	{
		$r->user()->currentAccessToken()->delete(); // function of User HasApiTokens
		return response()->json(['message' => 'Logged out']);
	}

	public function me(Request $r)
	{
		return $r->user();   // used by /user route
	}
}
