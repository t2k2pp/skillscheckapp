
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuestionLevel } from '../types';
import SpeechButton from './SpeechButton';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  onEarlyFinish: () => void;
}

const getLevelColor = (level: QuestionLevel) => {
  switch (level) {
    case QuestionLevel.Beginner:
      return 'bg-green-100 text-green-800';
    case QuestionLevel.Intermediate:
      return 'bg-blue-100 text-blue-800';
    case QuestionLevel.Advanced:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, totalQuestions, onAnswer, onEarlyFinish }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };
  
  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    setTimeout(() => {
      onAnswer(selectedOption);
    }, 500);
  };
  
  const getOptionClasses = (index: number) => {
    let baseClasses = 'w-full text-left p-4 my-2 border-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer text-gray-700 dark:text-gray-200';
    if (isAnswered) {
      if (index === question.correctAnswerIndex) {
        return `${baseClasses} bg-green-200 border-green-500 dark:bg-green-700 dark:border-green-500`;
      }
      if (index === selectedOption) {
        return `${baseClasses} bg-red-200 border-red-500 dark:bg-red-700 dark:border-red-500`;
      }
      return `${baseClasses} border-gray-300 dark:border-gray-600 opacity-60`;
    }

    if (selectedOption === index) {
      return `${baseClasses} bg-secondary/30 border-secondary dark:bg-secondary/50 dark:border-accent`;
    }
    
    return `${baseClasses} border-gray-300 dark:border-gray-600 hover:border-secondary hover:bg-secondary/10 dark:hover:border-accent dark:hover:bg-accent/10`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getLevelColor(question.level)}`}>
          {question.level}
        </span>
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          問題 {questionNumber} / {totalQuestions}
        </span>
      </div>
      <div className="flex items-start gap-3 mb-6">
        <SpeechButton 
          text={question.text}
          size="md"
          ariaLabel="問題文を読み上げ"
        />
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex-1">{question.text}</p>
      </div>
      
      <div className="flex flex-col items-center">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className={getOptionClasses(index)}
            disabled={isAnswered}
          >
            <span className="font-mono bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 mr-3">{String.fromCharCode(65 + index)}</span>
            {option}
          </button>
        ))}
      </div>
      
      <div className="mt-8 text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || isAnswered}
          className="w-full sm:w-auto bg-primary hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-full shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out"
        >
          {questionNumber === totalQuestions ? '結果を見る' : '次の問題へ'}
        </button>
        <button
          onClick={() => {
            // 回答が選択されている場合は、その回答を含めて終了
            if (selectedOption !== null) {
              onAnswer(selectedOption);
            } else {
              onEarlyFinish();
            }
          }}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out"
        >
          📊 途中で終了
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
