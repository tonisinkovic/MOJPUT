import { apiGet, apiPut, apiDelete, apiPost, getStoredAuthToken, type ApiResponse } from "@/lib/api";
import { API_BASE_URL } from "@/config/apiBase";

export type AdventAdminSeason = {
  year: number;
  startDate: string;
  endDate: string;
  timezone: string;
  scoringVersion: number;
};

export type AdventAdminDayListItem = {
  dayKey: string;
  dayNumber: number;
  title: string;
  active: boolean;
  questionCount: number;
};

export type AdventAdminQuestion = {
  index: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  category?: string;
  explanation?: string | null;
  difficulty?: number;
};

export type AdventImportPreviewRow = {
  lineNumber: number;
  status: "ready" | "duplicate" | "error";
  dayKey: string | null;
  dayNumber: number | null;
  questionIndex: number | null;
  questionPreview: {
    text: string;
    correctAnswer: string;
    category?: string;
    difficulty?: number;
  } | null;
  errors: string[];
  warnings: string[];
};

export type AdventImportPreviewPayload = {
  ok: boolean;
  rows: AdventImportPreviewRow[];
  summary: { total: number; ready: number; duplicate: number; error: number };
  template?: string;
  headersFound?: string[];
};

export type AdventImportConfirmResult = {
  ok: boolean;
  imported: number;
  skipped: number;
  errors: { lineNumber: number; messages: string[] }[];
  message: string;
};

export type AdventAdminDay = {
  dayKey: string;
  dayNumber: number;
  title: string;
  active: boolean;
  questions: AdventAdminQuestion[];
};

export type AdventAdminDailyStats = {
  dayKey: string;
  uniquePlayers: number;
  attempts: number;
  completed: number;
  avgScore: number;
};

export type AdventAdminTodaySnapshot = {
  dayKey: string;
  uniquePlayers: number;
  attempts: number;
  completed: number;
  avgScoreCompleted: number;
};

export type AdventAdminNextDayReturn = {
  previousDayKey: string;
  todayDayKey: string;
  previousDayCompleters: number;
  returnedPlayers: number;
  returnRate: number | null;
};

export type AdventAdminReferralStats = {
  totalVisits: number;
  totalSignups: number;
  referrersWithCodes: number;
  visitsLast7Days: number;
  signupsLast7Days: number;
  topReferrers: { code: string; username: string; visits: number; signups: number }[];
};

export type AdventAdminStats = {
  totalParticipants: number;
  completedAttempts: number;
  avgCompletedScore: number;
  returningPlayers: number;
  todaySnapshot: AdventAdminTodaySnapshot | null;
  nextDayReturn: AdventAdminNextDayReturn | null;
  dailyStats: AdventAdminDailyStats[];
  referrals?: AdventAdminReferralStats;
};

export async function adminFetchSeason() {
  return apiGet<AdventAdminSeason>("/api/admin/advent/season");
}

export async function adminUpdateSeason(season: AdventAdminSeason) {
  return apiPut<AdventAdminSeason>("/api/admin/advent/season", season);
}

export async function adminFetchDaysList() {
  return apiGet<AdventAdminDayListItem[]>("/api/admin/advent/days");
}

export async function adminFetchDay(dayKey: string) {
  return apiGet<AdventAdminDay>(`/api/admin/advent/days/${dayKey}`);
}

export async function adminUpsertDay(params: {
  dayKey: string;
  dayNumber: number;
  title: string;
  active: boolean;
}) {
  return apiPut<AdventAdminDay & { created: boolean }>(`/api/admin/advent/days/${params.dayKey}`, params);
}

export async function adminUpsertQuestion(dayKey: string, question: AdventAdminQuestion) {
  return apiPut<AdventAdminQuestion & { created: boolean }>(
    `/api/admin/advent/days/${dayKey}/questions/${question.index}`,
    question,
  );
}

export async function adminDeleteQuestion(dayKey: string, questionIndex: number) {
  return apiDelete(`/api/admin/advent/days/${dayKey}/questions/${questionIndex}`);
}

export async function adminFetchStats() {
  return apiGet<AdventAdminStats>("/api/admin/advent/stats");
}

export function isAdminApiError<T>(res: ApiResponse<T>): res is { success: false; message: string } {
  return !res.success;
}

export async function adminPreviewImport(csv: string) {
  return apiPost<AdventImportPreviewPayload>("/api/admin/advent/import/preview", { csv });
}

export async function adminConfirmImport(params: {
  csv: string;
  overwriteDuplicates?: boolean;
  createMissingDays?: boolean;
  lineNumbers?: number[];
}) {
  return apiPost<AdventImportConfirmResult>("/api/admin/advent/import/confirm", params);
}

export async function adminFetchImportTemplate() {
  const headers: Record<string, string> = { Accept: "text/csv" };
  const token = getStoredAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api/admin/advent/import/template`, {
    method: "GET",
    credentials: "include",
    headers,
  });
  return res;
}
