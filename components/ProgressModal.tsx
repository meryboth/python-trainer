import React from 'react';
import { Level, LevelStats } from '../types';
import { LockIcon, StarIcon } from './Icons';
import { LEVELS, QUESTIONS_PER_LEVEL } from '../constants';

interface ProgressModalProps {
  onClose: () => void;
  stats: Record<Level, LevelStats>;
  totalStars: number;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ onClose, stats, totalStars }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="p-6 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Your Progress</h2>
          <div className="flex items-center gap-2 text-yellow-400">
            <StarIcon className="w-7 h-7" />
            <span className="text-2xl font-bold text-textPrimary">{totalStars}</span>
          </div>
        </header>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {Object.values(Level).map((level) => {
              const levelStats = stats[level];
              const levelInfo = LEVELS[level];
              const accuracy = levelStats.attempts > 0 ? ((levelStats.totalCorrect / (levelStats.totalCorrect + levelStats.totalIncorrect)) * 100).toFixed(0) : '0';

              return (
                <div key={level} className={`p-4 rounded-lg transition-colors ${levelStats.unlocked ? 'bg-gray-800' : 'bg-gray-800 opacity-50'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-textPrimary">{levelInfo.name}</h3>
                    {!levelStats.unlocked && <LockIcon className="w-5 h-5 text-textSecondary" />}
                  </div>
                  {levelStats.unlocked ? (
                    levelStats.attempts > 0 ? (
                        <div className="mt-3 text-sm text-textSecondary grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                            <p><strong>Best:</strong> {levelStats.highScore} / {QUESTIONS_PER_LEVEL}</p>
                            <p><strong>Attempts:</strong> {levelStats.attempts}</p>
                            <p><strong>Accuracy:</strong> {accuracy}%</p>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-textSecondary">No attempts yet.</p>
                    )
                  ) : (
                    <p className="mt-3 text-sm text-textSecondary italic">Complete the previous level to unlock.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <footer className="p-4 border-t border-gray-600 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-secondary text-background font-bold rounded-lg hover:bg-violet-500 transition-colors"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProgressModal;
