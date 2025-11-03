import React from 'react';
import { Level } from '../types';
import { LEVELS, QUESTIONS_PER_LEVEL } from '../constants';
import { StarIcon } from './Icons';

interface LevelIndicatorProps {
  level: Level;
  totalStars: number;
  questionIndex: number; // 0-based index of current question
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level, totalStars, questionIndex }) => {
  const levelInfo = LEVELS[level];
  
  const progressPercentage = ((questionIndex + 1) / QUESTIONS_PER_LEVEL) * 100;

  return (
    <div className="w-full max-w-md p-4 bg-surface rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-primary">{levelInfo.name}</h2>
        <div className="flex items-center gap-1 text-yellow-400">
          <StarIcon className="w-6 h-6" />
          <span className="text-lg font-bold text-textPrimary">{totalStars}</span>
        </div>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-4">
        <div
          className="bg-secondary h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
       <p className="text-right text-sm mt-1 text-textSecondary">
          Question {questionIndex + 1} of {QUESTIONS_PER_LEVEL}
        </p>
    </div>
  );
};

export default LevelIndicator;
