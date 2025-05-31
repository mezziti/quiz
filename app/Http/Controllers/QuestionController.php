<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    public function index(Quiz $quiz)
    {
        $this->authorize('view', $quiz);

        return response()->json($quiz->questions()->orderBy('order_index')->get());
    }

    public function store(Request $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        $validated = $request->validate([
            'question_text' => 'required|string',
            'question_type' => 'required|in:multiple_choice,problem_solving',
            'options' => 'nullable|array',
            'correct_answer' => 'required|string',
            'explanation' => 'nullable|string',
            'points' => 'required|integer|min:1',
            'order_index' => 'required|integer|min:0',
        ]);

        $question = $quiz->questions()->create($validated);

        // Update quiz max score
        $quiz->update([
            'max_score' => $quiz->questions()->sum('points'),
            'total_questions' => $quiz->questions()->count(),
        ]);

        return response()->json($question, 201);
    }

    public function show(Question $question)
    {
        $this->authorize('view', $question->quiz);

        return response()->json($question);
    }

    public function update(Request $request, Question $question)
    {
        $this->authorize('update', $question->quiz);

        $validated = $request->validate([
            'question_text' => 'sometimes|string',
            'question_type' => 'sometimes|in:multiple_choice,problem_solving',
            'options' => 'nullable|array',
            'correct_answer' => 'sometimes|string',
            'explanation' => 'nullable|string',
            'points' => 'sometimes|integer|min:1',
            'order_index' => 'sometimes|integer|min:0',
        ]);

        $question->update($validated);

        // Update quiz max score if points changed
        if ($request->has('points')) {
            $question->quiz->update([
                'max_score' => $question->quiz->questions()->sum('points'),
            ]);
        }

        return response()->json($question);
    }

    public function destroy(Question $question)
    {
        $this->authorize('delete', $question->quiz);

        $question->delete();

        // Update quiz totals
        $quiz = $question->quiz;
        $quiz->update([
            'max_score' => $quiz->questions()->sum('points'),
            'total_questions' => $quiz->questions()->count(),
        ]);

        return response()->json(null, 204);
    }
}