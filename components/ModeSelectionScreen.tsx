import React from 'react';
import { QuizMode, QuizModeInfo } from '../types';
import { QuestionSet } from '../types/questionSet';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: QuizMode) => void;
  onBack: () => void;
  questionSet: QuestionSet | null;
}

const QUIZ_MODES: QuizModeInfo[] = [
  {
    id: QuizMode.Standard,
    name: 'スタンダードモード',
    description: 'パターンを選択してクイズ形式で学習します。時間制限があり、最後に結果が表示されます。',
    icon: '📝'
  },
  {
    id: QuizMode.OneByOne,
    name: '1問1答モード',
    description: '1問ずつ回答し、すぐに解説を確認できます。じっくり学習したい方におすすめです。',
    icon: '💡'
  },
  {
    id: QuizMode.Dictionary,
    name: '一覧辞書モード',
    description: '問題を一覧表示し、気になる問題を選んで学習できます。辞書のように使えます。',
    icon: '📚'
  }
];

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect, onBack, questionSet }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 transition-all duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          学習モードを選択
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {questionSet?.title} の学習方法を選んでください
        </p>
      </div>

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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {mode.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                     rounded-lg transition-colors duration-200 transform hover:scale-105"
        >
          ← 戻る
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          💡 推奨: 初めての方は「1問1答モード」がおすすめです
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;