import { describe, it, expect } from "vitest";
import {
  calculateDormScore,
  aggregateScoreFromBreakdown,
  explainCalculation,
  pointsBelowCutoff,
  displayChance,
  estimateChanceWithoutCutoff,
  latestCutoff,
  dorms,
  effectiveReference,
  type DormCalculatorInput,
} from "./dormCalculator";
import { getCohortCenter, resolveCohortReference } from "./dormCohortAverages";
import cohortData from "@/data/dormCohortAverages.json";

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

  it("fiksni unos (regresija): 4 / 3,80 × 1000 + 750 + 100 bez odabranog učilišta", () => {
    const input: DormCalculatorInput = {
      ...baseInput(),
      gradeAverage: 4,
      incomeBandId: "le120",
      studyYear: "g2",
      specialIds: [],
    };
    const res = calculateDormScore(zagreb, input);
    expect(res.total).toBeCloseTo((4 / 3.8) * 1000 + 750 + 100, 0);
  });
});

describe("Pravilnik NN 68/2023 i 77/2024", () => {
  const grade = (input: DormCalculatorInput) =>
    calculateDormScore(zagreb, input).breakdown.find((l) => l.key === "grade")!.points;

  it("bodovi za prosjek nemaju gornju granicu od 1000 (čl. 11.)", () => {
    expect(grade({ ...baseInput(), gradeAverage: 4.8, referenceAverage: 4 })).toBeCloseTo(1200, 0);
  });

  it("vlastiti prosjek skupine zamjenjuje referentni prosjek centra", () => {
    expect(grade({ ...baseInput(), gradeAverage: 4, referenceAverage: 3.2 })).toBeCloseTo(1250, 0);
    expect(grade({ ...baseInput(), gradeAverage: 4, referenceAverage: null })).toBeCloseTo((4 / 3.8) * 1000, 0);
  });

  it("maturant se uspoređuje sa službenim prosjekom svih brucoša centra", () => {
    const maturant = { ...baseInput(), gradeAverage: 4.5, studyYear: "maturant" as const };
    expect(grade(maturant)).toBeCloseTo((4.5 / 4.406) * 1000, 0);
    const split = dorms.find((d) => d.id === "split")!;
    expect(calculateDormScore(split, maturant).breakdown[0].points).toBeCloseTo((4.5 / 4.215) * 1000, 0);
  });

  it("student koristi službeni prosjek svog učilišta i razine", () => {
    const fer = { ...baseInput(), institution: { dormId: "zagreb", code: "36" } };
    expect(grade(fer)).toBeCloseTo((4 / 3.463) * 1000, 0);
    expect(grade({ ...fer, studyLevel: "diplomski" })).toBeCloseTo((4 / 3.584) * 1000, 0);
    expect(grade({ ...fer, referenceAverage: 4 })).toBeCloseTo(1000, 0);
  });

  it("odabir učilišta iz drugog centra se ignorira; koristi se prosjek razine tog centra", () => {
    const split = dorms.find((d) => d.id === "split")!;
    const input = { ...baseInput(), institution: { dormId: "zagreb", code: "13" } };
    const ref = effectiveReference(split, input);
    expect(ref.source).toBe("center_level");
    expect(ref.value).toBe(3.503);
  });

  it("kad učilište nema podatak za diplomski, uzima se druga diplomska kolona pa prosjek centra", () => {
    const osijekPravni = resolveCohortReference("osijek", {
      studyYear: "g5",
      studyLevel: "diplomski",
      institution: { dormId: "osijek", code: "111" },
    });
    expect(osijekPravni?.value).toBe(4.441);
    const splitPravniDipl = resolveCohortReference("split", {
      studyYear: "g4",
      studyLevel: "diplomskiUpis",
      institution: { dormId: "split", code: "18" },
    });
    expect(splitPravniDipl?.source).toBe("center_level");
    expect(splitPravniDipl?.value).toBe(3.612);
  });

  it("umanjenje za ECTS prethodnih godina ne vrijedi za maturante i prvu godinu", () => {
    const withEcts = { avgEctsPreviousYears: 45, referenceAverage: 4 };
    expect(grade({ ...baseInput(), ...withEcts, gradeAverage: 4, studyYear: "g3" })).toBeCloseTo(800, 0);
    expect(grade({ ...baseInput(), ...withEcts, gradeAverage: 4, studyYear: "g1" })).toBeCloseTo(1000, 0);
    expect(grade({ ...baseInput(), ...withEcts, gradeAverage: 4, studyYear: "maturant" })).toBeCloseTo(1000, 0);
  });

  it("18–30 ECTS u tekućoj godini umanjuje za još 10 %, ali ne maturantima", () => {
    const base = { ...baseInput(), gradeAverage: 4, referenceAverage: 4, ectsCurrentYear: 25 };
    expect(grade({ ...base, studyYear: "g3", avgEctsPreviousYears: 45 })).toBeCloseTo(720, 0);
    expect(grade({ ...base, studyYear: "maturant" })).toBeCloseTo(1000, 0);
  });

  it("zajamčena minimalna naknada zamjenjuje bodove za prihod", () => {
    const res = calculateDormScore(zagreb, {
      ...baseInput(),
      incomeBandId: "le120",
      specialIds: ["minimalna_naknada"],
    });
    const agg = aggregateScoreFromBreakdown(res.breakdown);
    expect(agg.income).toBe(0);
    expect(agg.special).toBe(750);
  });

  it("prihod iznad proračunske osnovice ne donosi bodove", () => {
    const res = calculateDormScore(zagreb, { ...baseInput(), incomeBandId: "iznad_po" });
    expect(aggregateScoreFromBreakdown(res.breakdown).income).toBe(0);
  });

  it("braća i sestre: boduje se samo jača od dvije osnove", () => {
    const special = (siblings: number, siblingsWithCare: number) =>
      aggregateScoreFromBreakdown(
        calculateDormScore(zagreb, { ...baseInput(), siblings, siblingsWithCare }).breakdown,
      ).special;
    expect(special(2, 0)).toBe(300);
    expect(special(2, 1)).toBe(300);
    expect(special(1, 1)).toBe(200);
  });

  it("razvedeni roditelji ne idu uz preminulog roditelja", () => {
    const res = calculateDormScore(zagreb, {
      ...baseInput(),
      specialIds: ["jedan_roditelj", "razvedeni_roditelji"],
    });
    expect(aggregateScoreFromBreakdown(res.breakdown).special).toBe(600);
  });

  it("djeca, roditelji s oštećenjem, nagrade i opomena", () => {
    const res = calculateDormScore(zagreb, {
      ...baseInput(),
      studyYear: "g3",
      children: 2,
      parentsDisabled100: 1,
      studentAward: "dekan",
      ects58CurrentYear: true,
      opomena: true,
    });
    const agg = aggregateScoreFromBreakdown(res.breakdown);
    expect(agg.special).toBe(1000 + 200 + 200 - 200);
    expect(agg.study).toBe(150 + 100);
  });

  it("matura i natjecanja boduju se samo maturantima", () => {
    const awards = { maturaResult: "gt90" as const, competitionAward: "medjunarodna" as const };
    const maturant = calculateDormScore(zagreb, { ...baseInput(), studyYear: "maturant", ...awards });
    expect(aggregateScoreFromBreakdown(maturant.breakdown).special).toBe(700);
    const student = calculateDormScore(zagreb, { ...baseInput(), studyYear: "g2", ...awards });
    expect(aggregateScoreFromBreakdown(student.breakdown).special).toBe(0);
  });

  it("izravno pravo prema izvrsnosti traži prihod do proračunske osnovice", () => {
    const excellent = { ...baseInput(), gradeAverage: 4.6, ectsCurrentYear: 60, studyYear: "g3" as const };
    expect(calculateDormScore(zagreb, excellent).izravnoPravo).toHaveLength(1);
    expect(calculateDormScore(zagreb, { ...excellent, incomeBandId: "iznad_po" }).izravnoPravo).toHaveLength(0);
    expect(
      calculateDormScore(zagreb, { ...baseInput(), studyYear: "maturant", gradeAverage: 5 }).izravnoPravo,
    ).toHaveLength(1);
  });

  it("premalo ECTS-a isključuje iz natječaja", () => {
    expect(calculateDormScore(zagreb, { ...baseInput(), ectsCurrentYear: 12 }).competitiveInvalid).toBe(true);
    expect(
      calculateDormScore(zagreb, { ...baseInput(), studyYear: "g3", avgEctsPreviousYears: 35 }).competitiveInvalid,
    ).toBe(true);
    expect(
      calculateDormScore(zagreb, { ...baseInput(), studyYear: "maturant", ectsCurrentYear: 0 }).competitiveInvalid,
    ).toBe(false);
  });

  it("stara spremljena povijest bez novih polja i dalje radi", () => {
    const legacy = { ...baseInput(), specialIds: ["roditelj_dijete", "civil_invalid_parent"] } as DormCalculatorInput;
    const res = calculateDormScore(zagreb, legacy);
    expect(aggregateScoreFromBreakdown(res.breakdown).special).toBe(700);
  });

  it("Zagreb i Split imaju prag 2026./2027.", () => {
    expect(latestCutoff(zagreb)).toBe(1335);
    expect(latestCutoff(dorms.find((d) => d.id === "split")!)).toBe(1629);
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
    expect(estimateChanceWithoutCutoff(2000)).toBe("high");
    expect(estimateChanceWithoutCutoff(1600)).toBe("medium");
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

describe("dormCohortAverages.json", () => {
  it("svaki centar ima prosjek brucoša i učilišta s valjanim prosjecima", () => {
    for (const d of dorms) {
      const c = getCohortCenter(d.id);
      expect(c, d.id).toBeDefined();
      expect(c!.brucosi).toBeGreaterThan(4);
      expect(c!.institutions.length).toBeGreaterThan(10);
    }
    for (const c of Object.values(cohortData.centers)) {
      const codes = new Set<string>();
      for (const i of c.institutions) {
        expect(codes.has(i.code), i.code).toBe(false);
        codes.add(i.code);
        for (const v of [i.prijediplomski, i.diplomskiUpis, i.diplomski]) {
          if (v != null) {
            expect(v).toBeGreaterThanOrEqual(2);
            expect(v).toBeLessThanOrEqual(5);
          }
        }
      }
    }
  });
});
