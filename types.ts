export enum GameState {
  SPLASH,
  LOADING,
  PLAYING,
  ANSWERED,
  SUMMARY,
  ERROR,
}

export enum Level {
  Junior_1 = 'Junior I',
  Junior_2 = 'Junior II',
  Mid_1 = 'Mid-Level I',
  Mid_2 = 'Mid-Level II',
  Senior_1 = 'Senior I',
  Senior_2 = 'Senior II',
  Principal = 'Principal',
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface LevelStats {
  unlocked: boolean;
  highScore: number;
  attempts: number;
  totalCorrect: number;
  totalIncorrect: number;
}

export interface PlayerProgress {
  currentLevel: Level;
  totalStars: number;
  seenQuestions: string[];
  levelStats: Record<Level, LevelStats>;
}
