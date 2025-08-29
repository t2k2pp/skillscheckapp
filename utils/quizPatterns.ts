import { QuizPattern, QuizPatternInfo, QuizQuestion, QuestionLevel } from '../types';

// 出題パターンの定義を動的な問題リストに基づいて生成する関数
export function createQuizPatterns(questions: QuizQuestion[]): QuizPatternInfo[] {
  const getQuestionCountByLevel = (level: QuestionLevel): number => {
    return questions.filter(q => q.level === level).length;
  };

  return [
    {
      id: QuizPattern.BeginnerOnly,
      name: '基礎レベルのみ',
      description: '基本的なコマンドと概念に関する問題',
      estimatedTime: '15-20分',
      questionCount: getQuestionCountByLevel(QuestionLevel.Beginner)
    },
    {
      id: QuizPattern.IntermediateOnly,
      name: '中級レベルのみ',
      description: '実践的な応用問題',
      estimatedTime: '20-25分',
      questionCount: getQuestionCountByLevel(QuestionLevel.Intermediate)
    },
    {
      id: QuizPattern.AdvancedOnly,
      name: '上級レベルのみ',
      description: '高度な知識と実践的な問題',
      estimatedTime: '25-30分',
      questionCount: getQuestionCountByLevel(QuestionLevel.Advanced)
    },
    {
      id: QuizPattern.Balanced50,
      name: 'バランス良く50問',
      description: '各レベルから均等に選出した50問',
      estimatedTime: '40-50分',
      questionCount: Math.min(50, questions.length)
    },
    {
      id: QuizPattern.AllQuestions,
      name: `全問${questions.length}問`,
      description: 'すべての問題に挑戦（全レベル）',
      estimatedTime: '60-75分',
      questionCount: questions.length
    }
  ];
}

// 後方互換性のための空の配列（実際の値は動的に生成される）
export const QUIZ_PATTERNS: QuizPatternInfo[] = [];

// Fisher-Yates (aka Knuth) Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// パターンに応じて問題をフィルタリング・選択する関数
export function getQuestionsByPattern(pattern: QuizPattern, questions: QuizQuestion[]): QuizQuestion[] {
  switch (pattern) {
    case QuizPattern.BeginnerOnly:
      return shuffleArray(questions.filter(q => q.level === QuestionLevel.Beginner));
      
    case QuizPattern.IntermediateOnly:
      return shuffleArray(questions.filter(q => q.level === QuestionLevel.Intermediate));
      
    case QuizPattern.AdvancedOnly:
      return shuffleArray(questions.filter(q => q.level === QuestionLevel.Advanced));
      
    case QuizPattern.Balanced50: {
      const beginnerQuestions = questions.filter(q => q.level === QuestionLevel.Beginner);
      const intermediateQuestions = questions.filter(q => q.level === QuestionLevel.Intermediate);
      const advancedQuestions = questions.filter(q => q.level === QuestionLevel.Advanced);
      
      // 各レベルから均等に選択（最大50問になるよう調整）
      const totalAvailable = beginnerQuestions.length + intermediateQuestions.length + advancedQuestions.length;
      const targetCount = Math.min(50, totalAvailable);
      
      // 3レベルに均等配分
      const perLevel = Math.floor(targetCount / 3);
      const remainder = targetCount % 3;
      
      const selectedBeginner = shuffleArray(beginnerQuestions).slice(0, Math.min(perLevel + (remainder > 0 ? 1 : 0), beginnerQuestions.length));
      const selectedIntermediate = shuffleArray(intermediateQuestions).slice(0, Math.min(perLevel + (remainder > 1 ? 1 : 0), intermediateQuestions.length));
      const selectedAdvanced = shuffleArray(advancedQuestions).slice(0, Math.min(perLevel, advancedQuestions.length));
      
      return shuffleArray([...selectedBeginner, ...selectedIntermediate, ...selectedAdvanced]);
    }
    
    case QuizPattern.AllQuestions:
    default:
      return shuffleArray(questions);
  }
}

// 各問題の選択肢をシャッフルする関数
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  const correctAnswerText = question.options[question.correctAnswerIndex];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
  
  return {
    ...question,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectAnswerIndex,
  };
}