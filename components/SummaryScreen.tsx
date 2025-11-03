import React from 'react';
import { Level } from '../types';
import { StarIcon } from './Icons';
import { QUESTIONS_PER_LEVEL } from '../constants';

interface SummaryScreenProps {
  summaryMarkdown: string;
  level: Level;
  score: number;
  onNextLevel: () => void;
  hasNextLevel: boolean;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    return (
        <div className="text-left space-y-2">
            {lines.map((line, index) => {
                if (line.startsWith('# ')) {
                    return <h2 key={index} className="text-2xl font-bold text-primary mt-4 mb-2">{line.substring(2)}</h2>;
                }
                if (line.startsWith('## ')) {
                    return <h3 key={index} className="text-xl font-bold text-secondary mt-3 mb-1">{line.substring(3)}</h3>;
                }
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    const text = line.substring(2);
                    const parts = text.split(/(`[^`]+`)/g);
                    return (
                        <p key={index} className="flex items-start">
                            <span className="mr-2 mt-1 text-primary">•</span>
                            <span>
                                {parts.map((part, i) =>
                                    part.startsWith('`') && part.endsWith('`') ? (
                                        <code key={i} className="bg-gray-900 text-secondary px-1.5 py-0.5 rounded-md font-mono text-sm">
                                            {part.slice(1, -1)}
                                        </code>
                                    ) : (
                                        part
                                    )
                                )}
                            </span>
                        </p>
                    );
                }
                const parts = line.split(/(`[^`]+`)/g);
                return (
                    <p key={index}>
                        {parts.map((part, i) =>
                            part.startsWith('`') && part.endsWith('`') ? (
                                <code key={i} className="bg-gray-900 text-secondary px-1.5 py-0.5 rounded-md font-mono text-sm">
                                    {part.slice(1, -1)}
                                </code>
                            ) : (
                                part
                            )
                        )}
                    </p>
                );
            })}
        </div>
    );
};

const SummaryScreen: React.FC<SummaryScreenProps> = ({ summaryMarkdown, level, score, onNextLevel, hasNextLevel }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl text-center p-4 animate-fade-in">
        <StarIcon className="w-16 h-16 text-yellow-400 mb-4 animate-star-pop" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
            Level Complete!
        </h1>
        <p className="text-xl text-textSecondary mb-4">
            You've mastered the <span className="font-bold text-primary">{level}</span> challenges.
        </p>
        <div className="bg-surface p-6 rounded-xl shadow-lg w-full mb-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">Your Performance</h2>
            <p className="text-4xl font-bold text-secondary mb-6">{score} <span className="text-2xl text-textSecondary">/ {QUESTIONS_PER_LEVEL}</span></p>
            
            <div className="bg-gray-800 p-4 rounded-lg max-h-80 overflow-y-auto text-textSecondary">
                {summaryMarkdown ? <MarkdownRenderer content={summaryMarkdown} /> : <p>Loading summary...</p>}
            </div>
        </div>

      <button
        onClick={onNextLevel}
        className="px-8 py-4 bg-secondary text-background font-bold text-lg rounded-xl shadow-lg hover:bg-violet-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-opacity-50"
      >
        {hasNextLevel ? 'Start Next Level' : 'Play Again'}
      </button>
    </div>
  );
};

export default SummaryScreen;
