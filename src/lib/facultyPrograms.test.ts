import { describe, expect, it } from "vitest";
import { scoringFormulas } from "@/data/scoringFormulas";
import { expandAliasQuery } from "./facultyAliases";
import { facultyCatalog } from "./facultyCatalog";
import { facultySummaryText, getFacultyPrograms, programVariantTags } from "./facultyPrograms";

describe("getFacultyPrograms", () => {
  it("FER ima programe, pragove i link na kalkulator", () => {
    const fer = facultyCatalog.find((f) => /elektrotehnike i računarstva/i.test(f.name) && f.city === "Zagreb");
    expect(fer).toBeDefined();
    const s = getFacultyPrograms(fer!);
    expect(s.programs.length).toBeGreaterThan(0);
    expect(s.programs.some((p) => p.programId)).toBe(true);
    expect(s.minCutoff).not.toBeNull();
  });

  it("većina profila u katalogu ima barem jedan program", () => {
    const withPrograms = facultyCatalog.filter((f) => getFacultyPrograms(f).programs.length > 0).length;
    expect(withPrograms / facultyCatalog.length).toBeGreaterThan(0.8);
  });

  it("izdvaja oznake izvanrednih i stručnih varijanti", () => {
    expect(programVariantTags("Ekonomija (izvanredni, stručni)")).toEqual(["izvanredni", "stručni"]);
    expect(programVariantTags("Računarstvo (Hrvati izvan RH)")).toEqual(["Hrvati izvan RH"]);
    expect(programVariantTags("Filozofija (jednopredmetni)")).toEqual([]);
  });

  it("većina redovnih programa s profila vodi na kalkulator", () => {
    let total = 0;
    let linked = 0;
    for (const f of facultyCatalog) {
      for (const p of getFacultyPrograms(f).programs.filter((row) => row.tags.length === 0)) {
        total++;
        if (p.programId) linked++;
      }
    }
    expect(linked / total).toBeGreaterThan(0.9);
  });

  it("link na kalkulator po nazivu učilišta pronalazi njegove programe", () => {
    const haystacks = scoringFormulas.map((f) => `${f.fakultet} ${f.program} ${f.grad}`.toLowerCase());
    const withFormulas = facultyCatalog.filter((f) => getFacultyPrograms(f).programs.some((p) => p.programId));
    const misses = withFormulas.filter((f) => {
      const words = expandAliasQuery(f.name.toLowerCase()).split(/\s+/);
      return !haystacks.some((h) => words.every((w) => h.includes(w)));
    });
    expect(misses.map((f) => f.name)).toEqual([]);
  });

  it("nepoznato učilište vraća prazan sažetak", () => {
    const s = getFacultyPrograms({ name: "Nepostojeći fakultet", city: "Zagreb" });
    expect(s.programs).toEqual([]);
    expect(facultySummaryText({ name: "Nepostojeći fakultet", city: "Zagreb", university: "" }, s)).toMatch(
      /još nemamo popis/,
    );
  });
});
