
import React, { useMemo } from 'react';
import { QuizQuestion, UserAnswer } from '../types';
import { QuestionSet } from '../types/questionSet';

interface ResultsScreenProps {
  userAnswers: UserAnswer[];
  questions: QuizQuestion[];
  onRestart: () => void;
  onBackToBooks: () => void;
  totalTime: number;
  questionSet?: QuestionSet | null;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.607a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}分${seconds.toString().padStart(2, '0')}秒`;
    }
    return `${seconds}秒`;
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, questions, onRestart, onBackToBooks, totalTime, questionSet }) => {
  const { score, percentage, answeredQuestions, isPartialResult } = useMemo(() => {
    const answeredQuestions = userAnswers.length;
    const totalQuestions = questions.length;
    const correctAnswers = userAnswers.filter((userAnswer, index) => userAnswer.answerIndex === questions[index].correctAnswerIndex).length;
    const isPartialResult = answeredQuestions < totalQuestions;
    
    return {
      score: correctAnswers,
      percentage: answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0,
      answeredQuestions,
      isPartialResult
    };
  }, [userAnswers, questions]);

  const getFeedback = () => {
    const subjectName = questionSet?.title?.replace(/\s*(スキルチェッカー|総合対策|コーディングスキルテスト)\s*/, '') || '選択した分野';
    
    if (percentage === 100) {
      return {
        title: '完璧です！',
        message: `素晴らしい結果です。あなたは${subjectName}の専門家レベルの知識を持っています。`
      };
    }
    if (percentage >= 80) {
      return {
        title: '優秀です！',
        message: '非常に高いスコアです。実務でも高いパフォーマンスが期待できます。'
      };
    }
    if (percentage >= 50) {
      return {
        title: '良い結果です',
        message: '基礎はしっかりと身についています。不正解だった問題を復習して、さらにスキルアップを目指しましょう。'
      };
    }
    return {
      title: 'もう少し頑張りましょう',
      message: '基礎的な部分でつまずいている可能性があります。解説をよく読んで、基本的な概念を復習することをお勧めします。'
    };
  };

  const feedback = getFeedback();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-primary dark:text-accent mb-2">
          {isPartialResult ? '途中結果' : 'テスト結果'}
        </h1>
        <p className="text-5xl font-bold my-4 text-gray-800 dark:text-gray-100">
          {score} / {answeredQuestions}
        </p>
        {isPartialResult && (
          <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
            全{questions.length}問中{answeredQuestions}問まで回答
          </p>
        )}
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
          合計時間: {formatTime(totalTime)}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-secondary to-primary dark:from-accent dark:to-yellow-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{feedback.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">{feedback.message}</p>
      </div>

      <div className="my-6">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">解答一覧</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {questions.slice(0, answeredQuestions).map((question, index) => {
              const userAnswer = userAnswers[index];
              if (!userAnswer) return null;
              const isCorrect = userAnswer.answerIndex === question.correctAnswerIndex;
              return (
                <div key={question.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{index + 1}. {question.text}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                        {isCorrect ? <CheckIcon /> : <XIcon />}
                        <p className="text-gray-700 dark:text-gray-300">
                        あなたの解答: <span className="font-medium">{question.options[userAnswer.answerIndex]}</span>
                        {!isCorrect && (
                            <> | 正解: <span className="font-medium">{question.options[question.correctAnswerIndex]}</span></>
                        )}
                        </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(userAnswer.timeTaken)}</span>
                  </div>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">{question.explanation}</p>
                </div>
              );
            })}
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <button
          onClick={onBackToBooks}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out"
        >
          📚 他の問題集を選ぶ
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-bold py-3 px-12 rounded-full shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out"
        >
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
