
export type QuestionLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: number;
  level: QuestionLevel;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  version: string;
  author: string;
  categories: string[];
  totalQuestions: number;
  estimatedTime: string;
  coverImage: string;
  color: string;
  questions: Question[];
}
