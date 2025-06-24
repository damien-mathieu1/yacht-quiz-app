import React from 'react';
import { Question } from '../../types/yacht';

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question, onAnswer, userAnswer }) => {
  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(option)}
          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
            userAnswer === option
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
              userAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            }`}>
              {userAnswer === option && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className="font-medium">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoice;