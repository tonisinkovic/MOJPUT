import { describe, expect, it } from "vitest";
import { analyzeJuniorQuiz } from "@/lib/juniorQuizEngine";
import { decodeParentBrief, encodeParentBrief, buildParentBrief } from "@/lib/juniorParentBrief";
import { juniorQuestions } from "@/lib/juniorQuizEngine";

describe("parent brief", () => {
  it("kodira i dekodira bez gubitka programa", () => {
    const answers: Record<number, number> = {};
    for (const q of juniorQuestions) answers[q.id] = 4;
    const analysis = analyzeJuniorQuiz(answers);
    const brief = buildParentBrief(analysis, "Bjelovar", null);
    expect(brief.questions).toHaveLength(4);
    expect(brief.programs.length).toBeGreaterThan(0);
    expect(brief.pathwayWhy).toMatch(/orijentacija/i);
    const round = decodeParentBrief(encodeParentBrief(brief));
    expect(round?.programs[0]?.name).toBe(brief.programs[0].name);
    expect(round?.questions[0]).toBe(brief.questions[0]);
  });

  it("razloge piše jezikom za roditelja", () => {
    const answers: Record<number, number> = {};
    for (const q of juniorQuestions) answers[q.id] = 5;
    const brief = buildParentBrief(analyzeJuniorQuiz(answers), null, null);
    const blob = brief.programs.flatMap((p) => p.why).join(" ");
    expect(blob.toLowerCase()).not.toMatch(/rekao\/la si da/);
  });
});
