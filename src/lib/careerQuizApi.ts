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
  payload: CareerQuizResultPayloadV1,
): Promise<ApiResponse<{ id: number }>> {
  return apiPost<{ id: number }>("/api/career-quiz/save", { payload });
}

export async function fetchLatestCareerQuizResult(): Promise<
  ApiResponse<{ id: number; created_at: string; payload: CareerQuizResultPayloadV1 } | null>
> {
  return apiGet<{ id: number; created_at: string; payload: CareerQuizResultPayloadV1 } | null>(
    "/api/career-quiz/latest",
  );
}

/** JSON payload za API dok korisnik nije prijavljen — upload nakon prijave. */
export const PENDING_CAREER_QUIZ_STORAGE_KEY = "mojput_pending_career_quiz_v1";

/** Kratkotrajno sprema odgovore i fazu da se nakon prijave vrati na isti ekran rezultata. */
export const QUIZ_RESTORE_STORAGE_KEY = "mojput_career_quiz_restore_v1";
