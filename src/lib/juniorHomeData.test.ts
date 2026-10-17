import { describe, expect, it } from "vitest";
import {
  DEFAULT_DEMO_GRADES,
  currentYearStop,
  demoPoints,
  enrollmentYear,
  findDemoTargets,
  schoolYearLabel,
} from "@/lib/juniorHomeData";

describe("juniorHomeData", () => {
  it("godina upisa: od rujna sljedeća, inače tekuća", () => {
    expect(enrollmentYear(new Date(2026, 9, 17))).toBe(2027);
    expect(enrollmentYear(new Date(2027, 2, 1))).toBe(2027);
    expect(enrollmentYear(new Date(2027, 8, 1))).toBe(2028);
    expect(schoolYearLabel(new Date(2026, 9, 17))).toBe("2026./2027.");
  });

  it("gdje je osmaš u godini", () => {
    expect(currentYearStop(new Date(2026, 9, 1))).toBe(0);
    expect(currentYearStop(new Date(2027, 3, 1))).toBe(1);
    expect(currentYearStop(new Date(2027, 5, 10))).toBe(2);
    expect(currentYearStop(new Date(2027, 6, 10))).toBe(3);
  });

  it("zadane ocjene daju 74 od 80 bodova (stvarna formula kalkulatora)", () => {
    expect(demoPoints(DEFAULT_DEMO_GRADES)).toEqual({ ukupno: 74, max: 80 });
  });

  it("najviše ocjene daju maksimum, najniže daju mali zbroj", () => {
    const top = demoPoints({ prosjek: 5, matematika: 5, hrvatski: 5, strani: 5, posebni: 5, dodatni: 0 });
    expect(top).toEqual({ ukupno: 80, max: 80 });
    const low = demoPoints({ prosjek: 3, matematika: 2, hrvatski: 2, strani: 2, posebni: 2, dodatni: 0 });
    expect(low.ukupno).toBeLessThan(40);
  });

  it("Plan A i Plan B dolaze iz stvarnih pragova, a B ima niži prag", () => {
    const { a, b } = findDemoTargets();
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a!.min).toBeGreaterThan(b!.min);
    expect(a!.city.toLowerCase()).toBe("zagreb");
    expect(a!.programName.toLowerCase()).toContain("računa");
  });
});
