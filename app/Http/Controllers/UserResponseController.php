<?php

namespace App\Http\Controllers;

use App\Models\UserResponse;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserResponseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // dd($request->all());

    $responses = is_string($request->responses)
        ? json_decode($request->responses, true)
        : $request->responses;

    $userId = Auth::id();
    $storedResponses = [];

    foreach ($responses as $response) {
        $storedResponses[] = UserResponse::create([
            'user_id' => $userId,
            'quiz_id' => $response['quiz_id'],
            'question_id' => $response['question_id'],
            'user_answer' => $response['user_answer'],
            'is_correct' => $response['is_correct'],
        ]);
    }

    $quiz = Quiz::find($responses[0]['quiz_id']);
    if (!$quiz) {
        return response()->json(['message' => 'Quiz not found.'], 404);
    }
    $quiz->update([
        'score' => $request->score,
        'completed' => true,
    ]);
}

    /**
     * Display the specified resource.
     */
    public function show(UserResponse $userResponse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserResponse $userResponse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserResponse $userResponse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserResponse $userResponse)
    {
        //
    }
}
