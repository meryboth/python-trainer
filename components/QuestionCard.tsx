
import React, { useState } from 'react';
import { Question } from '../types';
import { StarIcon } from './Icons';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: string) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
  selectedAnswer,
}) => {
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-surface hover:bg-gray-600';
    }
    if (option === question.answer) {
      return 'bg-correct text-background ring-4 ring-green-300';
    }
    if (option === selectedAnswer) {
      return 'bg-incorrect text-background ring-4 ring-red-300';
    }
    return 'bg-surface opacity-60';
  };

  const codeBlockRegex = /```python\n([\s\S]*?)\n```/;
  const match = question.question.match(codeBlockRegex);
  const questionText = question.question.replace(codeBlockRegex, '').trim();

  return (
    <div className="w-full max-w-2xl p-6 bg-surface rounded-2xl shadow-xl animate-slide-in">
      <h3 className="text-xl font-semibold text-textPrimary mb-4">{questionText}</h3>
      
      {match && (
        <pre className="bg-gray-900 text-textSecondary p-4 rounded-lg overflow-x-auto mb-6 border border-gray-600">
          <code className="font-mono text-sm">{match[1]}</code>
        </pre>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            disabled={isAnswered}
            className={`p-4 rounded-lg text-left font-medium transition-all duration-300 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className={`mt-6 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-900/50 border-correct' : 'bg-red-900/50 border-incorrect'} border`}>
            <div className="flex items-center gap-3 mb-2">
                {isCorrect ? <StarIcon className="w-8 h-8 text-yellow-400" /> : <div className="w-8 h-8"></div>}
                <h4 className="text-2xl font-bold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
            </div>
          <p className="text-textSecondary">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
