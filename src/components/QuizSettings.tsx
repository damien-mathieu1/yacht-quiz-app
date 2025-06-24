import React, { useState } from 'react';
import { QuizSettings } from '../types/yacht';
import { Infinity, Target, Play } from 'lucide-react';

interface QuizSettingsProps {
  onStart: (settings: QuizSettings) => void;
  totalAvailableQuestions: number;
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ onStart, totalAvailableQuestions }) => {
  const [mode, setMode] = useState<'standard' | 'infinite'>('standard');
  const [questionCount, setQuestionCount] = useState(10);

  const handleStart = () => {
    onStart({ mode, questionCount });
  };

  const questionCountOptions = [5, 10, 15, 20, 25, Math.min(50, totalAvailableQuestions)];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Quiz Settings</h2>
        <p className="text-gray-600">Choose your quiz preferences</p>
      </div>

      <div className="space-y-8">
        {/* Mode Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Mode</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMode('standard')}
              className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 ${
                mode === 'standard'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Target className="w-8 h-8 mx-auto mb-3 text-current" />
              <div className="font-semibold mb-2">Standard Mode</div>
              <div className="text-sm opacity-75">Fixed number of questions with final results</div>
            </button>

            <button
              onClick={() => setMode('infinite')}
              className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 ${
                mode === 'infinite'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Infinity className="w-8 h-8 mx-auto mb-3 text-current" />
              <div className="font-semibold mb-2">Infinite Mode</div>
              <div className="text-sm opacity-75">Endless questions with instant feedback</div>
            </button>
          </div>
        </div>

        {/* Question Count Selection (only for standard mode) */}
        {mode === 'standard' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Number of Questions</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {questionCountOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 font-semibold ${
                    questionCount === count
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="text-center pt-4">
          <button
            onClick={handleStart}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSettings;