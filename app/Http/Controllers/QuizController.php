<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\UserResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{

    public function index()
    {
        return Inertia('quizzes/index', [
            'quizzes' => $quizzes = Quiz::with(['questions', 'userResponses'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get(),
        ]);
    }

    public function create()
    {
        return Inertia('quizzes/create');
    }

    public function store(Request $request)
{
    // Create the quiz
    $quiz = Quiz::create([
        'user_id' => auth()->id(),
        'title' => $request->title,
        'topic' => $request->topic,
        'difficulty' => $request->difficulty,
        'total_questions' => count($request->questions),
        'max_score' => array_reduce($request->questions, fn($carry, $item) => $carry + $item['points'], 0),
    ]);

    if (!$quiz->id) {
        dd('Failed to create quiz');
    }

    $i = 0;
    foreach ($request->questions as $questionData) {
        $quiz->questions()->create([
            'question_text' => $questionData['question_text'],
            'question_type' => $questionData['question_type'],
            'options' => $questionData['options'] ?? null,
            'correct_answer' => $questionData['correct_answer'],
            'explanation' => $questionData['explanation'] ?? null,
            'points' => $questionData['points'],
            'order_index' => $i++,
        ]);
    }
    return to_route('quizzes.show',  ['quiz' => $quiz]);
}


    public function show(Quiz $quiz)
    {
        if(auth()->id() !== $quiz->user_id) {
            abort(404, 'Quiz Not Found.');
        }
        return Inertia('quizzes/show', [
            'quiz' => $quiz->load(['questions', 'userResponses']),
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        if (auth()->id() !== $quiz->user_id) {
            abort(404, 'Quiz not found.');
        }

            $quiz->update([
                'analysis' => $request->analysis,
            ]);
    }

    public function destroy(Quiz $quiz)
    {
        if (auth()->id() !== $quiz->user_id) {
            abort(404, 'Quiz not found.');
        }

        $quiz->delete();

        return back();
    }
}