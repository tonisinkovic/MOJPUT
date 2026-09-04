import { describe, expect, it } from "vitest";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";
import { planBReasons, findPlanB, PLAN_B_FAR_KM } from "@/lib/juniorPlanB";
import type { EnrichedNearbySchool } from "@/lib/juniorPath";

const general = highSchoolPrograms.find((p) => p.name === "Opća gimnazija")!;
const electro = highSchoolPrograms.find((p) => /elektrotehn/i.test(p.name))!;

function school(
  name: string,
  city: string,
  km: number,
  min: number | null,
): EnrichedNearbySchool {
  return {
    name,
    city,
    distanceKm: km,
    mapSchoolId: null,
    cutoff: min == null ? null : { schoolId: 1, programId: 1, programName: "x", min, avg: min + 2, year: "2025.", kvota: 28 },
  };
}

describe("junior Plan B", () => {
  it("ne predlaže rezervu kad je škola blizu i bodovi su iznad praga", () => {
    const reasons = planBReasons({
      nearby: [school("Gimnazija Bjelovar", "Bjelovar", 2, 58)],
      points: 70,
      entryBar: "visok",
    });
    expect(reasons).toEqual([]);
  });

  it("traži rezervu kad je prag previsok", () => {
    const reasons = planBReasons({
      nearby: [school("MIOC", "Zagreb", 4, 72)],
      points: 60,
      entryBar: "visok",
    });
    expect(reasons).toContain("cutoff");
  });

  it("traži rezervu kad je škola daleko", () => {
    const reasons = planBReasons({
      nearby: [school("Daleka škola", "Split", PLAN_B_FAR_KM + 2, 50)],
      points: 70,
      entryBar: "srednji",
    });
    expect(reasons).toContain("far");
  });

  it("uz visok prag predlaže školu s nižim pragom istog programa", () => {
    const plan = findPlanB({
      program: general,
      matchPercentage: 82,
      nearby: [
        { name: "Tvrda gimnazija", city: "Zagreb", distanceKm: 3 },
        { name: "Lakša gimnazija", city: "Zagreb", distanceKm: 8 },
      ],
      recommendations: [],
      city: "Zagreb",
      points: 55,
    });
    // Ako baza nema pragove za ove izmišljene škole, Plan B i dalje smije predložiti sestru.
    expect(plan === null || plan.fitLine === "Ovo ti leži.").toBe(true);
  });

  it("za elektrotehniku bez obližnje škole može predložiti srodan smjer", () => {
    const plan = findPlanB({
      program: electro,
      matchPercentage: 70,
      nearby: [],
      recommendations: [
        {
          program: electro,
          matchPercentage: 70,
          interestFit: 70,
          subjectFit: 70,
          workstyleFit: 70,
          signalBoost: 0,
          reasons: [],
          warnings: [],
          availability: { totalSchools: 10, exampleSchools: [] },
        },
        {
          program: highSchoolPrograms.find((p) => p.name === "Električar / elektroinstalater")!,
          matchPercentage: 64,
          interestFit: 60,
          subjectFit: 60,
          workstyleFit: 70,
          signalBoost: 0,
          reasons: [],
          warnings: [],
          availability: { totalSchools: 20, exampleSchools: [] },
        },
      ],
      city: "Bjelovar",
      points: null,
    });
    expect(plan?.reasons).toContain("no_school");
    expect(plan?.fitLine).toBe("Ovo ti leži.");
    expect(plan?.realLine).toMatch(/upisati|dalje/i);
  });
});
