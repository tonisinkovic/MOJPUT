import { describe, expect, it } from "vitest";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";
import {
  chanceFor,
  chanceForProgram,
  computeProgramPoints,
  computeSrednjaPoints,
  emptyGradeDraft,
  findCutoff,
  findKalkulatorSchool,
  findMapSchoolId,
  gradeDraftIsUsable,
  nextJuniorDeadline,
  officialProgramExample,
  scoringProfileFor,
  shortlistItemKey,
  type JuniorGradeDraft,
} from "@/lib/juniorPath";
import { kalkulatorSchools } from "@/data/srednjaKalkulator";

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
});

function perfectGrades(): JuniorGradeDraft {
  const draft = emptyGradeDraft();
  draft.program = "gimnazija4";
  draft.prosjek5 = "5";
  draft.prosjek6 = "5";
  draft.razred7 = {
    prosjek: "5",
    matematika: "5",
    hrvatski: "5",
    strani: "5",
    predmet1: "5",
    predmet2: "5",
    predmet3: "5",
  };
  draft.razred8 = { ...draft.razred7 };
  return draft;
}

const prag = (min: number, max: number) => ({
  year: "2025/2026",
  kvota: 1,
  upisani: 1,
  min,
  avg: null,
  max,
});

describe("programi iznad 80 bodova", () => {
  it("klavirist Lisinskog ide na skalu 260", () => {
    const school = kalkulatorSchools.find(
      (item) => item.name === "Glazbena škola Vatroslava Lisinskog" && item.city === "Zagreb",
    );
    const program = school?.programs.find((item) => item.name === "Glazbenik klavirist");
    expect(program?.prag?.min).toBeGreaterThan(200);
    const profile = scoringProfileFor(program);
    expect(profile.id).toBe("glazba");
    expect(profile.scaleMax).toBe(260);
    const points = computeProgramPoints(
      perfectGrades(),
      profile,
      { strucniUspjeh: "10", prijemni: "170" },
      program?.prag,
    );
    expect(points.ukupno).toBe(260);
    expect(points.examFailed).toBe(false);
    expect(points.scaleMax).toBeGreaterThanOrEqual(260);
  });

  it("sportaški odjel zbraja školskih 80 i sportskih 80", () => {
    const profile = scoringProfileFor({
      name: "Opća gimnazija (odjel za sportaše) (320104-S)",
      prag: prag(120.81, 160),
    });
    expect(profile.id).toBe("sport");
    const points = computeProgramPoints(perfectGrades(), profile, { sport: "80" }, prag(120.81, 160));
    expect(points.ukupno).toBe(160);
    expect(points.scaleMax).toBe(160);
  });

  it("športska gimnazija drži traku iznad 160 ako je lanjski max viši", () => {
    const cutoff = prag(127.7, 160.92);
    const profile = scoringProfileFor({
      name: "Opća gimnazija",
      schoolName: "Športska gimnazija",
      prag: cutoff,
    });
    expect(profile.id).toBe("sport");
    const points = computeProgramPoints(perfectGrades(), profile, { sport: "80" }, cutoff);
    expect(points.ukupno).toBe(160);
    expect(points.scaleMax).toBe(160.92);
    expect(points.scaleMismatch).toBe(false);
  });

  it("dizajnerski programi s provjerom darovitosti ostaju na skali 200", () => {
    for (const name of [
      "Dizajner odjeće",
      "Dizajner grafičkih proizvoda / Dizajnerica grafičkih proizvoda",
      "Dizajner unutrašnje arhitekture",
    ]) {
      const profile = scoringProfileFor({ name, prag: prag(140, 190) });
      expect(profile.id, name).toBe("likovna");
      expect(profile.extras[0]?.max).toBe(120);
      expect(profile.extras[0]?.floor).toBe(70);
    }
  });

  it("web sučelje s visokim objavljenim pragom ostaje školskih 80", () => {
    const cutoff = prag(161.01, 194.45);
    const profile = scoringProfileFor({
      name: "Tehničar za razvoj i dizajn web sučelja / Tehničarka za razvoj i dizajn web sučelja",
      sector: "Grafička tehnologija i audio - vizualno oblikovanje",
      schoolName: "Škola za grafiku, dizajn i medijsku produkciju",
      prag: cutoff,
    });
    expect(profile.id).toBe("standard");
    const points = computeProgramPoints(perfectGrades(), profile, {}, cutoff);
    expect(points.ukupno).toBe(80);
    expect(points.scaleMax).toBe(80);
    expect(points.scaleMismatch).toBe(true);
    expect(points.extras).toHaveLength(0);
  });

  it("likovni program zbraja školskih 80 i provjeru 120", () => {
    const profile = scoringProfileFor({
      name: "Likovna umjetnost i dizajn do izbora zanimanja",
      prag: prag(128.07, 196.95),
    });
    expect(profile.id).toBe("likovna");
    const points = computeProgramPoints(perfectGrades(), profile, { provjera: "120" });
    expect(points.ukupno).toBe(200);
    expect(points.scaleMax).toBe(200);
  });

  it("obična gimnazija i dizajner s pragom do 80 ostaju na 80", () => {
    const gym = scoringProfileFor({ name: "Opća gimnazija", prag: prag(36.48, 80) });
    expect(gym.id).toBe("standard");
    const gymPoints = computeProgramPoints(perfectGrades(), gym, {});
    expect(gymPoints.ukupno).toBe(80);
    expect(gymPoints.scaleMax).toBe(80);
    expect(computeSrednjaPoints(perfectGrades()).max).toBe(80);

    const craft = scoringProfileFor({
      name: "Drvodjeljski tehničar i dizajner / Drvodjeljska tehničarka i dizajnerica",
      prag: prag(43.24, 58.21),
    });
    expect(craft.id).toBe("standard");
  });

  it("prijemni ispod 70 ne daje prolaz iako je zbroj iznad praga", () => {
    const profile = scoringProfileFor({ name: "Glazbenik klavirist", prag: prag(150, 237.27) });
    const points = computeProgramPoints(perfectGrades(), profile, { strucniUspjeh: "10", prijemni: "69" });
    expect(points.ukupno).toBe(159);
    expect(points.examFailed).toBe(true);
    expect(points.examPending).toBe(false);
    const chance = chanceForProgram(points.ukupno, 150, {
      pending: points.examPending,
      failed: points.examFailed,
      floor: points.failedFloor,
    });
    expect(chance?.label).toBe("Ne prolazi prijemni");
    expect(chance?.tone).toBe("rose");
  });

  it("bez unesenog prijemnog ne uspoređuje školskih 80 s pragom iznad 200", () => {
    const profile = scoringProfileFor({ name: "Glazbenik klavirist", prag: prag(237.27, 237.27) });
    const points = computeProgramPoints(perfectGrades(), profile, { strucniUspjeh: "10" });
    expect(points.zajednicki).toBe(80);
    expect(points.examPending).toBe(true);
    expect(
      chanceForProgram(points.ukupno, 237.27, {
        pending: true,
        failed: false,
        floor: null,
      }),
    ).toBeNull();
  });
});

describe("juniorPath kalendar", () => {
  it("sljedeći rok nakon 4. 9. 2026. je završetak naknadnog roka", () => {
    const next = nextJuniorDeadline(new Date(2026, 8, 4, 8, 0, 0));
    expect(next?.title).toMatch(/završetak/i);
    expect(next?.day).toBe(30);
  });
});
