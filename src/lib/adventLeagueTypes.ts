export type AdventSeason = {
  year: number;
  startDate: string;
  endDate: string;
  timezone: string;
  scoringVersion: number;
};

export type AdventQuestionOption = {
  id: string;
  text: string;
};

export type AdventQuestion = {
  dayKey: string;
  dayNumber: number;
  questionText: string;
  options: AdventQuestionOption[];
};

export type AdventQuestionFull = AdventQuestion & {
  correctAnswer: string;
  explanation?: string;
};

export type AdventQuestionsFile = {
  questions: AdventQuestionFull[];
};

export type AdventSubmitRequest = {
  dayKey: string;
  answer: string;
  startedAt: string;
};

export type AdventAttemptRow = {
  day_key: string;
  score: number;
  correct: number | boolean;
  duration_ms: number;
  submitted_at: string;
};

export type AdventAttempt = {
  id: number;
  userId: number;
  dayKey: string;
  score: number;
  correct: boolean;
  durationMs: number;
  submittedAt: string;
};

export type AdventUserSummary = {
  totalScore: number;
  daysPlayed: number;
  playedDays: string[];
  attempts: AdventAttemptRow[];
  rank?: number;
};

export type AdventLeaderboardEntry = {
  rank: number;
  username: string;
  totalScore: number;
  daysPlayed: number;
};

export type AdventMetaPayload = {
  active: boolean;
  todayKey: string;
  message?: string;
  season?: Pick<AdventSeason, "year" | "startDate" | "endDate">;
  totalDays: number;
};

export type AdventTodayPayload = {
  dayKey: string;
  question: AdventQuestion;
};

export type AdventSubmitResult = {
  attemptId: number;
  correct: boolean;
  score: number;
  durationMs: number;
  breakdown: { baseScore: number; timeBonus: number };
  explanation?: string;
  totalScore: number;
};