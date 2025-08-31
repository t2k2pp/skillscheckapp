import React, { useState } from 'react';
import { Question, QuestionLevel } from '../types';
import { TrashIcon, ChevronDownIcon } from './icons';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onQuestionChange: (id: number, updatedQuestion: Question) => void;
  onDeleteQuestion: (id: number) => void;
  accentColor: string;
  viewMode: 'list' | 'card';
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, index, onQuestionChange, onDeleteQuestion, accentColor, viewMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isCardView = viewMode === 'card';
  const isContentVisible = isCardView || isOpen;

  const handleFieldChange = (field: keyof Question, value: any) => {
    onQuestionChange(question.id, { ...question, [field]: value });
  };
  
  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    handleFieldChange('options', newOptions);
  };

  const handleCorrectAnswerChange = (optionIndex: number) => {
    handleFieldChange('correctAnswerIndex', optionIndex);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 flex flex-col ${isCardView ? 'h-full' : ''}`}>
      <div 
        className={`p-4 flex justify-between items-center ${isCardView ? '' : 'cursor-pointer'}`}
        onClick={isCardView ? undefined : () => setIsOpen(!isOpen)}
        style={{ borderLeft: `4px solid ${accentColor}` }}
      >
        <h3 className="font-semibold text-gray-800 truncate">
          <span className="text-gray-500 mr-2">{index + 1}.</span> {question.text || 'New Question'}
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteQuestion(question.id);
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Delete question"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          {!isCardView && (
            <ChevronDownIcon className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {isContentVisible && (
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea
                value={question.text}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                rows={3}
                className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Level</label>
              <select
                value={question.level}
                onChange={(e) => handleFieldChange('level', e.target.value as QuestionLevel)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Options & Correct Answer</label>
              <div className="mt-2 space-y-3">
                {question.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`correct-answer-${question.id}`}
                      checked={question.correctAnswerIndex === i}
                      onChange={() => handleCorrectAnswerChange(i)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      style={{ accentColor: accentColor }}
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Explanation</label>
              <textarea
                value={question.explanation}
                onChange={(e) => handleFieldChange('explanation', e.target.value)}
                rows={4}
                className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};