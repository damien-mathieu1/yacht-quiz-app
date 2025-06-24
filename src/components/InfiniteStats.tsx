import React from 'react';
import { Target, Zap, Clock } from 'lucide-react';

interface InfiniteStatsProps {
  score: number;
  totalAnswered: number;
  correctStreak: number;
  timeElapsed: number;
}

const InfiniteStats: React.FC<InfiniteStatsProps> = ({ 
  score, 
  totalAnswered, 
  correctStreak, 
  timeElapsed 
}) => {
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">{accuracy}%</div>
          <div className="text-xs text-gray-500">Accuracy</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{score}/{totalAnswered}</div>
          <div className="text-xs text-gray-500">Correct</div>
        </div>
        
        <div className="text-center">
          <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">{correctStreak}</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
        
        <div className="text-center">
          <Clock className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">Time</div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteStats;