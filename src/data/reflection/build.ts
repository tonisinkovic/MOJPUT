import type { ReflectionGroupId, ReflectionQuiz } from "./types";

/** Druga stavka niza znači obrnuto bodovanje. */
export type Stem = string | [string, 1];

export function quiz(
  id: ReflectionQuiz["id"],
  group: ReflectionGroupId,
  icon: string,
  title: string,
  description: string,
  keywords: string[],
  questions: Stem[],
  low: string,
  mid: string,
  high: string,
): ReflectionQuiz {
  return {
    id,
    group,
    icon,
    title,
    description,
    keywords,
    questions: questions.map((item) =>
      Array.isArray(item) ? { text: item[0], reverse: true } : { text: item },
    ),
    low,
    mid,
    high,
  };
}
