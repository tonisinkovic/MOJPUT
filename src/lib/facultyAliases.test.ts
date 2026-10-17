import { describe, expect, it } from "vitest";
import { expandAliasQuery, facultySearchQuery, pickSearchableFaculty } from "./facultyAliases";
import { scoringFormulas } from "@/data/scoringFormulas";
import studyProgramsJson from "@/data/career-quiz/study-programs.json";

const haystacks = scoringFormulas.map((f) => `${f.fakultet} ${f.program} ${f.grad}`.toLowerCase());

function calculatorHits(label: string): number {
  const words = expandAliasQuery(facultySearchQuery(label)).split(/\s+/);
  return haystacks.filter((h) => words.every((w) => h.includes(w))).length;
}

describe("facultySearchQuery", () => {
  it("širi kraticu i dodaje grad", () => {
    expect(facultySearchQuery("FER (Zagreb)")).toBe("elektrotehnike i računarstva zagreb");
    expect(facultySearchQuery("PMF (Split)")).toBe("prirodoslovno-matematički split");
    expect(facultySearchQuery("EFST (Split)")).toBe("ekonomski split");
  });

  it("ne dodaje grad kad je navedeno više gradova", () => {
    expect(facultySearchQuery("Pomorski fakulteti (Rijeka, Split)")).toBe("pomorski fakulteti");
  });

  it("nepoznate oznake vraća bez zagrada", () => {
    expect(facultySearchQuery("Geodetski fakultet (Zagreb)")).toBe("geodetski fakultet zagreb");
  });
});

describe("expandAliasQuery", () => {
  it("širi samo cijelu kraticu na početku", () => {
    expect(expandAliasQuery("FER")).toBe("elektrotehnike i računarstva zagreb");
    expect(expandAliasQuery("ferit")).toBe("računarstva informacijskih tehnologija osijek");
    expect(expandAliasQuery("medicina")).toBe("medicina");
  });
});

describe("pickSearchableFaculty", () => {
  it("preskače skupne oznake", () => {
    expect(pickSearchableFaculty(["Veleučilišta", "Pomorski fakulteti (Rijeka, Split)", "FPZ (Zagreb)"])).toBe(
      "FPZ (Zagreb)",
    );
    expect(pickSearchableFaculty(["Veleučilišta"])).toBeUndefined();
  });
});

describe("linkovi iz kviza prema kalkulatoru", () => {
  const programs = studyProgramsJson.programs as { name: string; faculties: string[] }[];

  it("odabrani fakultet svakog studija iz kviza ima rezultate u kalkulatoru", () => {
    const misses = programs
      .map((p) => ({ name: p.name, label: pickSearchableFaculty(p.faculties) }))
      .filter((x) => x.label && calculatorHits(x.label) === 0);
    expect(misses).toEqual([]);
  });

  it("gotovo svaki studij ima barem jedan fakultet za link", () => {
    const without = programs.filter((p) => !pickSearchableFaculty(p.faculties)).map((p) => p.name);
    expect(without.length).toBeLessThanOrEqual(2);
  });

  it.each(["FER (Zagreb)", "ERF (Zagreb)", "RGN fakultet (Zagreb)", "TTF (Zagreb)", "FPZ (Zagreb)", "PFRI (Rijeka)"])(
    "%s ima rezultate",
    (label) => {
      expect(calculatorHits(label)).toBeGreaterThan(0);
    },
  );
});
