import { describe, expect, it } from "vitest";
import { buildJuniorPlan } from "@/lib/juniorPlan";
import type { JuniorQuizSnapshot } from "@/lib/juniorPath";

const snap = (over: Partial<JuniorQuizSnapshot> = {}): JuniorQuizSnapshot => ({
  savedAt: "2026-03-10T10:00:00.000Z",
  city: "Split",
  confidence: { level: "medium", score: 62, explanation: "ok" },
  pathway: {
    academicScore: 48,
    practicalScore: 55,
    direction: "balanced",
    title: "Mješoviti put",
    explanation: "Objašnjenje",
  },
  topInterests: [],
  topSubjects: [
    { category: "biologija", label: "Biologija", score: 80 },
    { category: "kemija_fizika", label: "Kemija i fizika", score: 70 },
    { category: "matematika", label: "Matematika", score: 60 },
  ],
  recommendations: [
    {
      id: 10,
      name: "Medicinska sestra / medicinski tehničar",
      type: "tehnicka",
      duration: 4,
      matchPercentage: 88,
      afterSchool: "Posao ili faks",
      entryBar: "srednji",
    },
  ],
  ...over,
});

describe("buildJuniorPlan", () => {
  it("bez kviza nudi kviz kao prvi korak", () => {
    const steps = buildJuniorPlan({
      snapshot: null,
      shortlistCount: 0,
      hasGrades: false,
      from: new Date(2026, 2, 12),
    });
    expect(steps[0]?.id).toBe("quiz");
    expect(steps.length).toBeGreaterThanOrEqual(3);
    expect(steps.length).toBeLessThanOrEqual(5);
  });

  it("u ožujku spominje predmete ovog mjeseca i svibanj", () => {
    const steps = buildJuniorPlan({
      snapshot: snap(),
      shortlistCount: 2,
      hasGrades: true,
      from: new Date(2026, 2, 12),
    });
    expect(steps.some((s) => s.id === "subjects")).toBe(true);
    expect(steps.find((s) => s.id === "subjects")?.title).toMatch(/Biologija/);
    expect(steps.some((s) => /svibanj/i.test(s.when) || /prijav/i.test(s.title))).toBe(true);
  });

  it("prazna lista traži spremanje škola", () => {
    const steps = buildJuniorPlan({
      snapshot: snap(),
      shortlistCount: 0,
      hasGrades: true,
      from: new Date(2026, 2, 12),
    });
    expect(steps.some((s) => s.id === "shortlist")).toBe(true);
  });
});
