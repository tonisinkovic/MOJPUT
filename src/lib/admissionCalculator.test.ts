import { describe, it, expect } from "vitest";
import { scoringFormulas, type ProgramScoring } from "@/data/scoringFormulas";
import {
  calculateTotal,
  chanceFromCutoff,
  componentInputKey,
  natjecanjePoints,
  parseNatjecanje,
} from "./admissionCalculator";
import { scoreWithProfile, subjectCandidates, subjectsForPrograms } from "./programCompare";

const formula: ProgramScoring = {
  programId: "test__prog",
  fakultet: "Test fakultet",
  program: "Test",
  grad: "Zagreb",
  maxBodovi: 1000,
  komponente: [
    { id: "ocjena_1", label: "Prosjek svih ocjena", max: 400, type: "ocjena", obavezno: true },
    { id: "mat_hrv", label: "Hrvatski jezik", max: 200, type: "matura", razina: "B", obavezno: true },
    { id: "mat_mat", label: "Matematika", max: 300, type: "matura", razina: "A", obavezno: true },
    { id: "izb", label: "Fizika ili Kemija", max: 100, type: "matura_izborni", razina: "A", obavezno: false },
  ],
  pragovi: { "2025": 600 },
  natjecanja: [
    { kategorija: "Državno natjecanje", disciplina: "Matematika", vrednovanje: "10,00 %" },
    { kategorija: "Međunarodno natjecanje", disciplina: "Matematika", vrednovanje: "izravan upis" },
  ],
};

const k = componentInputKey;
const full = { [k(0)]: 5, [k(1)]: 100, [k(2)]: 100, [k(3)]: 100 };

describe("calculateTotal", () => {
  it("zbraja komponente prema formuli", () => {
    const r = calculateTotal(formula, { [k(0)]: 4, [k(1)]: 50, [k(2)]: 80, [k(3)]: 0 }, { prijemniInput: 0 });
    expect(r.total).toBeCloseTo(320 + 100 + 240, 1);
    expect(r.blocked).toBe(false);
  });

  it("neuneseni prosjek ocjena daje 0, a ne bodove za ocjenu 1", () => {
    const r = calculateTotal(formula, { [k(0)]: 0 }, { prijemniInput: 0 });
    expect(r.total).toBe(0);
  });

  it("B razina iz obaveznog predmeta koji traži A blokira prijavu", () => {
    const r = calculateTotal(formula, full, { prijemniInput: 0, levels: { [k(2)]: "B" } });
    expect(r.blocked).toBe(true);
    expect(r.blockReason).toMatch(/A razini/);
  });

  it("A razina ispunjava uvjet B; B iz izbornog A predmeta daje 0 bodova", () => {
    const ok = calculateTotal(formula, full, { prijemniInput: 0, levels: { [k(1)]: "A" } });
    expect(ok.total).toBe(1000);
    const izb = calculateTotal(formula, full, { prijemniInput: 0, levels: { [k(3)]: "B" } });
    expect(izb.blocked).toBe(false);
    expect(izb.total).toBe(900);
    expect(izb.warnings.length).toBe(1);
  });

  it("natjecanje se boduje postotkom bodovnog fonda i dodaje iznad maksimuma formule", () => {
    const r = calculateTotal(formula, full, { prijemniInput: 0, natjecanjeIndex: 0 });
    expect(r.natjecanjePoints).toBe(100);
    expect(r.total).toBe(1100);
    expect(calculateTotal(formula, full, { prijemniInput: 0, natjecanjeIndex: 1 }).izravanUpis).toBe(true);
  });
});

describe("natjecanja i pragovi", () => {
  it("parsira vrednovanje s postani-student.hr", () => {
    expect(parseNatjecanje({ kategorija: "", disciplina: "", vrednovanje: "7,00 %" })).toEqual({ kind: "percent", percent: 7 });
    expect(parseNatjecanje({ kategorija: "", disciplina: "", vrednovanje: "izravan upis *" })).toEqual({ kind: "direct" });
    expect(parseNatjecanje({ kategorija: "", disciplina: "", vrednovanje: "—" })).toBeNull();
    expect(natjecanjePoints(formula, formula.natjecanja![0])).toBe(100);
  });

  it("procjena šanse prema pragu", () => {
    expect(chanceFromCutoff(700, 600)).toBe("high");
    expect(chanceFromCutoff(620, 600)).toBe("medium");
    expect(chanceFromCutoff(500, 600)).toBe("low");
    expect(chanceFromCutoff(500, null)).toBe("medium");
  });
});

describe("usporedba studija", () => {
  it("izborni predmet uzima najbolji od navedenih", () => {
    expect(subjectCandidates("Kemija ili Biologija ili Fizika *")).toEqual(["kemija", "biologija", "fizika"]);
    const row = scoreWithProfile(formula, {
      gradeAverage: 5,
      subjects: {
        "hrvatski jezik": { pct: 100, level: "B" },
        matematika: { pct: 100, level: "A" },
        fizika: { pct: 40, level: "A" },
        kemija: { pct: 90, level: "A" },
      },
    });
    expect(row.result.total).toBe(990);
    expect(row.diff).toBe(390);
  });

  it("popis predmeta: obavezni prvi", () => {
    const list = subjectsForPrograms([formula]).map((s) => s.key);
    expect(list.slice(0, 2)).toEqual(["hrvatski jezik", "matematika"]);
    expect(list).toContain("kemija");
  });
});

describe("scoringFormulas.json — ispravnost podataka", () => {
  it("programId je jedinstven", () => {
    const ids = scoringFormulas.map((f) => f.programId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("komponente pokrivaju bodovni fond (nepokriveno je u „ostali_elementi”)", () => {
    for (const f of scoringFormulas) {
      const sum = f.komponente.reduce((s, c) => s + c.max, 0);
      expect(sum, f.programId).toBeGreaterThanOrEqual(f.maxBodovi - 10);
      expect(f.potpuna === false, f.programId).toBe(f.komponente.some((c) => c.id === "ostali_elementi"));
    }
  });

  it("maksimumi komponenti i pragovi su u razumnim granicama", () => {
    for (const f of scoringFormulas) {
      expect(f.maxBodovi, f.programId).toBeGreaterThan(0);
      for (const c of f.komponente) expect(c.max, `${f.programId} ${c.label}`).toBeGreaterThanOrEqual(0);
      for (const p of Object.values(f.pragovi)) {
        if (p != null) expect(p, f.programId).toBeLessThanOrEqual(f.maxBodovi * 1.5);
      }
    }
  });

  it("razina mature je A ili B", () => {
    for (const f of scoringFormulas) {
      for (const c of f.komponente) {
        if (c.razina != null) expect(["A", "B"]).toContain(c.razina);
      }
    }
  });
});
