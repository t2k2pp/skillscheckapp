import { QuizPattern, QuizPatternInfo, QuizQuestion, QuestionLevel } from '../types';
import { QUESTIONS } from '../constants/questions';

// 出題パターンの定義
export const QUIZ_PATTERNS: QuizPatternInfo[] = [
  {
    id: QuizPattern.BeginnerOnly,
    name: '基礎レベルのみ',
    description: 'Dockerの基本的なコマンドと概念に関する問題',
    estimatedTime: '15-20分',
    questionCount: getQuestionCountByLevel(QuestionLevel.Beginner)
  },
  {
    id: QuizPattern.IntermediateOnly,
    name: '中級レベルのみ',
    description: 'Dockerfile、ボリューム、ネットワークに関する問題',
    estimatedTime: '20-25分',
    questionCount: getQuestionCountByLevel(QuestionLevel.Intermediate)
  },
  {
    id: QuizPattern.AdvancedOnly,
    name: '上級レベルのみ',
    description: 'Docker Compose、セキュリティ、ベストプラクティスに関する問題',
    estimatedTime: '25-30分',
    questionCount: getQuestionCountByLevel(QuestionLevel.Advanced)
  },
  {
    id: QuizPattern.Balanced50,
    name: 'バランス良く50問',
    description: '各レベルから均等に選出した50問（基礎17問、中級17問、上級16問）',
    estimatedTime: '40-50分',
    questionCount: 50
  },
  {
    id: QuizPattern.AllQuestions,
    name: '全問75問',
    description: 'すべての問題に挑戦（基礎、中級、上級すべて）',
    estimatedTime: '60-75分',
    questionCount: QUESTIONS.length
  }
];

// レベル別の問題数を取得する関数
function getQuestionCountByLevel(level: QuestionLevel): number {
  return QUESTIONS.filter(q => q.level === level).length;
}

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
export function getQuestionsByPattern(pattern: QuizPattern): QuizQuestion[] {
  switch (pattern) {
    case QuizPattern.BeginnerOnly:
      return shuffleArray(QUESTIONS.filter(q => q.level === QuestionLevel.Beginner));
      
    case QuizPattern.IntermediateOnly:
      return shuffleArray(QUESTIONS.filter(q => q.level === QuestionLevel.Intermediate));
      
    case QuizPattern.AdvancedOnly:
      return shuffleArray(QUESTIONS.filter(q => q.level === QuestionLevel.Advanced));
      
    case QuizPattern.Balanced50: {
      const beginnerQuestions = QUESTIONS.filter(q => q.level === QuestionLevel.Beginner);
      const intermediateQuestions = QUESTIONS.filter(q => q.level === QuestionLevel.Intermediate);
      const advancedQuestions = QUESTIONS.filter(q => q.level === QuestionLevel.Advanced);
      
      // 各レベルからバランス良く選択（17, 17, 16問）
      const selectedBeginner = shuffleArray(beginnerQuestions).slice(0, 17);
      const selectedIntermediate = shuffleArray(intermediateQuestions).slice(0, 17);
      const selectedAdvanced = shuffleArray(advancedQuestions).slice(0, 16);
      
      return shuffleArray([...selectedBeginner, ...selectedIntermediate, ...selectedAdvanced]);
    }
    
    case QuizPattern.AllQuestions:
    default:
      return shuffleArray(QUESTIONS);
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