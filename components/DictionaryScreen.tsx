import React, { useMemo } from 'react';
import { QuizQuestion, QuestionSummary, QuestionLevel } from '../types';
import { QuestionSet } from '../types/questionSet';

interface DictionaryScreenProps {
  questions: QuizQuestion[];
  questionSet: QuestionSet | null;
  onQuestionSelect: (questionIndex: number) => void;
  onBack: () => void;
}

const DictionaryScreen: React.FC<DictionaryScreenProps> = ({
  questions,
  questionSet,
  onQuestionSelect,
  onBack
}) => {
  // 問題のサマリーを生成（並び順はシャッフルしない）
  const questionSummaries: QuestionSummary[] = useMemo(() => {
    return questions.map((question) => ({
      id: question.id,
      shortText: question.text.length > 60 ? question.text.substring(0, 60) + '...' : question.text,
      level: question.level
    }));
  }, [questions]);

  // レベル別の色分け
  const getLevelColor = (level: QuestionLevel): string => {
    switch (level) {
      case QuestionLevel.Beginner:
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case QuestionLevel.Intermediate:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case QuestionLevel.Advanced:
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 transition-all duration-500">
      {/* Back button - 左上に配置 */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                     rounded-lg transition-colors duration-200 transform hover:scale-105"
        >
          ← 戻る
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          📚 問題一覧辞書
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {questionSet?.title} - {questions.length}問の問題から選択してください
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-800 dark:text-green-200">
            {questions.filter(q => q.level === QuestionLevel.Beginner).length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-300">基礎</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
            {questions.filter(q => q.level === QuestionLevel.Intermediate).length}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-300">中級</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-red-800 dark:text-red-200">
            {questions.filter(q => q.level === QuestionLevel.Advanced).length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-300">上級</div>
        </div>
      </div>

      {/* Question List */}
      <div className="max-h-96 overflow-y-auto mb-6">
        <div className="space-y-2">
          {questionSummaries.map((summary, index) => (
            <div
              key={summary.id}
              onClick={() => onQuestionSelect(index)}
              className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 
                         border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
                         rounded-lg p-4 cursor-pointer transition-all duration-200 
                         transform hover:scale-[1.01] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 min-w-[3rem]">
                    Q{index + 1}
                  </div>
                  <div className="text-gray-800 dark:text-white flex-1">
                    {summary.shortText}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ml-4 ${getLevelColor(summary.level)}`}>
                  {summary.level}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          💡 気になる問題をクリックして詳細を確認してください
        </div>
      </div>
    </div>
  );
};

export default DictionaryScreen;