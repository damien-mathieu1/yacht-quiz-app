import React, { useState } from 'react';
import { Anchor, Play, Trophy, Infinity } from 'lucide-react';

interface QuizStartProps {
  onStart: (mode: 'standard' | 'infinite') => void;
  totalQuestions: number;
  isLoading: boolean;
}

const QuizStart: React.FC<QuizStartProps> = ({ onStart, totalQuestions, isLoading }) => {
  const [selectedMode, setSelectedMode] = useState<'standard' | 'infinite'>('standard');

  const handleStart = () => {
    if (!isLoading) {
      onStart(selectedMode);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
          <Anchor className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Superyacht Knowledge Quiz
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Test your knowledge about the world's most luxurious superyachts. Choose your challenge below.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Mode</h2>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setSelectedMode('standard')}
            className={`w-1/2 p-6 rounded-xl border-4 transition-all duration-200 ${selectedMode === 'standard' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}>
            <Trophy className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Standard Quiz</h3>
            <p className="text-gray-600">Complete all 20 questions and get a final score.</p>
          </button>
          <button
            onClick={() => setSelectedMode('infinite')}
            className={`w-1/2 p-6 rounded-xl border-4 transition-all duration-200 ${selectedMode === 'infinite' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}>
            <Infinity className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Infinite Mode</h3>
            <p className="text-gray-600">Answer questions endlessly and see how long you can last.</p>
          </button>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={isLoading}
        className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <Play className="w-6 h-6 mr-3" />
        {isLoading ? 'Loading Questions...' : 'Start Challenge'}
      </button>
    </div>
  );
};


export default QuizStart;