import { apiGet, apiPost, type ApiResponse } from "@/lib/api";

export const ADVENT_QUESTIONS_PER_DAY = 10;

export type AdventClientQuestion = {
  index: number;
  questionText: string;
  type?: "choice" | "text" | "distance";
  timeLimitSec?: number;
  category?: string | null;
  unit?: string | null;
  options: { id: string; text: string }[];
};

export type AdventAnsweredQuestion = {
  questionIndex: number;
  selectedAnswer: string;
  correct: boolean;
  score: number;
  durationMs: number;
};

export type AdventStartPayload = {
  attemptId: number;
  dayKey: string;
  dayNumber: number;
  questions: AdventClientQuestion[];
  answered: AdventAnsweredQuestion[];
  completed: boolean;
  totalQuestions: number;
  serverNow: string;
};

export type AdventAnswerResult = {
  questionIndex: number;
  correct: boolean;
  score: number;
  breakdown: { baseScore: number; timeBonus: number };
  explanation?: string | null;
  detail?: string | null;
  timedOut?: boolean;
  progress: {
    answered: number;
    total: number;
    correctCount: number;
    totalScore: number;
  };
};

export type AdventCompletePayload = {
  dayKey: string;
  dayNumber?: number;
  totalScore: number;
  questionsCorrect: number;
  questionsAnswered: number;
  totalDurationMs: number;
  answers: AdventAnsweredQuestion[];
};

export type AdventMetaPayload = {
  season: {
    year: number;
    startDate: string;
    quizEndDate?: string;
    endDate: string;
    timezone: string;
    scoringVersion: number;
  };
  todayKey: string;
  active: boolean;
  quizActive?: boolean;
  totalDays: number;
  questionsPerDay: number;
  serverNow: string;
};

export type AdventPrizeDrawStatus = {
  entered: boolean;
  joinedAt?: string | null;
};

export type AdventMePayload = {
  totalScore: number;
  daysPlayed: number;
  playedDays: string[];
  scoresByDay: Record<string, number>;
  seasonRank?: number | null;
  catchUpDayKey?: string | null;
  joinDayKey?: string | null;
  prizeDraw?: AdventPrizeDrawStatus;
};

export type AdventProfileBadge = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earned: boolean;
};

export type AdventProfileCalendarDay = {
  dayNumber: number;
  dayKey: string;
  status:
    | "locked"
    | "available"
    | "played"
    | "missed"
    | "in_progress"
    | "catch_up"
    | "before_join"
    | "pre_season"
    | "christmas"
    | "final_list"
    | "after_season";
  score?: number;
  label?: string;
};

export type AdventProfileDailyResult = {
  dayKey: string;
  dayNumber: number | null;
  totalScore: number;
  questionsCorrect: number;
  questionsAnswered: number;
  submittedAt: string | null;
  startedAt: string | null;
  completed: boolean;
};

export type AdventProfilePayload = {
  season: {
    year: number;
    startDate: string;
    endDate: string;
    timezone: string;
    totalDays: number;
  };
  todayKey: string;
  totalScore: number;
  seasonRank: number | null;
  daysPlayed: number;
  quizzesCompleted: number;
  quizzesStarted: number;
  currentStreak: number;
  bestStreak: number;
  playedDays: string[];
  scoresByDay: Record<string, number>;
  badges: AdventProfileBadge[];
  calendarDays: AdventProfileCalendarDay[];
  dailyResults: AdventProfileDailyResult[];
};

export async function adventFetchMeta() {
  return apiGet<AdventMetaPayload>("/api/advent/meta");
}

export async function adventFetchMe() {
  return apiGet<AdventMePayload>("/api/advent/me");
}

export async function adventFetchProfile() {
  return apiGet<AdventProfilePayload>("/api/advent/profile");
}

export async function adventStartDay(dayKey: string) {
  return apiPost<AdventStartPayload>("/api/advent/start", { dayKey });
}

export async function adventOpenQuestion(params: { attemptId: number; dayKey: string; questionIndex: number }) {
  return apiPost<{ openedAt: string; serverNow: string; timeLimitSec: number; questionIndex: number }>(
    "/api/advent/question-open",
    params,
  );
}

export async function adventSubmitAnswer(params: {
  attemptId: number;
  dayKey: string;
  questionIndex: number;
  selectedAnswer: string;
  questionStartedAt: string;
  timedOut?: boolean;
}) {
  return apiPost<AdventAnswerResult>("/api/advent/answer", params);
}

export async function adventCompleteDay(params: { attemptId: number; dayKey: string }) {
  return apiPost<AdventCompletePayload>("/api/advent/complete", params);
}

export async function adventFetchPrizeDrawMe() {
  return apiGet<AdventPrizeDrawStatus>("/api/advent/draw/me");
}

export async function adventEnterPrizeDraw() {
  return apiPost<{ entered: boolean; already?: boolean; joinedAt?: string }>("/api/advent/draw/enter", {});
}

export function isApiError<T>(res: ApiResponse<T>): res is { success: false; message: string; code?: string } {
  return !res.success;
}