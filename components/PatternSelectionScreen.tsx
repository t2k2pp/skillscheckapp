import React, { useMemo } from 'react';
import { QuizPattern, QuizQuestion } from '../types';
import { createQuizPatterns } from '../utils/quizPatterns';
import { QuestionSet } from '../types/questionSet';
import { QuestionLoader } from '../utils/questionLoader';

interface PatternSelectionScreenProps {
  onPatternSelect: (pattern: QuizPattern) => void;
  onBack: () => void;
  questionSet: QuestionSet | null;
  questions?: QuizQuestion[];
}

const PatternSelectionScreen: React.FC<PatternSelectionScreenProps> = ({ onPatternSelect, onBack, questionSet, questions = [] }) => {
  // 動的にクイズパターンを生成
  const quizPatterns = useMemo(() => {
    if (questions.length === 0) return [];
    return createQuizPatterns(questions);
  }, [questions]);

  // 問題集に応じた動的なパターン説明を生成
  const getPatternDescription = (pattern: QuizPattern): string => {
    if (!questionSet) return '';
    
    const title = questionSet.title;
    const categories = questionSet.categories;
    
    switch (pattern) {
      case QuizPattern.BeginnerOnly:
        return `${title}の基本的な概念と${categories[0] || '基礎'}レベルの問題`;
      case QuizPattern.IntermediateOnly:
        return `${title}の${categories[1] || '中級'}レベルの実践的な問題`;
      case QuizPattern.AdvancedOnly:
        return `${title}の${categories[2] || '上級'}レベルの高度な問題`;
      case QuizPattern.Balanced50:
        return `各レベルから均等に選出した50問（${categories.join('、')}）`;
      case QuizPattern.AllQuestions:
        return `すべての問題に挑戦（${categories.join('、')}すべて）`;
      default:
        return '';
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

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          出題パターンを選択
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          学習目標や時間に応じて、最適な出題パターンを選んでください
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {quizPatterns.map((pattern) => (
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
              {getPatternDescription(pattern.id) || pattern.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          💡 <strong>推奨:</strong> 初めての方は「基礎レベルのみ」から始めることをお勧めします
        </div>
      </div>
    </div>
  );
};

export default PatternSelectionScreen;