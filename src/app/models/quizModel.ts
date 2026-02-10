export interface CodeInput {
  code: string;
  language: 'python' | 'java' | 'cpp' | 'javascript';
  fileName?: string;
}

export interface QuizPreferences {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: QuestionType[];
}

export type QuestionType = 'mcq' | 'output_prediction' | 'debugging';

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  codeSnippet?: string;
}

export interface QuizResponse {
  questions: GeneratedQuestion[];
  totalQuestions: number;
  generatedAt: Date;
}