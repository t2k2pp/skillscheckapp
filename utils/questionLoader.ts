import { QuestionSet, Question } from '../types/questionSet';
import { QuizQuestion, QuestionLevel } from '../types';

export class QuestionLoader {
  static async loadQuestionSet(id: string): Promise<QuestionSet> {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}question-sets/${id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load question set: ${id}`);
      }
      const questionSet: QuestionSet = await response.json();
      return questionSet;
    } catch (error) {
      console.error(`Error loading question set ${id}:`, error);
      throw error;
    }
  }

  static convertToQuizQuestions(questions: Question[]): QuizQuestion[] {
    return questions.map(q => ({
      id: q.id,
      level: this.convertLevel(q.level),
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));
  }

  private static convertLevel(level: string): QuestionLevel {
    switch (level) {
      case 'beginner':
        return QuestionLevel.Beginner;
      case 'intermediate':
        return QuestionLevel.Intermediate;
      case 'advanced':
        return QuestionLevel.Advanced;
      default:
        return QuestionLevel.Beginner;
    }
  }

  static async getAvailableQuestionSets(): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}question-sets/index.json`);
      if (!response.ok) {
        throw new Error('Failed to load question sets index');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading question sets index:', error);
      throw error;
    }
  }
}