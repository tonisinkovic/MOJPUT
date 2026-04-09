import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type { HzzV2Analysis } from "@/lib/careerQuizEngine";

export type CareerQuizResultPayloadV1 = {
  version: 1;
  interestAnswers: number[];
  competencyAnswers: number[];
  summary: {
    topCareerIds: number[];
    topCareerNames: string[];
    allRankedTopIds: number[];
    topTraits: { id: string; label: string; score: number }[];
    matchThresholdPercent: number;
    savedAt: string;
  };
};

/** Samoprocjena (/samoprocjena) — sprema se u istu tablicu kao karijerni kviz. */
export type SamoprocjenaQuizPayloadV1 = {
  version: 2;
  kind: "confidence" | "serenity";
  savedAt: string;
  confidence?: {
    answers: number[];
    averageScore: number;
    confidenceLevel: string;
    recommendation: string;
  };
  serenity?: {
    answers: number[];
    phq9Total: number;
    gad7Total: number;
    functionalScore: number | null;
    phq9Severity: string;
    gad7Severity: string;
  };
};

export type ProfileQuizPayload = CareerQuizResultPayloadV1 | SamoprocjenaQuizPayloadV1;

export function isCareerQuizPayload(p: ProfileQuizPayload): p is CareerQuizResultPayloadV1 {
  return p.version === 1;
}

export function isSamoprocjenaPayload(p: ProfileQuizPayload): p is SamoprocjenaQuizPayloadV1 {
  return p.version === 2;
}

export function buildSamoprocjenaConfidencePayload(params: {
  answers: number[];
  averageScore: number;
  confidenceLevel: string;
  recommendation: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "confidence",
    savedAt: new Date().toISOString(),
    confidence: {
      answers: [...params.answers],
      averageScore: params.averageScore,
      confidenceLevel: params.confidenceLevel,
      recommendation: params.recommendation,
    },
  };
}

export function buildSamoprocjenaSerenityPayload(params: {
  answers: number[];
  phq9Total: number;
  gad7Total: number;
  functionalScore: number | null;
  phq9Severity: string;
  gad7Severity: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "serenity",
    savedAt: new Date().toISOString(),
    serenity: {
      answers: [...params.answers],
      phq9Total: params.phq9Total,
      gad7Total: params.gad7Total,
      functionalScore: params.functionalScore,
      phq9Severity: params.phq9Severity,
      gad7Severity: params.gad7Severity,
    },
  };
}

export function buildCareerQuizPayload(
  interestAnswers: number[],
  competencyAnswers: number[],
  analysis: HzzV2Analysis,
  topTraitsSnapshot: { id: string; label: string; score: number }[],
): CareerQuizResultPayloadV1 {
  return {
    version: 1,
    interestAnswers,
    competencyAnswers,
    summary: {
      topCareerIds: analysis.recommended.map((r) => r.career.id),
      topCareerNames: analysis.recommended.map((r) => r.career.name),
      allRankedTopIds: analysis.allRanked.slice(0, 30).map((r) => r.career.id),
      topTraits: topTraitsSnapshot,
      matchThresholdPercent: analysis.matchThresholdPercent,
      savedAt: new Date().toISOString(),
    },
  };
}

export async function saveCareerQuizResult(
  payload: ProfileQuizPayload,
): Promise<ApiResponse<{ id: number }>> {
  return apiPost<{ id: number }>("/api/career-quiz/save", { payload });
}

export async function fetchLatestCareerQuizResult(): Promise<
  ApiResponse<{ id: number; created_at: string; payload: ProfileQuizPayload } | null>
> {
  return apiGet<{ id: number; created_at: string; payload: ProfileQuizPayload } | null>(
    "/api/career-quiz/latest",
  );
}

/** JSON payload za API dok korisnik nije prijavljen — upload nakon prijave. */
export const PENDING_CAREER_QUIZ_STORAGE_KEY = "mojput_pending_career_quiz_v1";

/** Kratkotrajno sprema odgovore i fazu da se nakon prijave vrati na isti ekran rezultata. */
export const QUIZ_RESTORE_STORAGE_KEY = "mojput_career_quiz_restore_v1";
