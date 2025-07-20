<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
	public function verify(Request $r, $id, $hash)
	{
		$user = \App\Models\User::findOrFail($id);

		if (! hash_equals($hash, sha1($user->getEmailForVerification()))) {
			return response()->json(['message' => 'Invalid hash'], 403);
		}

		if ($user->hasVerifiedEmail()) {
			return response()->json(['message' => 'Already verified']);
		}

		$user->markEmailAsVerified();
		event(new Verified($user));

		return response()->json(['message' => 'Email verified']);
	}
}
