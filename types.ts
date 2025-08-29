
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

export enum QuizPattern {
  BeginnerOnly = 'beginner_only',
  IntermediateOnly = 'intermediate_only', 
  AdvancedOnly = 'advanced_only',
  Balanced50 = 'balanced_50',
  AllQuestions = 'all_questions'
}

export interface QuizPatternInfo {
  id: QuizPattern;
  name: string;
  description: string;
  estimatedTime: string;
  questionCount: number;
}

// 新しいクイズモード
export enum QuizMode {
  Standard = 'standard',        // 従来の連続問題モード
  OneByOne = 'one_by_one',     // 1問1答モード（解説付き）
  Dictionary = 'dictionary'     // 一覧辞書モード
}

// モード情報
export interface QuizModeInfo {
  id: QuizMode;
  name: string;
  description: string;
  icon: string;
}

// 問題サマリー（辞書モード用）
export interface QuestionSummary {
  id: number;
  shortText: string;
  level: QuestionLevel;
}
