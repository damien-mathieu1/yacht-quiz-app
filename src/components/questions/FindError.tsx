import React from 'react';
import { Question } from '../../types/yacht';

interface FindErrorProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
}

const FindError: React.FC<FindErrorProps> = ({ question, onAnswer, userAnswer }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <p className="text-lg text-gray-900 leading-relaxed">
          "{question.errorText}"
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-center text-gray-700 font-medium">What is wrong with this statement?</p>
        <div className="grid grid-cols-2 gap-3">
          {question.errorOptions?.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className={`p-4 text-center rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                userAnswer === option
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindError;