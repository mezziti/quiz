<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\UserResponseController;
use App\Http\Controllers\DashboardController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('quizzes', QuizController::class);

    Route::get('empty', function () {
        return Inertia::render('empty');
    })->name('empty');

});

Route::post('/user-responses', [UserResponseController::class, 'store']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';