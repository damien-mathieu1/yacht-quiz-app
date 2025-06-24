import React from 'react';
import { Check, X, ChevronRight } from 'lucide-react';

interface FeedbackModalProps {
  isCorrect: boolean;
  explanation?: string;
  onNext: () => void;
  show: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isCorrect, explanation, onNext, show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isCorrect ? (
              <Check className="w-8 h-8 text-green-600" />
            ) : (
              <X className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 ${
            isCorrect ? 'text-green-700' : 'text-red-700'
          }`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          
          {explanation && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {explanation}
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isCorrect
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Next Question
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;