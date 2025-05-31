<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\UserResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalQuizzes = Quiz::where('user_id', Auth::id())->count();
        $completedQuizzes = Quiz::where('user_id', Auth::id())
            ->where('completed', true)
            ->count();
        $totalQuestions = Question::whereHas('quiz', function ($query) {
            $query->where('user_id', Auth::id());
        })->count();
        $totalQuestionsCorrect = UserResponse::where('user_id', Auth::id())->where('is_correct', 1)->count();
        $averageScore = $totalQuestionsCorrect > 0
        ? round(($totalQuestionsCorrect / $totalQuestions) * 100, 2)
        : 0;
        
        return Inertia('dashboard', [
            'totalQuizzes' => $totalQuizzes,
            'completedQuizzes' => $completedQuizzes,
            'totalQuestions' => $totalQuestions,
            'totalQuestionsCorrect' => $totalQuestionsCorrect,
            'averageScore' => $averageScore,
        ]);
    }
}
