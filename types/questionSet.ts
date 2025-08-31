export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  version: string;
  author: string;
  categories: string[];
  totalQuestions: number;
  estimatedTime: string;
  coverImage?: string;
  color?: string;
  questions: Question[];
}

export interface Question {
  id: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type ContentType = 'quiz' | 'ebook' | 'slides' | 'pdf' | 'video';

export interface QuestionSetMetadata {
  id: string;
  title: string;
  description: string;
  version: string;
  author: string;
  categories: string[];
  totalQuestions: number;
  estimatedTime: string;
  coverImage?: string;
  color?: string;
  type?: ContentType;
  contentFile?: string;
  githubRepo?: string;
  pdfFile?: string;
  youtubeId?: string;
  markdownFile?: string;
}