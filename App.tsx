
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Level, PlayerProgress, Question } from './types';
import { generatePythonQuestion, generateLevelSummary } from './services/geminiService';
import { LEVELS, QUESTIONS_PER_LEVEL, initialLevelStats, PASSING_SCORE } from './constants';
import SplashScreen from './components/SplashScreen';
import LevelIndicator from './components/LevelIndicator';
import QuestionCard from './components/QuestionCard';
import SummaryScreen from './components/SummaryScreen';
import ProgressModal from './components/ProgressModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SPLASH);
  const [progress, setProgress] = useState<PlayerProgress>({
    currentLevel: Level.Junior_1,
    totalStars: 0,
    seenQuestions: [],
    levelStats: initialLevelStats,
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);


  // State for current level progress
  const [questionIndex, setQuestionIndex] = useState(0); // 0 to 9
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);
  const [levelCorrectAnswers, setLevelCorrectAnswers] = useState(0);
  const [levelSummary, setLevelSummary] = useState('');

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('pythonQuestProgress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Migration for old data structure
        if (parsed.level && !parsed.levelStats) {
            const migratedStats = { ...initialLevelStats };
            let levelReached = false;
            for (const level of Object.values(Level)) {
                if (levelReached) {
                    migratedStats[level].unlocked = false;
                } else {
                    migratedStats[level].unlocked = true;
                }
                if (level === parsed.level) {
                    levelReached = true;
                }
            }
            setProgress({
                currentLevel: parsed.level,
                totalStars: parsed.totalStars,
                seenQuestions: parsed.seenQuestions || [],
                levelStats: migratedStats,
            });
        } else if (parsed.currentLevel && parsed.levelStats) {
           setProgress(parsed);
        } else {
           localStorage.removeItem('pythonQuestProgress');
        }
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
      localStorage.removeItem('pythonQuestProgress');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pythonQuestProgress', JSON.stringify(progress));
    } catch(e) {
      console.error("Failed to save progress to localStorage", e);
    }
  }, [progress]);
  
  const fetchQuestion = useCallback(async (levelToFetch: Level) => {
    setGameState(GameState.LOADING);
    setError(null);
    setCurrentQuestion(null);
    try {
      const question = await generatePythonQuestion(levelToFetch, progress.seenQuestions);
      setCurrentQuestion(question);
      setGameState(GameState.PLAYING);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setGameState(GameState.ERROR);
    }
  }, [progress.seenQuestions]);


  const handleStart = (level: Level) => {
    setQuestionIndex(0);
    setLevelQuestions([]);
    setLevelCorrectAnswers(0);
    setProgress(prev => ({ ...prev, currentLevel: level }));
    fetchQuestion(level);
  };

  const handleAnswer = (selectedOption: string) => {
    if (!currentQuestion) return;

    const correct = selectedOption === currentQuestion.answer;
    setSelectedAnswer(selectedOption);
    setIsCorrect(correct);
    setGameState(GameState.ANSWERED);
    setLevelQuestions(prev => [...prev, currentQuestion]);

    const updatedSeenQuestions = [...progress.seenQuestions, currentQuestion.question];

    if (correct) {
      setLevelCorrectAnswers(prev => prev + 1);
      setProgress(prev => ({
        ...prev,
        totalStars: prev.totalStars + 1,
        seenQuestions: updatedSeenQuestions,
      }));
    } else {
        setProgress(prev => ({
            ...prev,
            seenQuestions: updatedSeenQuestions,
        }));
    }
  };
  
  const handleNext = async () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (questionIndex < QUESTIONS_PER_LEVEL - 1) {
      setQuestionIndex(prev => prev + 1);
      fetchQuestion(progress.currentLevel);
    } else {
      setGameState(GameState.LOADING);
      try {
        const summary = await generateLevelSummary([...levelQuestions, currentQuestion!]);
        setLevelSummary(summary);
        
        const currentLevel = progress.currentLevel;
        const score = levelCorrectAnswers;

        setProgress(prev => {
            const newStats = { ...prev.levelStats };
            const currentLevelStats = newStats[currentLevel];
            
            newStats[currentLevel] = {
                ...currentLevelStats,
                attempts: currentLevelStats.attempts + 1,
                totalCorrect: currentLevelStats.totalCorrect + score,
                totalIncorrect: currentLevelStats.totalIncorrect + (QUESTIONS_PER_LEVEL - score),
                highScore: Math.max(currentLevelStats.highScore, score),
            };

            const nextLevel = LEVELS[currentLevel].next;
            if (score >= PASSING_SCORE && nextLevel) {
                newStats[nextLevel] = { ...newStats[nextLevel], unlocked: true };
            }

            return { ...prev, levelStats: newStats };
        });

        setGameState(GameState.SUMMARY);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setGameState(GameState.ERROR);
      }
    }
  };
  
  const handleStartNextLevel = () => {
    const currentLevelInfo = LEVELS[progress.currentLevel];
    const nextLevel = currentLevelInfo.next;

    if (nextLevel && progress.levelStats[nextLevel].unlocked) {
      setProgress(prev => ({ ...prev, currentLevel: nextLevel, }));
      setQuestionIndex(0);
      setLevelQuestions([]);
      setLevelCorrectAnswers(0);
      setLevelSummary('');
      fetchQuestion(nextLevel);
    } else {
      setGameState(GameState.SPLASH);
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.SPLASH:
        return <SplashScreen onStart={handleStart} onOpenProgress={() => setIsProgressModalOpen(true)} currentLevel={progress.currentLevel} />;
      case GameState.LOADING:
        return <div className="flex items-center justify-center h-full"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;
      case GameState.PLAYING:
      case GameState.ANSWERED:
        return currentQuestion && (
            <div className="flex flex-col items-center gap-8 w-full px-4">
              <LevelIndicator currentLevel={progress.currentLevel} totalStars={progress.totalStars} questionIndex={questionIndex} />
              <QuestionCard 
                question={currentQuestion}
                onAnswer={handleAnswer}
                isAnswered={gameState === GameState.ANSWERED}
                isCorrect={isCorrect}
                selectedAnswer={selectedAnswer}
              />
              {gameState === GameState.ANSWERED && (
                <button
                  onClick={handleNext}
                  className="mt-4 px-8 py-3 bg-secondary text-background font-bold text-lg rounded-xl shadow-lg hover:bg-violet-500 transition-transform transform hover:scale-105"
                >
                  {questionIndex < QUESTIONS_PER_LEVEL - 1 ? 'Next Question' : 'Finish Level'}
                </button>
              )}
            </div>
        );
      case GameState.SUMMARY:
          const hasNextLevel = !!LEVELS[progress.currentLevel]?.next && progress.levelStats[LEVELS[progress.currentLevel].next!].unlocked;
          return <SummaryScreen 
                    summaryMarkdown={levelSummary} 
                    level={progress.currentLevel} 
                    score={levelCorrectAnswers} 
                    onNextLevel={hasNextLevel ? handleStartNextLevel : () => setGameState(GameState.SPLASH)}
                    hasNextLevel={hasNextLevel}
                 />
      case GameState.ERROR:
        return (
          <div className="text-center p-4">
            <h2 className="text-2xl text-incorrect mb-4">Oops! Something went wrong.</h2>
            <p className="text-textSecondary mb-6">{error}</p>
            <button
              onClick={() => fetchQuestion(progress.currentLevel)}
              className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:bg-emerald-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {isProgressModalOpen && <ProgressModal onClose={() => setIsProgressModalOpen(false)} stats={progress.levelStats} totalStars={progress.totalStars} />}
      {renderContent()}
    </main>
  );
};

export default App;
