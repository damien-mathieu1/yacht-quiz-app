import React from 'react';
import { Question } from '../../types/yacht';
import { Check, X } from 'lucide-react';

interface TrueFalseProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
}

const TrueFalse: React.FC<TrueFalseProps> = ({ question, onAnswer, userAnswer }) => {
  const options = ['True', 'False'];

  return (
    <div className="flex gap-4 justify-center">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onAnswer(option)}
          className={`flex items-center justify-center px-8 py-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md min-w-[120px] ${
            userAnswer === option
              ? option === 'True'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            {option === 'True' ? (
              <Check className={`w-6 h-6 ${userAnswer === option ? 'text-green-600' : 'text-gray-400'}`} />
            ) : (
              <X className={`w-6 h-6 ${userAnswer === option ? 'text-red-600' : 'text-gray-400'}`} />
            )}
            <span className="font-semibold text-lg">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TrueFalse;