import { Level } from './types';

export const QUESTIONS_PER_LEVEL = 10;

export const LEVELS: Record<Level, { name: string; description: string; next: Level | null }> = {
  [Level.Junior_1]: { name: 'Junior I', description: 'fundamental concepts like variables, basic data types (strings, integers), and print statements.', next: Level.Junior_2 },
  [Level.Junior_2]: { name: 'Junior II', description: 'control flow (if/else statements, for/while loops) and basic list/dictionary operations.', next: Level.Mid_1 },
  [Level.Mid_1]: { name: 'Mid-Level I', description: 'functions, scope, and more complex data structures like tuples and sets.', next: Level.Mid_2 },
  [Level.Mid_2]: { name: 'Mid-Level II', description: 'list comprehensions, lambdas, and object-oriented programming (OOP) basics.', next: Level.Senior_1 },
  [Level.Senior_1]: { name: 'Senior I', description: 'advanced OOP concepts, decorators, generators, and error handling.', next: Level.Senior_2 },
  [Level.Senior_2]: { name: 'Senior II', description: 'concurrency, performance optimization, and standard library modules like collections or itertools.', next: Level.Principal },
  [Level.Principal]: { name: 'Principal', description: 'complex architectural patterns, metaprogramming, and Python internals.', next: null },
};
