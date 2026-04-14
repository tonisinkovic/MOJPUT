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
  kind:
    | "confidence"
    | "serenity"
    | "depression"
    | "empathy"
    | "innate_iq"
    | "personality_type"
    | "ocd_screening"
    | "bipolar_screening"
    | "therapy_need";
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
  depression?: {
    answers: number[];
    totalScore: number;
    severity: string;
  };
  empathy?: {
    /** 0 = ne slažem se, 1 = slažem se */
    answers: number[];
    totalScore: number;
    level: string;
  };
  innateIq?: {
    /** indeks odabranog odgovora 0–3 po pitanju */
    answers: number[];
    correctCount: number;
    totalQuestions: number;
    estimatedMid: number;
    bandLabel: string;
    tierLabel: string;
  };
  personalityType?: {
    /** 0 = prvi odgovor (E/S/T/J), 1 = drugi (I/N/F/P) */
    answers: number[];
    typeCode: string;
    eiScore: number;
    snScore: number;
    tfScore: number;
    jpScore: number;
  };
  ocdScreening?: {
    answers: number[];
    totalScore: number;
    severity: string;
  };
  bipolarScreening?: {
    answers: number[];
    totalScore: number;
    severity: string;
  };
  therapyNeed?: {
    /** indeks odabranog odgovora po pitanju */
    answers: number[];
    totalScore: number;
    maxScore: number;
    tier: string;
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

export function buildSamoprocjenaDepressionPayload(params: {
  answers: number[];
  totalScore: number;
  severity: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "depression",
    savedAt: new Date().toISOString(),
    depression: {
      answers: [...params.answers],
      totalScore: params.totalScore,
      severity: params.severity,
    },
  };
}

export function buildSamoprocjenaEmpathyPayload(params: {
  answers: number[];
  totalScore: number;
  level: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "empathy",
    savedAt: new Date().toISOString(),
    empathy: {
      answers: [...params.answers],
      totalScore: params.totalScore,
      level: params.level,
    },
  };
}

export function buildSamoprocjenaInnateIqPayload(params: {
  answers: number[];
  correctCount: number;
  totalQuestions: number;
  estimatedMid: number;
  bandLabel: string;
  tierLabel: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "innate_iq",
    savedAt: new Date().toISOString(),
    innateIq: {
      answers: [...params.answers],
      correctCount: params.correctCount,
      totalQuestions: params.totalQuestions,
      estimatedMid: params.estimatedMid,
      bandLabel: params.bandLabel,
      tierLabel: params.tierLabel,
    },
  };
}

export function buildSamoprocjenaPersonalityTypePayload(params: {
  answers: number[];
  typeCode: string;
  eiScore: number;
  snScore: number;
  tfScore: number;
  jpScore: number;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "personality_type",
    savedAt: new Date().toISOString(),
    personalityType: {
      answers: [...params.answers],
      typeCode: params.typeCode,
      eiScore: params.eiScore,
      snScore: params.snScore,
      tfScore: params.tfScore,
      jpScore: params.jpScore,
    },
  };
}

export function buildSamoprocjenaOcdScreeningPayload(params: {
  answers: number[];
  totalScore: number;
  severity: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "ocd_screening",
    savedAt: new Date().toISOString(),
    ocdScreening: {
      answers: [...params.answers],
      totalScore: params.totalScore,
      severity: params.severity,
    },
  };
}

export function buildSamoprocjenaBipolarScreeningPayload(params: {
  answers: number[];
  totalScore: number;
  severity: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "bipolar_screening",
    savedAt: new Date().toISOString(),
    bipolarScreening: {
      answers: [...params.answers],
      totalScore: params.totalScore,
      severity: params.severity,
    },
  };
}

export function buildSamoprocjenaTherapyNeedPayload(params: {
  answers: number[];
  totalScore: number;
  maxScore: number;
  tier: string;
}): SamoprocjenaQuizPayloadV1 {
  return {
    version: 2,
    kind: "therapy_need",
    savedAt: new Date().toISOString(),
    therapyNeed: {
      answers: [...params.answers],
      totalScore: params.totalScore,
      maxScore: params.maxScore,
      tier: params.tier,
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
