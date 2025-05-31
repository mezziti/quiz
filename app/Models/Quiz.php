<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'title',
        'topic',
        'difficulty',
        'total_questions',
        'score',
        'max_score',
        'completed',
        'analysis',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'difficulty' => 'string',
        'options' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function userResponses()
    {
        return $this->hasMany(UserResponse::class);
    }
}