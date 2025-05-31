<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_type',
        'options',
        'correct_answer',
        'explanation',
        'points',
        'order_index'
    ];

    protected $casts = [
        'options' => 'array'
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function userResponses()
    {
        return $this->hasMany(UserResponse::class);
    }
}