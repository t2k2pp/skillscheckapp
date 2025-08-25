import React from 'react';
import { QuizPattern } from '../types';
import { QUIZ_PATTERNS } from '../utils/quizPatterns';

interface PatternSelectionScreenProps {
  onPatternSelect: (pattern: QuizPattern) => void;
  onBack: () => void;
}

const PatternSelectionScreen: React.FC<PatternSelectionScreenProps> = ({ onPatternSelect, onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 transition-all duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          出題パターンを選択
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          学習目標や時間に応じて、最適な出題パターンを選んでください
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {QUIZ_PATTERNS.map((pattern) => (
          <div
            key={pattern.id}
            onClick={() => onPatternSelect(pattern.id)}
            className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 
                       border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600
                       rounded-lg p-6 cursor-pointer transition-all duration-200 
                       transform hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {pattern.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  {pattern.questionCount}問
                </span>
                <span className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                  {pattern.estimatedTime}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {pattern.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                     rounded-lg transition-colors duration-200 transform hover:scale-105"
        >
          ← 戻る
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          💡 推奨: 初めての方は「基礎レベルのみ」から始めることをお勧めします
        </div>
      </div>
    </div>
  );
};

export default PatternSelectionScreen;