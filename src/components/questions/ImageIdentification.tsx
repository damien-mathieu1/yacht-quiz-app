import React from 'react';
import { Question } from '../../types/yacht';

interface ImageIdentificationProps {
  question: Question;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
}

const ImageIdentification: React.FC<ImageIdentificationProps> = ({ question, onAnswer, userAnswer }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <img
          src={question.image}
          alt="Yacht to identify"
          className="max-w-full h-64 object-cover rounded-xl shadow-lg"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className={`p-4 text-center rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
              userAnswer === option
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageIdentification;