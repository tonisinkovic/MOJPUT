import type { JuniorQuizAnalysis } from "@/lib/juniorQuizEngine";

export type HomeTalk = {
  pulls: string;
  programs: string[];
  watch: string;
  parentQuestion: string;
  text: string;
};

export const buildHomeTalk = (analysis: JuniorQuizAnalysis): HomeTalk => {
  const pulls = analysis.drivers.slice(0, 2).join(" i ") || "još istražuješ što ti leži";
  const programs = analysis.recommendations.slice(0, 2).map((r) => r.program.name);
  const watch =
    analysis.recommendations[0]?.readinessNotes[0] ??
    "Zajedno pogledajte kako izgleda običan dan u ta dva programa.";
  const parentQuestion =
    programs.length >= 2
      ? `Možemo li zajedno usporediti ${programs[0]} i ${programs[1]}?`
      : programs[0]
        ? `Možemo li zajedno pogledati program ${programs[0]}?`
        : "Možemo li zajedno pogledati što kviz predlaže?";
  const text = [
    `Vuče me: ${pulls}.`,
    programs.length ? `Vrijedi pogledati: ${programs.join(" i ")}.` : "",
    `Na što obratiti pažnju: ${watch}`,
    `Pitanje za kuću: ${parentQuestion}`,
    "Ovo nije odluka — samo prijedlog iz kviza MojPut.",
  ]
    .filter(Boolean)
    .join("\n");
  return { pulls, programs, watch, parentQuestion, text };
};
