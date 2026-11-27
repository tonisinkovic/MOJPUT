export type ReflectionGroupId =
  | "osobnost"
  | "komunikacija"
  | "emocije"
  | "raspolozenje"
  | "ucenje"
  | "karijera"
  | "navike"
  | "tim"
  | "vrijednosti"
  | "sposobnosti"
  | "podrska";

export type ReflectionQuestion = {
  text: string;
  /** Visok rezultat znači da se tvrdnja rijetko odnosi na osobu. */
  reverse?: boolean;
};

export type ReflectionQuiz = {
  id: `ref_${string}`;
  group: ReflectionGroupId;
  icon: string;
  title: string;
  description: string;
  keywords: string[];
  questions: ReflectionQuestion[];
  low: string;
  mid: string;
  high: string;
};

export type ReflectionBand = "low" | "mid" | "high";

export const REFLECTION_BAND_LABEL: Record<ReflectionBand, string> = {
  low: "Manje izraženo",
  mid: "Uravnoteženo",
  high: "Jako izraženo",
};

export const REFLECTION_SCALE = [
  { label: "Nikad", score: 0 },
  { label: "Rijetko", score: 1 },
  { label: "Ponekad", score: 2 },
  { label: "Često", score: 3 },
  { label: "Gotovo uvijek", score: 4 },
] as const;

export function reflectionScore(answers: number[], questions: ReflectionQuestion[]) {
  let sum = 0;
  let counted = 0;
  for (let i = 0; i < questions.length; i++) {
    const raw = answers[i];
    if (raw == null || raw < 0) continue;
    const value = questions[i]?.reverse ? 4 - raw : raw;
    sum += value;
    counted += 1;
  }
  const max = counted * 4;
  const percent = max === 0 ? 0 : Math.round((sum / max) * 100);
  const band: ReflectionBand = percent < 40 ? "low" : percent < 70 ? "mid" : "high";
  return { sum, max, percent, band };
}
