
import React, { useState } from 'react';
import { PythonIcon } from './Icons';
import { Level } from '../types';
import { LEVELS } from '../constants';

interface SplashScreenProps {
  onStart: (level: Level) => void;
  onOpenProgress: () => void;
  currentLevel: Level;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onOpenProgress, currentLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(currentLevel);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
      <div className="mb-8">
        <PythonIcon className="w-32 h-32 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-textPrimary mb-4">
        Welcome to <span className="text-primary">Python Quest</span>
      </h1>
      <p className="text-lg text-textSecondary max-w-xl mx-auto mb-8">
        Sharpen your Python skills with daily interview challenges. Earn stars, level up, and become a Python master!
      </p>

      <div className="w-full max-w-xs mx-auto mb-8 animate-slide-in">
        <label htmlFor="level-select" className="block text-sm font-medium text-textSecondary mb-2">
          Choose your starting level
        </label>
        <select
          id="level-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value as Level)}
          className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          {Object.values(Level).map((level) => (
            <option key={level} value={level}>
              {LEVELS[level].name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={() => onStart(selectedLevel)}
          className="px-8 py-4 bg-primary text-background font-bold text-lg rounded-xl shadow-lg hover:bg-emerald-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
        >
          Start Challenge
        </button>
        <button
            onClick={onOpenProgress}
            className="px-6 py-3 bg-surface text-textSecondary font-semibold rounded-xl hover:bg-gray-600 transition-colors"
        >
            View My Progress
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
