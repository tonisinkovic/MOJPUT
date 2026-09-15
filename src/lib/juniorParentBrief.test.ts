import { describe, expect, it } from "vitest";
import { analyzeJuniorQuiz, juniorQuestions, type JuniorAnswers } from "@/lib/juniorQuizEngine";
import { decodeParentBrief, encodeParentBrief, buildParentBrief } from "@/lib/juniorParentBrief";

const filledAnswers = (value: 3 | 5): JuniorAnswers => {
  const answers: JuniorAnswers = {};
  for (const q of juniorQuestions) {
    if (q.format === "scale") answers[q.id] = value;
    else if (q.format === "choice") answers[q.id] = q.options?.[0]?.id ?? "skip";
    else answers[q.id] = "skip";
  }
  return answers;
};

describe("parent brief", () => {
  it("kodira i dekodira bez gubitka programa", () => {
    const analysis = analyzeJuniorQuiz(filledAnswers(5));
    const brief = buildParentBrief(analysis, "Bjelovar", null);
    expect(brief.questions).toHaveLength(4);
    expect(brief.programs.length).toBeGreaterThan(0);
    expect(brief.pathwayWhy).toMatch(/orijentacija/i);
    const round = decodeParentBrief(encodeParentBrief(brief));
    expect(round?.programs[0]?.name).toBe(brief.programs[0].name);
    expect(round?.questions[0]).toBe(brief.questions[0]);
  });

  it("razloge piše jezikom za roditelja", () => {
    const brief = buildParentBrief(analyzeJuniorQuiz(filledAnswers(5)), null, null);
    const blob = brief.programs.flatMap((p) => p.why).join(" ");
    expect(blob.toLowerCase()).not.toMatch(/rekao\/la si da/);
  });
});
