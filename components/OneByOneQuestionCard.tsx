import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import SpeechButton from './SpeechButton';

interface OneByOneQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onFinish: () => void;
  onBack: () => void;
}

const OneByOneQuestionCard: React.FC<OneByOneQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onFinish,
  onBack
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions) {
      onNext();
      // Reset state for next question
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onFinish();
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswerIndex;

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
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          問題 {questionNumber} / {totalQuestions}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          レベル: <span className="font-semibold">{question.level}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <SpeechButton 
            text={question.text}
            size="md"
            ariaLabel="問題文を読み上げ"
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white leading-relaxed flex-1">
            {question.text}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
          
          if (!showResult) {
            buttonClass += "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900";
          } else {
            if (index === question.correctAnswerIndex) {
              buttonClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200";
            } else if (index === selectedAnswer) {
              buttonClass += "bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200";
            } else {
              buttonClass += "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelect(index)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3 text-sm font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-800 dark:text-white">{option}</span>
                {showResult && index === question.correctAnswerIndex && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
                {showResult && index === selectedAnswer && index !== question.correctAnswerIndex && (
                  <span className="ml-auto text-red-600">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result and Explanation */}
      {showResult && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <span className={`font-semibold ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {isCorrect ? '正解です！' : '不正解です'}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">📖 解説</h3>
              <SpeechButton 
                text={question.explanation}
                size="sm"
                ariaLabel="解説を読み上げ"
              />
            </div>
            <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                       rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            {questionNumber < totalQuestions ? '次の問題へ →' : '完了'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OneByOneQuestionCard;