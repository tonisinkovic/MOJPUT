import type { AdventAnsweredQuestion, AdventAnswerResult, AdventClientQuestion } from "@/lib/adventLeagueApi";
import { ADVENT_QUESTIONS_PER_DAY } from "@/lib/adventLeagueApi";

export type AdventQuizPhase =
  | "loading"
  | "error"
  | "playing"
  | "confirm"
  | "submitting"
  | "feedback"
  | "completing"
  | "results";

export type AnsweredMap = Record<number, AdventAnsweredQuestion & Partial<AdventAnswerResult>>;

export function firstUnansweredIndex(answered: AnsweredMap, total = ADVENT_QUESTIONS_PER_DAY): number {
  for (let i = 0; i < total; i++) {
    if (!answered[i]) return i;
  }
  return total;
}

export function mergeAnsweredFromServer(rows: AdventAnsweredQuestion[]): AnsweredMap {
  const map: AnsweredMap = {};
  for (const row of rows) {
    map[row.questionIndex] = row;
  }
  return map;
}

export function questionByIndex(questions: AdventClientQuestion[], index: number): AdventClientQuestion | null {
  return questions.find((q) => q.index === index) ?? questions[index] ?? null;
}

export function allQuestionsAnswered(answered: AnsweredMap, total = ADVENT_QUESTIONS_PER_DAY): boolean {
  return firstUnansweredIndex(answered, total) >= total;
}