import React from 'react';
import { QuizQuestion } from '../types';
import { QuestionSet } from '../types/questionSet';

export enum QuizModeType {
  OneByOne = 'one_by_one',
  Standard = 'standard', 
  AllQuestions = 'all_questions'
}

export interface QuizModeTypeInfo {
  id: QuizModeType;
  name: string;
  description: string;
  icon: string;
  estimatedTime?: string;
}

interface QuizModeSelectionScreenProps {
  onModeSelect: (mode: QuizModeType) => void;
  onBack: () => void;
  questionSet: QuestionSet | null;
  questions: QuizQuestion[];
}

const QuizModeSelectionScreen: React.FC<QuizModeSelectionScreenProps> = ({ 
  onModeSelect, 
  onBack, 
  questionSet,
  questions 
}) => {
  const QUIZ_MODES: QuizModeTypeInfo[] = [
    {
      id: QuizModeType.OneByOne,
      name: '💡 1問1答モード',
      description: '1問ずつ回答し、すぐに解説を確認できます。じっくり理解しながら学習したい方におすすめです。',
      icon: '🔍',
      estimatedTime: '制限なし'
    },
    {
      id: QuizModeType.Standard,
      name: '📝 スタンダードモード', 
      description: 'レベル別やバランス型など、パターンを選択してクイズ形式で学習します。集中して取り組みたい方向けです。',
      icon: '⚡',
      estimatedTime: '15-75分'
    },
    {
      id: QuizModeType.AllQuestions,
      name: `🚀 全${questions.length}問モード`,
      description: 'すべての問題にクイズ形式で挑戦します。総合的な理解度をチェックしたい方におすすめです。',
      icon: '🎯',
      estimatedTime: '60-75分'
    }
  ];

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
          問題を解くモードを選択
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {questionSet?.title} - どのように問題に取り組みますか？
        </p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-4 mb-8">
        {QUIZ_MODES.map((mode) => (
          <div
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 
                       border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
                       rounded-lg p-6 cursor-pointer transition-all duration-200 
                       transform hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{mode.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {mode.name}
                  </h3>
                  {mode.estimatedTime && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                      {mode.estimatedTime}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          💡 <strong>推奨:</strong> 初めての学習には「1問1答モード」がおすすめです
        </div>
      </div>
    </div>
  );
};

export default QuizModeSelectionScreen;