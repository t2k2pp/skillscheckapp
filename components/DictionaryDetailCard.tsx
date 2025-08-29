import React from 'react';
import { QuizQuestion } from '../types';

interface DictionaryDetailCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const DictionaryDetailCard: React.FC<DictionaryDetailCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onBack,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}) => {
  // レベル別の色分け
  const getLevelColor = () => {
    switch (question.level) {
      case '基礎':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case '中級':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case '上級':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 transition-all duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          問題 {questionNumber} / {totalQuestions}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor()}`}>
          {question.level}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white leading-relaxed mb-6">
          📝 問題
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-6">
          <p className="text-blue-900 dark:text-blue-100 text-lg leading-relaxed">
            {question.text}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          📋 選択肢
        </h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                index === question.correctAnswerIndex
                  ? 'bg-green-100 dark:bg-green-900 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3 text-sm font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={`${
                  index === question.correctAnswerIndex
                    ? 'text-green-800 dark:text-green-200 font-semibold'
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {option}
                </span>
                {index === question.correctAnswerIndex && (
                  <span className="ml-auto text-green-600 text-xl">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          💡 解説
        </h3>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg">
          <p className="text-yellow-900 dark:text-yellow-100 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                     rounded-lg transition-colors duration-200 transform hover:scale-105"
        >
          ← 一覧に戻る
        </button>

        <div className="flex space-x-2">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-200 
                       ${hasPrevious 
                         ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105' 
                         : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
          >
            ← 前へ
          </button>
          
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-200 
                       ${hasNext 
                         ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105' 
                         : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
          >
            次へ →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictionaryDetailCard;