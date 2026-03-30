import { describe, it, expect } from "vitest";
import {
  calculateDormScore,
  aggregateScoreFromBreakdown,
  explainCalculation,
  pointsBelowCutoff,
  displayChance,
  estimateChanceWithoutCutoff,
  dorms,
  type DormCalculatorInput,
} from "./dormCalculator";

const zagreb = dorms.find((d) => d.id === "zagreb")!;

const baseInput = (): DormCalculatorInput => ({
  gradeAverage: 4,
  studyYear: "g2",
  meetsEcts55Average: true,
  incomeBandId: "200_240",
  distance: "eligible",
  specialIds: [],
  avgEctsPreviousYears: null,
  ectsCurrentYear: null,
  invaliditet1: false,
});

describe("calculateDormScore", () => {
  it("zbroj je zbroj agregata (bez NaN)", () => {
    const input = baseInput();
    const res = calculateDormScore(zagreb, input);
    expect(Number.isFinite(res.total)).toBe(true);
    const agg = aggregateScoreFromBreakdown(res.breakdown);
    const sum = agg.grade + agg.income + agg.distance + agg.study + agg.special;
    expect(res.total).toBeCloseTo(sum, 1);
  });

  it("ineligible_same_city: competitiveInvalid i ukupno se i dalje računa ali nije natječajno", () => {
    const input = { ...baseInput(), distance: "ineligible_same_city" as const };
    const res = calculateDormScore(zagreb, input);
    expect(res.competitiveInvalid).toBe(true);
    expect(res.warnings.length).toBeGreaterThan(0);
  });

  it("očekivani red veličine za fiksni unos (regresija)", () => {
    const input: DormCalculatorInput = {
      ...baseInput(),
      gradeAverage: 4,
      incomeBandId: "le120",
      studyYear: "g2",
      specialIds: [],
    };
    const res = calculateDormScore(zagreb, input);
    // prosjek ~ (4/3.92)*1000, prihod = 750, godina = 100
    expect(res.total).toBeGreaterThan(2000);
    expect(res.total).toBeLessThan(4000);
  });
});

describe("explainCalculation", () => {
  it("vraća isti broj koraka kao breakdown", () => {
    const input = baseInput();
    const res = calculateDormScore(zagreb, input);
    const expl = explainCalculation(zagreb, input);
    expect(expl.length).toBe(res.breakdown.length);
  });
});

describe("pointsBelowCutoff", () => {
  it("vraća razliku do praga ako si ispod", () => {
    expect(pointsBelowCutoff(1200, 1324, false)).toBe(124);
  });
  it("vraće null ako nema praga", () => {
    expect(pointsBelowCutoff(1200, null, false)).toBeNull();
  });
});

describe("displayChance / estimateChanceWithoutCutoff", () => {
  it("bez praga: viši zbroj daje jaču procjenu", () => {
    expect(estimateChanceWithoutCutoff(2700)).toBe("high");
    expect(estimateChanceWithoutCutoff(2000)).toBe("medium");
    expect(estimateChanceWithoutCutoff(1200)).toBe("low");
  });
  it("displayChance s pragom koristi usporedbu s pragom", () => {
    expect(displayChance(1500, 1324, false)).toBe("high");
    expect(displayChance(1250, 1324, false)).toBe("medium");
  });
  it("nevažeće natjecanje = nisko", () => {
    expect(displayChance(3000, null, true)).toBe("low");
  });
});
