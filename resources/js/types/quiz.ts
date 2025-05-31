export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  user_id: string
  title: string
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  total_questions: number
  score: number
  max_score: number
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  question_type: "multiple_choice" | "problem_solving"
  options?: string[]
  correct_answer: string
  explanation?: string
  points: number
  order_index: number
  created_at: string
}

export interface UserResponse {
  id: string
  quiz_id: string
  question_id: string
  user_answer: string
  is_correct: boolean
  answered_at: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  quiz?: Quiz
  questions?: Question[]
}

export interface QuizDetails {
  quiz: Quiz;
  questions: Array<Question & {
    user_responses: Pick<UserResponse, 'user_answer' | 'is_correct'>[];
  }>;
}

export interface DashboardStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalQuestions: number;
}
