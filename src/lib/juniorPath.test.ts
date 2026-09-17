import { describe, expect, it } from "vitest";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";
import {
  chanceFor,
  comparisonMaxFor,
  computeSrednjaPoints,
  emptyGradeDraft,
  findCutoff,
  findKalkulatorSchool,
  findMapSchoolId,
  gradeDraftIsUsable,
  nextJuniorDeadline,
  officialProgramExample,
  programTypeFromPrag,
  resolveScoringTrack,
  shortlistItemKey,
} from "@/lib/juniorPath";

function perfectGrades() {
  const draft = emptyGradeDraft();
  draft.program = "gimnazija4";
  draft.prosjek5 = "5";
  draft.prosjek6 = "5";
  draft.razred7 = {
    ...draft.razred7,
    prosjek: "5",
    matematika: "5",
    hrvatski: "5",
    strani: "5",
    predmet1: "5",
    predmet2: "5",
    predmet3: "5",
  };
  draft.razred8 = {
    ...draft.razred8,
    prosjek: "5",
    matematika: "5",
    hrvatski: "5",
    strani: "5",
    predmet1: "5",
    predmet2: "5",
    predmet3: "5",
  };
  return draft;
}

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

  it("obična gimnazija ostaje na 80 i kad je lanjski max 81+", () => {
    const school = findKalkulatorSchool("Srednja škola Jure Kaštelan", "Omiš");
    const prog = school?.programs.find((p) => p.name === "Opća gimnazija");
    expect(extendedScale(school, prog)).toBe("standard");
    expect(comparisonMaxFor("gimnazija4", prog?.prag ?? null, prog?.name, school?.name)).toBe(80);
  });

  it("sportski odjel ima skalu 160, ne 80", () => {
    const school = findKalkulatorSchool("Gimnazija Bjelovar", "Bjelovar");
    const prog = school?.programs.find((p) => /sport/i.test(p.name));
    expect(resolveScoringTrack(prog!.name, school!.name, prog!.prag, prog!.sector)).toBe("sport");
    expect(comparisonMaxFor("gimnazija4", prog?.prag ?? null, prog?.name, school?.name)).toBeGreaterThanOrEqual(160);
    expect(programTypeFromPrag(prog!.prag)).toBe("gimnazija4");

    const draft = perfectGrades();
    draft.sportskiBodovi = "80";
    const r = computeSrednjaPoints(draft, {
      programName: prog!.name,
      schoolName: school!.name,
      sector: prog!.sector,
      prag: prog!.prag,
    });
    expect(r.ukupno).toBe(160);
    expect(r.scaleMax).toBeGreaterThanOrEqual(160);
    expect(r.max).toBe(80);
  });

  it("glazbenik teorijski smjer (Hatze) koristi prijamni do 260, ne 80", () => {
    const school = findKalkulatorSchool("Glazbena škola Josipa Hatzea", "Split");
    const prog = school?.programs.find((p) => /teorijski/i.test(p.name));
    expect(prog?.prag?.min).toBeGreaterThan(200);
    expect(resolveScoringTrack(prog!.name, school!.name, prog!.prag, prog!.sector)).toBe("glazba");
    expect(comparisonMaxFor("gimnazija4", prog!.prag, prog!.name, school!.name)).toBe(260);
    expect(programTypeFromPrag(prog!.prag)).toBe("gimnazija4");

    const draft = perfectGrades();
    draft.glazbenaProsjek5 = "5";
    draft.glazbenaProsjek6 = "5";
    draft.prijamniBodovi = "170";
    const r = computeSrednjaPoints(draft, {
      programName: prog!.name,
      schoolName: school!.name,
      sector: prog!.sector,
      prag: prog!.prag,
    });
    expect(r.ukupno).toBe(260);
    expect(r.scaleMax).toBe(260);
    expect(r.exam).toBe(170);
    expect(r.extraSchool).toBe(10);
    expect(r.examMissing).toBe(false);
  });

  it("plesač klasičnog baleta ima skalu 200 i prijamni prag 70", () => {
    const school = findKalkulatorSchool("Glazbena škola Josipa Hatzea", "Split");
    const prog = school?.programs.find((p) => /plesač klasičnog/i.test(p.name));
    expect(prog?.prag?.min).toBeGreaterThan(190);
    expect(resolveScoringTrack(prog!.name, school!.name, prog!.prag, prog!.sector)).toBe("ples");
    expect(comparisonMaxFor("gimnazija4", prog!.prag, prog!.name, school!.name)).toBe(200);

    const draft = perfectGrades();
    draft.plesnaProsjek = "5";
    draft.prijamniBodovi = "115";
    const r = computeSrednjaPoints(draft, {
      programName: prog!.name,
      schoolName: school!.name,
      sector: prog!.sector,
      prag: prog!.prag,
    });
    expect(r.ukupno).toBe(200);
    expect(r.scaleMax).toBe(200);
  });

  it("prijamni ispod 70 označi examBelowMin, a prazan unos examMissing", () => {
    const draft = perfectGrades();
    const ctx = {
      programName: "Glazbenik - teorijski smjer",
      schoolName: "Glazbena škola Josipa Hatzea",
      sector: "Umjetnost" as string | null,
    };
    const emptyExam = computeSrednjaPoints(draft, ctx);
    expect(emptyExam.examMissing).toBe(true);
    expect(emptyExam.ukupno).toBe(80);

    draft.prijamniBodovi = "40";
    const low = computeSrednjaPoints(draft, ctx);
    expect(low.examBelowMin).toBe(true);
    expect(low.exam).toBe(40);
  });

  it("likovna umjetnost zbraja provjeru darovitosti do 120", () => {
    const school = findKalkulatorSchool("Škola primijenjene umjetnosti i dizajna Zagreb", "Zagreb");
    const prog = school?.programs.find((p) => /likovna umjetnost/i.test(p.name));
    expect(resolveScoringTrack(prog!.name, school!.name, prog!.prag, prog!.sector)).toBe("likovna");
    expect(comparisonMaxFor("gimnazija4", prog!.prag, prog!.name, school!.name)).toBeGreaterThanOrEqual(200);

    const draft = perfectGrades();
    draft.prijamniBodovi = "120";
    const r = computeSrednjaPoints(draft, {
      programName: prog!.name,
      schoolName: school!.name,
      sector: prog!.sector,
      prag: prog!.prag,
    });
    expect(r.ukupno).toBe(200);
    expect(r.examMax).toBe(120);
  });

  it("prijamni s glazbe se ne prenosi na običnu gimnaziju", () => {
    const draft = perfectGrades();
    draft.prijamniBodovi = "170";
    draft.sportskiBodovi = "80";
    const r = computeSrednjaPoints(draft, {
      programName: "Opća gimnazija",
      schoolName: "Srednja škola Jure Kaštelan",
    });
    expect(r.track).toBe("standard");
    expect(r.ukupno).toBe(80);
    expect(r.scaleMax).toBe(80);
  });

  it("umjetnička gimnazija ostaje standardnih 80", () => {
    expect(resolveScoringTrack("Umjetnička gimnazija", "Privatna umjetnička gimnazija")).toBe("standard");
  });

  it("pripremno glazbeno ima prijamni do 180 i ne postaje kratki program", () => {
    const school = findKalkulatorSchool("Glazbena škola Josipa Hatzea", "Split");
    const prog = school?.programs.find((p) => /pripremno/i.test(p.name));
    expect(resolveScoringTrack(prog!.name, school!.name, prog!.prag, prog!.sector)).toBe("glazba_pripremno");
    expect(programTypeFromPrag(prog!.prag)).toBeNull();
    expect(comparisonMaxFor("gimnazija4", prog!.prag, prog!.name, school!.name)).toBe(180);
  });
});

function extendedScale(
  school: ReturnType<typeof findKalkulatorSchool>,
  prog: { name: string; prag: Parameters<typeof resolveScoringTrack>[2]; sector: string | null } | undefined,
) {
  return resolveScoringTrack(prog?.name ?? "", school?.name ?? "", prog?.prag ?? null, prog?.sector ?? null);
}

describe("juniorPath kalendar", () => {
  it("sljedeći rok nakon 4. 9. 2026. je završetak naknadnog roka", () => {
    const next = nextJuniorDeadline(new Date(2026, 8, 4, 8, 0, 0));
    expect(next?.title).toMatch(/završetak/i);
    expect(next?.day).toBe(30);
  });
});
