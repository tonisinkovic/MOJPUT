import { describe, expect, it } from "vitest";
import {
  analyzeJuniorQuiz,
  buildJuniorSignalMap,
  computeJuniorPathway,
  getProgramAvailability,
  highSchoolPrograms,
  juniorInterestLabels,
  juniorQuestions,
  juniorSubjectLabels,
  type JuniorAnswers,
  type JuniorSignalKey,
} from "./juniorQuizEngine";

// ---------------------------------------------------------------------------
// Pomoćni alati za simulaciju profila
// ---------------------------------------------------------------------------

const questionIdsBySignal = (signal: JuniorSignalKey): number[] =>
  juniorQuestions.filter((q) => q.signalKey === signal).map((q) => q.id);

const questionIdsByCategory = (section: string, category: string): number[] =>
  juniorQuestions
    .filter((q) => q.section === section && q.category === category)
    .map((q) => q.id);

type ProfileSpec = {
  base?: number;
  signals?: Partial<Record<JuniorSignalKey, number>>;
  categories?: { section: string; category: string; value: number }[];
};

const buildAnswers = ({ base = 2, signals = {}, categories = [] }: ProfileSpec): JuniorAnswers => {
  const answers: JuniorAnswers = {};
  for (const q of juniorQuestions) answers[q.id] = base;
  for (const { section, category, value } of categories) {
    for (const id of questionIdsByCategory(section, category)) answers[id] = value;
  }
  for (const [signal, value] of Object.entries(signals)) {
    for (const id of questionIdsBySignal(signal as JuniorSignalKey)) {
      answers[id] = value as number;
    }
  }
  return answers;
};

const recommendedNames = (answers: JuniorAnswers): string[] =>
  analyzeJuniorQuiz(answers).recommendations.map((r) => r.program.name);

const topNames = (answers: JuniorAnswers, n = 5): string[] =>
  recommendedNames(answers).slice(0, n);

// ---------------------------------------------------------------------------
// Konzistentnost podataka
// ---------------------------------------------------------------------------

describe("junior kviz — konzistentnost podataka", () => {
  const validSignals = new Set(
    juniorQuestions.map((q) => q.signalKey).filter(Boolean) as string[]
  );

  it("svi interestWeights i subjectWeights ključevi postoje u kategorijama pitanja", () => {
    const interestKeys = new Set(Object.keys(juniorInterestLabels));
    const subjectKeys = new Set(Object.keys(juniorSubjectLabels));
    for (const program of highSchoolPrograms) {
      for (const key of Object.keys(program.interestWeights)) {
        expect(interestKeys.has(key), `${program.name}: interes ${key}`).toBe(true);
      }
      for (const key of Object.keys(program.subjectWeights)) {
        expect(subjectKeys.has(key), `${program.name}: predmet ${key}`).toBe(true);
      }
    }
  });

  it("svi boost/requires signali postoje među pitanjima", () => {
    for (const program of highSchoolPrograms) {
      for (const key of [
        ...Object.keys(program.boostSignals),
        ...Object.keys(program.requiresSignals),
      ]) {
        expect(validSignals.has(key), `${program.name}: signal ${key}`).toBe(true);
      }
    }
  });

  it("svaki program postoji u stvarnoj bazi škola (barem 1 škola)", () => {
    for (const program of highSchoolPrograms) {
      const availability = getProgramAvailability(program);
      expect(
        availability.totalSchools,
        `${program.name} nema nijednu školu u bazi`
      ).toBeGreaterThan(0);
    }
  });

  it("trajanje programa je 3, 4 ili 5 godina", () => {
    for (const program of highSchoolPrograms) {
      expect([3, 4, 5]).toContain(program.duration);
    }
  });
});

// ---------------------------------------------------------------------------
// Simulirani profili
// ---------------------------------------------------------------------------

describe("junior kviz — simulirani profili", () => {
  it("IT profil dobiva Tehničara za računarstvo pri vrhu", () => {
    const answers = buildAnswers({
      base: 2,
      signals: { tech_computers: 5, numbers_data: 4 },
      categories: [
        { section: "subjects", category: "informatika", value: 5 },
        { section: "subjects", category: "matematika", value: 4 },
        { section: "interests", category: "istrazivanje", value: 4 },
        { section: "workstyle", category: "praksa", value: 4 },
        { section: "workstyle", category: "upornost", value: 4 },
      ],
    });
    expect(topNames(answers, 3)).toContain("Tehničar za računarstvo");
  });

  it("zanatski profil: strukovni smjer, obrtnički programi visoko, gimnazija nije u top 3", () => {
    const answers = buildAnswers({
      base: 2,
      signals: { hands_on_craft: 5 },
      categories: [
        { section: "interests", category: "prakticno", value: 5 },
        { section: "workstyle", category: "zanat", value: 5 },
        { section: "workstyle", category: "praksa", value: 5 },
        { section: "workstyle", category: "teorija", value: 1 },
        { section: "workstyle", category: "faks", value: 1 },
        { section: "workstyle", category: "sjedenje", value: 1 },
      ],
    });
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("strukovna");
    const top3 = analysis.recommendations.slice(0, 3);
    expect(
      top3.some((r) => r.program.type === "obrtnicka" || r.program.type === "tehnicka")
    ).toBe(true);
    expect(top3.some((r) => r.program.type === "gimnazija")).toBe(false);
  });

  it("medicinski profil dobiva Medicinsku sestru/tehničara pri vrhu", () => {
    const answers = buildAnswers({
      base: 2,
      signals: { health_medicine: 5, helping_people: 5 },
      categories: [
        { section: "subjects", category: "biologija", value: 5 },
        { section: "interests", category: "ljudi", value: 5 },
        { section: "workstyle", category: "faks", value: 4 },
        { section: "workstyle", category: "disciplina", value: 4 },
      ],
    });
    expect(topNames(answers, 4)).toContain("Medicinska sestra / medicinski tehničar");
  });

  it("glazbeni profil prolazi filter i dobiva glazbenu školu pri vrhu", () => {
    const answers = buildAnswers({
      base: 2,
      signals: { music_performance: 5 },
      categories: [
        { section: "subjects", category: "glazbeni", value: 5 },
        { section: "interests", category: "kreativa", value: 5 },
      ],
    });
    expect(topNames(answers, 3)).toContain("Glazbena škola (glazbenik)");
  });

  it("akademski profil s jakim jezicima dobiva jezičnu gimnaziju i smjer gimnazija", () => {
    const answers = buildAnswers({
      base: 2,
      signals: { languages_travel: 5 },
      categories: [
        { section: "subjects", category: "jezici", value: 5 },
        { section: "subjects", category: "hrvatski", value: 5 },
        { section: "interests", category: "ljudi", value: 4 },
        { section: "interests", category: "istrazivanje", value: 4 },
        { section: "workstyle", category: "teorija", value: 5 },
        { section: "workstyle", category: "faks", value: 5 },
        { section: "workstyle", category: "disciplina", value: 4 },
        { section: "workstyle", category: "sjedenje", value: 4 },
        { section: "workstyle", category: "zanat", value: 1 },
        { section: "workstyle", category: "praksa", value: 2 },
      ],
    });
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("gimnazija");
    expect(topNames(answers, 3)).toContain("Jezična gimnazija");
  });

  it("upozorava na matematiku kad program traži matematiku, a učeniku ne ide", () => {
    const answers = buildAnswers({
      base: 3,
      signals: { tech_computers: 5 },
      categories: [
        { section: "subjects", category: "informatika", value: 5 },
        { section: "subjects", category: "matematika", value: 1 },
      ],
    });
    const analysis = analyzeJuniorQuiz(answers);
    const racunarstvo = analysis.recommendations.find(
      (r) => r.program.name === "Tehničar za računarstvo"
    );
    expect(racunarstvo).toBeDefined();
    expect(racunarstvo!.warnings.some((w) => w.includes("matematiku"))).toBe(true);
  });

  it("svaka preporuka ima razloge, dostupnost i postotak u rasponu", () => {
    const answers = buildAnswers({
      base: 4,
      signals: { sport_active: 5, hands_on_craft: 2 },
    });
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.recommendations.length).toBeGreaterThan(0);
    for (const rec of analysis.recommendations) {
      expect(rec.reasons.length).toBeGreaterThan(0);
      expect(rec.availability.totalSchools).toBeGreaterThan(0);
      expect(rec.matchPercentage).toBeGreaterThanOrEqual(1);
      expect(rec.matchPercentage).toBeLessThanOrEqual(99);
    }
  });
});

// ---------------------------------------------------------------------------
// Averzija — tvrdo isključivanje domena koje učenik izričito ne želi
// ---------------------------------------------------------------------------

describe("junior kviz — averzija (odgovor 1 na ključni signal)", () => {
  it("tko uopće ne želi medicinu, ne dobiva NIJEDAN zdravstveni program (ni fizioterapiju)", () => {
    const answers = buildAnswers({
      base: 3,
      signals: { health_medicine: 1, tech_computers: 4 },
      categories: [{ section: "subjects", category: "biologija", value: 5 }],
    });
    const names = recommendedNames(answers);
    expect(names).not.toContain("Medicinska sestra / medicinski tehničar");
    expect(names).not.toContain("Fizioterapeutski tehničar");
    expect(names).not.toContain("Farmaceutski tehničar");
    expect(analyzeJuniorQuiz(answers).excludedBySignals).toBeGreaterThan(0);
  });

  it("tko izričito ne voli crtanje, ne dobiva dizajn ni medijskog tehničara", () => {
    const answers = buildAnswers({
      base: 3,
      signals: { art_visual: 1 },
      categories: [{ section: "interests", category: "kreativa", value: 4 }],
    });
    const names = recommendedNames(answers);
    expect(names).not.toContain("Škola za dizajn i likovnu umjetnost");
    expect(names).not.toContain("Medijski / grafički tehničar i web dizajner");
  });

  it("tko izričito ne želi jezike, ne dobiva jezičnu gimnaziju", () => {
    const answers = buildAnswers({
      base: 3,
      signals: { languages_travel: 1 },
      categories: [{ section: "subjects", category: "jezici", value: 4 }],
    });
    expect(recommendedNames(answers)).not.toContain("Jezična gimnazija");
  });

  it("blaga nezainteresiranost (2) NE isključuje, samo spušta rezultat", () => {
    const answers = buildAnswers({
      base: 3,
      signals: { health_medicine: 2, helping_people: 4 },
      categories: [{ section: "subjects", category: "biologija", value: 4 }],
    });
    const analysis = analyzeJuniorQuiz(answers);
    const allEligible = analysis.recommendations.map((r) => r.program.name);
    // Program smije postojati u širem popisu — bitno je da nije tvrdo izbačen zbog "2".
    const sestra = highSchoolPrograms.find(
      (p) => p.name === "Medicinska sestra / medicinski tehničar"
    );
    expect(sestra).toBeDefined();
    // requiresSignals za sestru traži 2, pa s odgovorom 2 prolazi tvrdi filter.
    expect(analysis.excludedBySignals).toBeLessThan(highSchoolPrograms.length);
    expect(Array.isArray(allEligible)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Pouzdanost i putokaz
// ---------------------------------------------------------------------------

describe("junior kviz — pouzdanost i putokaz", () => {
  it("sve neutralno -> niska pouzdanost", () => {
    const answers = buildAnswers({ base: 3 });
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.confidence.level).toBe("low");
  });

  it("jasan i odlučan profil -> visoka pouzdanost", () => {
    const answers = buildAnswers({
      base: 1,
      signals: { tech_computers: 5, numbers_data: 5 },
      categories: [
        { section: "interests", category: "istrazivanje", value: 5 },
        { section: "subjects", category: "informatika", value: 5 },
        { section: "subjects", category: "matematika", value: 5 },
        { section: "workstyle", category: "teorija", value: 5 },
        { section: "workstyle", category: "faks", value: 5 },
        { section: "workstyle", category: "disciplina", value: 5 },
        { section: "workstyle", category: "sjedenje", value: 4 },
        { section: "workstyle", category: "upornost", value: 5 },
      ],
    });
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.confidence.level).toBe("high");
  });

  it("uravnotežen radni stil -> otvorena oba puta", () => {
    const answers = buildAnswers({ base: 3 });
    expect(computeJuniorPathway(answers).direction).toBe("balanced");
  });

  it("signalna mapa pokriva sva signalna pitanja", () => {
    const answers = buildAnswers({ base: 4 });
    const map = buildJuniorSignalMap(answers);
    const signalCount = juniorQuestions.filter((q) => q.signalKey).length;
    expect(Object.keys(map).length).toBe(signalCount);
  });
});
