export interface Yacht {
  name: string;
  builder: string;
  value: string;
  owner: string;
  flag: string;
  year_delivered: string;
  refit: string;
  length: string;
  beam: string;
  gross_tonnage: string;
  cruising_speed: string;
  top_speed: string;
  naval_architect: string;
  exterior_designer: string;
  interior_designer: string;
  rank: string;
  profile_picture: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'matching' | 'true-false' | 'image-identification' | 'ordering' | 'comparison' | 'cloze' | 'find-error';
  question: string;
  options?: string[];
  correctAnswer?: string | string[] | number | number[];
  image?: string;
  matchingPairs?: { left: string; right: string }[];
  orderItems?: string[];
  comparisonItems?: { name: string; value: string; unit: string }[];
  clozeText?: string;
  clozeOptions?: string[][];
  errorText?: string;
  errorOptions?: string[];
  explanation?: string;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: (string | string[] | number | number[])[];
  isComplete: boolean;
  timeStarted: number;
  isInfiniteMode: boolean;
  totalQuestions: number;
  correctStreak: number;
}

export interface QuizSettings {
  mode: 'standard' | 'infinite';
  questionCount: number;
}