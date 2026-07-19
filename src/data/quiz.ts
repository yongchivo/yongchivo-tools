export type RoleId = 'pt' | 'soc' | 'df' | 'se' | 'grc';

export interface QuizOption {
  /** ui.ts key suffix, e.g. 'q1a' → 'quiz.q1a' */
  key: string;
  points: Partial<Record<RoleId, number>>;
}

export interface QuizQuestion {
  key: string;
  options: QuizOption[];
}

/** Display order also breaks score ties (first wins). */
export const roles: { id: RoleId; emoji: string; tools: string[] }[] = [
  { id: 'pt', emoji: '🎯', tools: ['password-strength', 'security-headers', 'password-generator'] },
  { id: 'soc', emoji: '🛡️', tools: ['subnet-calculator', 'security-headers', 'breach-check'] },
  { id: 'df', emoji: '🔍', tools: ['breach-check', 'password-strength', 'subnet-calculator'] },
  { id: 'se', emoji: '⚙️', tools: ['security-headers', 'password-generator', 'subnet-calculator'] },
  { id: 'grc', emoji: '📋', tools: ['password-strength', 'breach-check', 'password-generator'] },
];

export const questions: QuizQuestion[] = [
  {
    key: 'q1',
    options: [
      { key: 'q1a', points: { df: 2, soc: 1 } },
      { key: 'q1b', points: { soc: 2 } },
      { key: 'q1c', points: { pt: 2 } },
      { key: 'q1d', points: { se: 2, grc: 1 } },
    ],
  },
  {
    key: 'q2',
    options: [
      { key: 'q2a', points: { pt: 2 } },
      { key: 'q2b', points: { soc: 2, se: 1 } },
      { key: 'q2c', points: { df: 2 } },
      { key: 'q2d', points: { grc: 2 } },
    ],
  },
  {
    key: 'q3',
    options: [
      { key: 'q3a', points: { pt: 2 } },
      { key: 'q3b', points: { soc: 2 } },
      { key: 'q3c', points: { grc: 2, df: 1 } },
      { key: 'q3d', points: { se: 2 } },
    ],
  },
  {
    key: 'q4',
    options: [
      { key: 'q4a', points: { pt: 2 } },
      { key: 'q4b', points: { soc: 2 } },
      { key: 'q4c', points: { df: 2 } },
      { key: 'q4d', points: { se: 2 } },
    ],
  },
  {
    key: 'q5',
    options: [
      { key: 'q5a', points: { pt: 2 } },
      { key: 'q5b', points: { df: 2 } },
      { key: 'q5c', points: { grc: 2 } },
      { key: 'q5d', points: { se: 2 } },
    ],
  },
  {
    key: 'q6',
    options: [
      { key: 'q6a', points: { pt: 2 } },
      { key: 'q6b', points: { soc: 2 } },
      { key: 'q6c', points: { df: 2 } },
      { key: 'q6d', points: { se: 2 } },
    ],
  },
  {
    key: 'q7',
    options: [
      { key: 'q7a', points: { pt: 2 } },
      { key: 'q7b', points: { soc: 2 } },
      { key: 'q7c', points: { df: 2 } },
      { key: 'q7d', points: { grc: 2, se: 1 } },
    ],
  },
];
