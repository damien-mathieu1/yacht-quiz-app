import React from 'react';
import { Question } from '../../types/yacht';

interface ComparisonProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
}

const Comparison: React.FC<ComparisonProps> = ({ question, onAnswer, userAnswer }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {question.comparisonItems?.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.name}</h3>

          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-center text-gray-700 font-medium">Which yacht is faster?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.comparisonItems?.map((item, index) => (
            <button
              key={index}
              onClick={() => onAnswer(item.name)}
              className={`px-6 sm:px-8 py-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${userAnswer === item.name
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
              <span className="font-semibold">{item.name}</span>
              <div className="text-sm text-gray-500 mt-1">? {item.unit}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comparison;