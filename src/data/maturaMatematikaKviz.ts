/**
 * Ključevi za zatvorene zadatke (višestruki izbor) iz službenih rješenja NCVVO.
 * Izvor: "Rješenja ispita državne mature iz matematike", šk. god. 2024./2025., 1. rok.
 */

import { MC_QUESTIONS_MAT_A, MC_QUESTIONS_MAT_B, type McQuestion } from "@/data/maturaMatematikaPitanja";

export type MaturaMathLevel = "A" | "B";

export type MaturaMathExamConfig = {
  level: MaturaMathLevel;
  title: string;
  sessionLabel: string;
  mcQuestions: readonly McQuestion[];
  /** Točni odgovori na zadatke 1–20 (višestruki izbor) */
  mcCorrect: readonly string[];
  /** Maks. bodovi: zatvoreni dio */
  mcMaxPoints: number;
};

/** B razina */
const MC_B: readonly string[] = [
  "D",
  "C",
  "C",
  "B",
  "D",
  "C",
  "C",
  "B",
  "B",
  "D",
  "A",
  "B",
  "D",
  "C",
  "A",
  "D",
  "B",
  "D",
  "C",
  "C",
];

/** A razina */
const MC_A: readonly string[] = [
  "B",
  "C",
  "C",
  "D",
  "C",
  "D",
  "B",
  "C",
  "A",
  "D",
  "B",
  "D",
  "C",
  "A",
  "D",
  "A",
  "A",
  "B",
  "C",
  "C",
];

export const MATURA_MATEMATIKA_EXAMS: readonly MaturaMathExamConfig[] = [
  {
    level: "B",
    title: "Matematika — B razina",
    sessionLabel: "2024./2025. • 1. rok • D-S072",
    mcQuestions: MC_QUESTIONS_MAT_B,
    mcCorrect: MC_B,
    mcMaxPoints: 20,
  },
  {
    level: "A",
    title: "Matematika — A razina",
    sessionLabel: "2024./2025. • 1. rok • D-S072",
    mcQuestions: MC_QUESTIONS_MAT_A,
    mcCorrect: MC_A,
    mcMaxPoints: 20,
  },
];

export const getExamConfig = (level: MaturaMathLevel): MaturaMathExamConfig =>
  MATURA_MATEMATIKA_EXAMS.find((e) => e.level === level) ?? MATURA_MATEMATIKA_EXAMS[0];

export function scoreMc(
  user: readonly (string | null)[],
  correct: readonly string[],
): { correctCount: number; perQuestion: boolean[] } {
  const perQuestion = correct.map((c, i) => {
    const u = user[i];
    if (u == null || u === "") return false;
    return u.trim().toUpperCase() === c.trim().toUpperCase();
  });
  const correctCount = perQuestion.filter(Boolean).length;
  return { correctCount, perQuestion };
}
