import React, { useState, useEffect } from 'react';
import { Question } from '../../types/yacht';

interface ClozeProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  userAnswer?: string[];
  isInfiniteMode?: boolean;
}

const Cloze: React.FC<ClozeProps> = ({ question, onAnswer, userAnswer, isInfiniteMode }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (userAnswer) {
      setSelectedOptions(userAnswer);
    } else {
      setSelectedOptions(new Array(question.clozeOptions?.length || 0).fill(''));
    }
  }, [userAnswer, question.clozeOptions]);

  const handleOptionSelect = (blankIndex: number, option: string) => {
    const newSelections = [...selectedOptions];
    newSelections[blankIndex] = option;
    setSelectedOptions(newSelections);
    if (!isInfiniteMode) {
      onAnswer(newSelections);
    }
  };

  const renderClozeText = () => {
    if (!question.clozeText) return null;

    const parts = question.clozeText.split('[BLANK]');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(
        <span key={`text-${i}`} className="text-gray-900">
          {parts[i]}
        </span>
      );

      if (i < parts.length - 1) {
        result.push(
          <select
            key={`blank-${i}`}
            value={selectedOptions[i] || ''}
            onChange={(e) => handleOptionSelect(i, e.target.value)}
            className="mx-2 px-3 py-1 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="">Select...</option>
            {question.clozeOptions?.[i]?.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
    }

    return result;
  };

  const handleSubmit = () => {
    onAnswer(selectedOptions);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <p className="text-lg leading-relaxed">
          {renderClozeText()}
        </p>
      </div>
      {isInfiniteMode && (
        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={selectedOptions.some(opt => !opt)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Cloze;