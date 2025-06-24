import React from 'react';
import { Question } from '../types/yacht';
import MultipleChoice from './questions/MultipleChoice';
import Matching from './questions/Matching';
import TrueFalse from './questions/TrueFalse';
import ImageIdentification from './questions/ImageIdentification';
import Ordering from './questions/Ordering';
import Comparison from './questions/Comparison';
import Cloze from './questions/Cloze';
import FindError from './questions/FindError';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions?: number;
  onAnswer: (answer: string | string[] | number | number[]) => void;
  userAnswer?: string | string[] | number | number[];
  isInfiniteMode?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  userAnswer,
  isInfiniteMode = false
}) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return <MultipleChoice question={question} onAnswer={onAnswer} userAnswer={userAnswer as string} />;
      case 'matching':
        return <Matching question={question} onAnswer={onAnswer} userAnswer={userAnswer as string[]} isInfiniteMode={isInfiniteMode} />;
      case 'true-false':
        return <TrueFalse question={question} onAnswer={onAnswer} userAnswer={userAnswer as string} />;
      case 'image-identification':
        return <ImageIdentification question={question} onAnswer={onAnswer} userAnswer={userAnswer as string} />;
      case 'ordering':
        return <Ordering question={question} onAnswer={onAnswer as (answer: number[]) => void} userAnswer={userAnswer as number[]} isInfiniteMode={isInfiniteMode} />;
      case 'comparison':
        return <Comparison question={question} onAnswer={onAnswer} userAnswer={userAnswer as string} />;
      case 'cloze':
        return <Cloze question={question} onAnswer={onAnswer} userAnswer={userAnswer as string[]} isInfiniteMode={isInfiniteMode} />;
      case 'find-error':
        return <FindError question={question} onAnswer={onAnswer} userAnswer={userAnswer as string} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {questionNumber}{totalQuestions ? ` of ${totalQuestions}` : ''}
          </span>
          {isInfiniteMode && (
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Infinite Mode
            </span>
          )}
          {!isInfiniteMode && totalQuestions && (
            <div className="flex space-x-1">
              {Array.from({ length: totalQuestions }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index < questionNumber ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{question.question}</h2>
        {!isInfiniteMode && totalQuestions && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        )}
      </div>
      
      {renderQuestion()}
    </div>
  );
};

export default QuestionCard;