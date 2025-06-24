import React from 'react';
import { Question } from '../types/yacht';
import { Trophy, Clock, Target, RotateCcw } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  questions: Question[];
  userAnswers: (string | string[] | number | number[])[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  timeElapsed,
  questions,
  userAnswers,
  onRestart
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: 'bg-green-500' };
    if (percentage >= 80) return { text: 'Great!', color: 'bg-blue-500' };
    if (percentage >= 70) return { text: 'Good!', color: 'bg-yellow-500' };
    if (percentage >= 60) return { text: 'Fair', color: 'bg-orange-500' };
    return { text: 'Keep Learning!', color: 'bg-red-500' };
  };

  const badge = getScoreBadge();

  const isCorrectAnswer = (question: Question, userAnswer: string | string[] | number | number[]) => {
    if (question.type === 'matching' || question.type === 'ordering' || question.type === 'cloze') {
      return JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
    }
    return userAnswer === question.correctAnswer;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold mb-4 ${badge.color}`}>
          <Trophy className="w-5 h-5 mr-2" />
          {badge.text}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
        <p className="text-xl text-gray-600">Here's how you performed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}/{totalQuestions}
          </div>
          <p className="text-gray-600">Correct Answers</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-gray-600">Score</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-green-600">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <p className="text-gray-600">Time Taken</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Your Answers</h2>
        <div className="space-y-4">
          {questions.map((question, index) => {
            const isCorrect = isCorrectAnswer(question, userAnswers[index]);
            return (
              <div
                key={question.id}
                className={`p-4 rounded-xl border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{question.question}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Your answer:</strong> {
                    Array.isArray(userAnswers[index]) 
                      ? (userAnswers[index] as (string|number)[]).join(', ') 
                      : String(userAnswers[index] || 'No answer')
                  }</p>
                  <p><strong>Correct answer:</strong> {
                    Array.isArray(question.correctAnswer)
                      ? (question.correctAnswer as (string|number)[]).join(', ')
                      : String(question.correctAnswer)
                  }</p>
                  {question.explanation && (
                    <p className="mt-2 text-blue-600"><strong>Explanation:</strong> {question.explanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Take Quiz Again
        </button>
      </div>
    </div>
  );
};

export default QuizResults;