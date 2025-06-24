import React, { useState, useEffect } from 'react';
import { Question } from '../../types/yacht';

interface MatchingProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  userAnswer?: string[];
  isInfiniteMode?: boolean;
}

const Matching: React.FC<MatchingProps> = ({ question, onAnswer, userAnswer, isInfiniteMode }) => {
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);

  useEffect(() => {
    if (userAnswer) {
      setMatches(userAnswer);
    } else {
      setMatches(new Array(question.matchingPairs?.length || 0).fill(''));
    }
  }, [userAnswer, question.matchingPairs]);

  const handleLeftClick = (index: number) => {
    setSelectedLeft(index);
  };

  const handleRightClick = (rightItem: string) => {
    if (selectedLeft !== null) {
      const newMatches = [...matches];
      newMatches[selectedLeft] = rightItem;
      setMatches(newMatches);
      if (!isInfiniteMode) {
        onAnswer(newMatches);
      }
      setSelectedLeft(null);
    }
  };

  const rightOptions = question.matchingPairs?.map(pair => pair.right) || [];

  const handleSubmit = () => {
    onAnswer(matches);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 mb-4">Yachts</h3>
        {question.matchingPairs?.map((pair, index) => (
          <button
            key={index}
            onClick={() => handleLeftClick(index)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              selectedLeft === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{pair.left}</span>
              {matches[index] && (
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  → {matches[index]}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 mb-4">Owners</h3>
        {rightOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleRightClick(option)}
            disabled={matches.includes(option)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              matches.includes(option)
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
            }`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
      </div>
      {isInfiniteMode && (
        <div className="text-center pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={matches.some(match => !match)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Matches
          </button>
        </div>
      )}
    </div>
  );
};

export default Matching;