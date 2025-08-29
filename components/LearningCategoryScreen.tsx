import React from 'react';
import { QuestionSet } from '../types/questionSet';

export enum LearningCategory {
  Quiz = 'quiz',
  Dictionary = 'dictionary'
}

export interface LearningCategoryInfo {
  id: LearningCategory;
  name: string;
  description: string;
  icon: string;
}

interface LearningCategoryScreenProps {
  onCategorySelect: (category: LearningCategory) => void;
  onBack: () => void;
  questionSet: QuestionSet | null;
}

const LEARNING_CATEGORIES: LearningCategoryInfo[] = [
  {
    id: LearningCategory.Quiz,
    name: '📝 問題を解くモード',
    description: 'クイズ形式で問題を解いて理解度をチェックします。パターンを選択して集中的に学習できます。',
    icon: '🎯'
  },
  {
    id: LearningCategory.Dictionary,
    name: '📚 暗記をするモード',
    description: '問題と解答を一覧で確認しながら、辞書のように参照して暗記学習ができます。',
    icon: '📖'
  }
];

const LearningCategoryScreen: React.FC<LearningCategoryScreenProps> = ({ 
  onCategorySelect, 
  onBack, 
  questionSet 
}) => {
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
          学習方法を選択
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {questionSet?.title} をどのように学習しますか？
        </p>
      </div>

      {/* Category Selection */}
      <div className="space-y-6 mb-8">
        {LEARNING_CATEGORIES.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 
                       border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
                       rounded-lg p-8 cursor-pointer transition-all duration-200 
                       transform hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-start space-x-6">
              <div className="text-6xl">{category.icon}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          💡 <strong>推奨:</strong> 初めての方は「問題を解くモード」から始めて、慣れてきたら「暗記をするモード」で復習するのがおすすめです
        </div>
      </div>
    </div>
  );
};

export default LearningCategoryScreen;