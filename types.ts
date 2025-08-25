
export enum QuestionLevel {
  Beginner = '基礎',
  Intermediate = '中級',
  Advanced = '上級',
}

export interface QuizQuestion {
  id: number;
  level: QuestionLevel;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface UserAnswer {
  answerIndex: number;
  timeTaken: number; // in milliseconds
}
