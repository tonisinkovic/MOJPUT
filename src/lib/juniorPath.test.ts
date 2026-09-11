import { describe, expect, it } from "vitest";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";
import {
  chanceFor,
  comparisonMaxFor,
  computeSrednjaPoints,
  emptyGradeDraft,
  extendedScaleKind,
  findCutoff,
  findKalkulatorSchool,
  findMapSchoolId,
  gradeDraftIsUsable,
  nextJuniorDeadline,
  officialProgramExample,
  programTypeFromPrag,
  shortlistItemKey,
} from "@/lib/juniorPath";

describe("juniorPath matching", () => {
  it("nalazi Gimnaziju Bjelovar i prag za opću gimnaziju", () => {
    const school = findKalkulatorSchool("Gimnazija Bjelovar", "Bjelovar");
    expect(school?.name).toMatch(/Gimnazija Bjelovar/i);

    const program = highSchoolPrograms.find((p) => p.name === "Opća gimnazija");
    expect(program).toBeTruthy();
    const cutoff = findCutoff("Gimnazija Bjelovar", "Bjelovar", program!);
    expect(cutoff?.min).toEqual(expect.any(Number));
    expect(cutoff?.programName.toLowerCase()).toContain("opća");
  });

  it("povezuje školu s kartom po imenu i gradu", () => {
    const id = findMapSchoolId("Gimnazija Bjelovar", "Bjelovar");
    expect(id).toMatch(/^ss-/);
  });

  it("za glazbenu pokazuje službeni naziv iz kalkulatora", () => {
    const program = highSchoolPrograms.find((p) => /glazben/i.test(p.name));
    expect(program).toBeTruthy();
    const official = officialProgramExample(program!);
    expect(official?.name.toLowerCase()).toMatch(/glazbenik/);
    expect(official?.schoolId).toEqual(expect.any(Number));
    expect(official?.programId).toEqual(expect.any(Number));
  });

  it("shortlist ključ je stabilan bez obzira na veličina slova", () => {
    expect(shortlistItemKey("Gimnazija Bjelovar", "Bjelovar", 1)).toBe(
      shortlistItemKey("gimnazija bjelovar", "bjelovar", 1),
    );
  });
});

describe("juniorPath bodovi i šansa", () => {
  it("računa bodove kao kalkulator (4×prosjek + ključni + posebni)", () => {
    const draft = emptyGradeDraft();
    draft.program = "gimnazija4";
    draft.prosjek5 = "5";
    draft.prosjek6 = "5";
    draft.razred7 = { ...draft.razred7, prosjek: "5", matematika: "5", hrvatski: "5", strani: "5", predmet1: "5", predmet2: "5", predmet3: "5" };
    draft.razred8 = { ...draft.razred8, prosjek: "5", matematika: "5", hrvatski: "5", strani: "5", predmet1: "5", predmet2: "5", predmet3: "5" };
    const r = computeSrednjaPoints(draft);
    expect(r.ukupno).toBe(80);
    expect(r.max).toBe(80);
  });

  it("draft je upotrebljiv tek s dva prosjeka", () => {
    const empty = emptyGradeDraft();
    expect(gradeDraftIsUsable(empty)).toBe(false);
    empty.prosjek5 = "4.2";
    empty.prosjek6 = "4.5";
    expect(gradeDraftIsUsable(empty)).toBe(true);
  });

  it("šansa prati razmak od praga", () => {
    expect(chanceFor(70, 60).tone).toBe("emerald");
    expect(chanceFor(61, 60).tone).toBe("lime");
    expect(chanceFor(58, 60).tone).toBe("amber");
    expect(chanceFor(50, 60).tone).toBe("rose");
  });

  it("sportski odjel ima lanjski max iznad 80 pa skala nije 80", () => {
    const school = findKalkulatorSchool("Gimnazija Bjelovar", "Bjelovar");
    const prog = school?.programs.find((p) => /sport/i.test(p.name));
    expect(prog?.prag?.max).toBeGreaterThan(80);
    expect(prog?.prag?.min).toBeGreaterThan(80);
    expect(comparisonMaxFor("gimnazija4", prog?.prag ?? null)).toBe(prog?.prag?.max);
    expect(extendedScaleKind(prog!.name, prog!.prag, "gimnazija4", school!.name)).toBe("sport");
    expect(programTypeFromPrag(prog!.prag)).toBe("gimnazija4");
  });

  it("obična gimnazija ostaje na 80 ako lanjski max nije veći", () => {
    const school = findKalkulatorSchool("Gimnazija Bjelovar", "Bjelovar");
    const prog = school?.programs.find((p) => p.name === "Opća gimnazija");
    expect(prog?.prag?.max).toBe(80);
    expect(comparisonMaxFor("gimnazija4", prog?.prag ?? null)).toBe(80);
    expect(extendedScaleKind(prog!.name, prog!.prag)).toBeNull();
  });

  it("glazbeni smjer koristi lanjski max (prijemni), a tip ostaje 4-godišnji", () => {
    const school = findKalkulatorSchool("Glazbena škola Vatroslava Lisinskog Bjelovar", "Bjelovar");
    const prog = school?.programs.find((p) => /kornist/i.test(p.name));
    expect(prog?.prag?.max).toBeGreaterThan(200);
    expect(comparisonMaxFor("gimnazija4", prog?.prag ?? null)).toBe(prog?.prag?.max);
    expect(extendedScaleKind(prog!.name, prog!.prag, "gimnazija4", school!.name)).toBe("umjetnost");
    expect(programTypeFromPrag(prog!.prag)).toBe("gimnazija4");
  });

  it("natjecanja malo iznad 80 (npr. 91) nisu prijemni, ali skala prati prag", () => {
    const prag = {
      year: "2025/2026",
      kvota: 50,
      upisani: 50,
      min: 86.92,
      avg: 79.71,
      max: 91.75,
    };
    expect(comparisonMaxFor("gimnazija4", prag)).toBe(91.75);
    expect(extendedScaleKind("Prirodoslovno-matematička gimnazija", prag)).toBe("natjecanja");
    expect(programTypeFromPrag(prag)).toBe("gimnazija4");
  });
});

describe("juniorPath kalendar", () => {
  it("sljedeći rok nakon 4. 9. 2026. je završetak naknadnog roka", () => {
    const next = nextJuniorDeadline(new Date(2026, 8, 4, 8, 0, 0));
    expect(next?.title).toMatch(/završetak/i);
    expect(next?.day).toBe(30);
  });
});
