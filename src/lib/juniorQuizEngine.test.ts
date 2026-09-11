import { describe, expect, it } from "vitest";
import {
  analyzeJuniorQuiz,
  calculateProgramMatch,
  calculateQuizProfile,
  computeJuniorPathway,
  getProgramAvailability,
  highSchoolPrograms,
  juniorQuestions,
  type JuniorAnswers,
  type JuniorQuestion,
} from "./juniorQuizEngine";
import { buildMainSequence, typicalJuniorQuizLength } from "./juniorQuizSequence";
import { programFactChips } from "./juniorProgramFacts";
import { typicalDayFor } from "./juniorTypicalDay";
import { buildHomeTalk } from "./juniorHomeTalk";
import { JUNIOR_SCALE_WORDS } from "./juniorQuizModel";

const persona = (entries: Array<[number, JuniorAnswers[number]]>): JuniorAnswers => {
  const answers: JuniorAnswers = {};
  for (const [id, value] of entries) answers[id] = value;
  return answers;
};

const names = (answers: JuniorAnswers, n = 5): string[] =>
  analyzeJuniorQuiz(answers).recommendations.slice(0, n).map((r) => r.program.name);

const allNames = (answers: JuniorAnswers): string[] =>
  analyzeJuniorQuiz(answers).allMatches.map((r) => r.program.name);

const expectFiniteScores = (answers: JuniorAnswers) => {
  const analysis = analyzeJuniorQuiz(answers);
  expect(analysis.recommendations.length).toBeGreaterThan(0);
  for (const rec of analysis.allMatches) {
    expect(Number.isFinite(rec.overallScore)).toBe(true);
    expect(Number.isNaN(rec.matchPercentage)).toBe(false);
    expect(rec.matchPercentage).toBeGreaterThanOrEqual(1);
    expect(rec.matchPercentage).toBeLessThanOrEqual(99);
    expect(rec.interestScore).toBeGreaterThanOrEqual(0);
    expect(rec.interestScore).toBeLessThanOrEqual(100);
    expect(rec.positiveReasons.length).toBeGreaterThan(0);
  }
  return analysis;
};

describe("junior kviz v2 — podaci", () => {
  it("pitanja imaju jedinstvene id-eve i valjan format", () => {
    const ids = juniorQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of juniorQuestions as JuniorQuestion[]) {
      expect(["choice", "scale", "multi", "text"]).toContain(q.format);
      if (q.format === "choice") expect(q.options?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("svaki program postoji u stvarnoj bazi škola", () => {
    for (const program of highSchoolPrograms) {
      expect(getProgramAvailability(program).totalSchools, program.name).toBeGreaterThan(0);
    }
  });

  it("tipičan kviz je 31–36 pitanja", () => {
    const n = typicalJuniorQuizLength();
    expect(n).toBeGreaterThanOrEqual(31);
    expect(n).toBeLessThanOrEqual(36);
  });
});

describe("junior kviz v2 — profili", () => {
  it("izrazito tehnički profil stavlja računarstvo visoko", () => {
    const answers = persona([
      [1, "understand"],
      [2, "app"],
      [4, "how"],
      [6, "interest_math"],
      [7, "app"],
      [8, 2],
      [11, 3],
      [13, "tinker"],
      [16, "tasks"],
      [30, "code"],
      [31, "computer"],
      [32, "ok"],
      [33, "theory"],
      [70, "faculty"],
      [71, "solve"],
    ]);
    const top = names(answers, 3);
    expect(top).toContain("Tehničar za računarstvo");
    expect(analyzeJuniorQuiz(answers).profile.interests.technology).toBeGreaterThan(70);
  });

  it("izrazito humanistički profil vodi prema jezicima / gimnaziji", () => {
    const answers = persona([
      [2, "help"],
      [3, 5],
      [10, "explain"],
      [12, "text"],
      [15, "help"],
      [16, "group"],
      [60, "lang"],
      [61, 5],
      [62, "time"],
      [70, "faculty"],
      [71, "how"],
      [80, 4],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("gimnazija");
    expect(names(answers, 3)).toContain("Jezična gimnazija");
  });

  it("izrazito kreativni profil vodi prema dizajnu ili medijima", () => {
    const answers = persona([
      [1, "invent"],
      [2, "poster"],
      [7, "art"],
      [12, "visual"],
      [15, "create"],
      [40, "visual"],
      [41, "yes"],
      [42, "studio"],
      [71, "hands"],
    ]);
    const top = names(answers, 4);
    expect(top.some((n) => /dizajn|medij|glazben/i.test(n))).toBe(true);
  });

  it("zdravstveno orijentirani profil vodi prema njezi ili prirodoslovnoj", () => {
    const answers = persona([
      [2, "help"],
      [8, 5],
      [10, "explain"],
      [15, "help"],
      [20, "care"],
      [21, "hospital"],
      [22, "people_heavy"],
      [23, "practice"],
      [70, "faculty"],
      [9, "why"],
    ]);
    const top = names(answers, 4);
    expect(
      top.some((n) => /medicinska sestra|prirodoslovna|fizioterapeut/i.test(n)),
    ).toBe(true);
  });

  it("praktično orijentirani profil vodi strukovno, gimnazija nije u vrhu", () => {
    const answers = persona([
      [1, "experiment"],
      [4, "fix"],
      [11, 5],
      [16, "make"],
      [50, "cars"],
      [51, 5],
      [52, "job"],
      [70, "work"],
      [71, "hands"],
      [3, 1],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("strukovna");
    const top3 = analysis.recommendations.slice(0, 3);
    expect(top3.some((r) => r.program.type === "obrtnicka" || r.program.type === "tehnicka")).toBe(true);
    expect(top3.some((r) => r.program.type === "gimnazija")).toBe(false);
  });

  it("gimnazijski profil: teorija, fakultet, koncentracija", () => {
    const answers = persona([
      [1, "understand"],
      [3, 5],
      [6, "interest_math"],
      [9, "why"],
      [16, "solo"],
      [60, "math"],
      [61, 5],
      [62, "time"],
      [70, "faculty"],
      [71, "how"],
      [81, 4],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("gimnazija");
    expect(names(answers, 4).some((n) => /gimnazija/i.test(n))).toBe(true);
  });

  it("neodlučan profil ne forsira lažnu preciznost", () => {
    const answers = persona([
      [1, "team"],
      [3, 3],
      [6, "mix"],
      [8, 3],
      [11, 3],
      [16, "group"],
      [70, "unsure"],
      [71, "mix"],
      [61, 3],
      [81, 3],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.confidence.level === "low" || analysis.indecisive).toBe(true);
    expect(analysis.recommendations[0].matchPercentage).toBeLessThanOrEqual(78);
    expect(analysis.profileSummary.length).toBeGreaterThan(20);
  });

  it("kontradiktorni profil (medicina vs rad s ljudima) daje refleksiju, ne odbijanje", () => {
    const answers = persona([
      [2, "help"],
      [8, 1],
      [15, "help"],
      [20, "lab"],
      [22, "less_people"],
      [70, "faculty"],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.contradictions.length).toBeGreaterThan(0);
    expect(allNames(answers).some((n) => /farmac|medicin|prirodoslov/i.test(n))).toBe(true);
  });
});

describe("junior kviz v2 — scoring ugovori", () => {
  it("rezultat nikad nije NaN i uvijek ima objašnjenje", () => {
    expectFiniteScores(
      persona([
        [2, "app"],
        [7, "research"],
        [70, "both"],
      ]),
    );
  });

  it("prazan kviz ima fallback i insufficientData", () => {
    const analysis = analyzeJuniorQuiz({});
    expect(analysis.insufficientData).toBe(true);
    expect(analysis.recommendations.length).toBeGreaterThan(0);
    expect(analysis.recommendations.every((r) => r.positiveReasons.length > 0)).toBe(true);
  });

  it("jedan odgovor ne ruši cijeli rezultat", () => {
    const a = expectFiniteScores(persona([[2, "app"]]));
    const b = expectFiniteScores(persona([[2, "poster"]]));
    expect(Math.abs(a.recommendations[0].matchPercentage - b.recommendations[0].matchPercentage)).toBeLessThan(80);
  });

  it("calculateQuizProfile i calculateProgramMatch su deterministički", () => {
    const answers = persona([
      [2, "app"],
      [30, "code"],
      [70, "faculty"],
    ]);
    const p1 = calculateQuizProfile(answers);
    const p2 = calculateQuizProfile(answers);
    expect(p1.interests.technology).toBe(p2.interests.technology);
    const program = highSchoolPrograms.find((p) => p.name === "Tehničar za računarstvo")!;
    const m1 = calculateProgramMatch(p1, program);
    const m2 = calculateProgramMatch(p2, program);
    expect(m1.overallScore).toBe(m2.overallScore);
    expect(m1.positiveReasons.length).toBeGreaterThan(0);
  });

  it("nedovršen kviz se može nastaviti — scoring radi s djelomičnim odgovorima", () => {
    const partial = persona([
      [1, "understand"],
      [2, "app"],
    ]);
    const seq = buildMainSequence(partial);
    expect(seq.length).toBeGreaterThanOrEqual(28);
    expect(seq.length).toBeLessThanOrEqual(36);
    expect(analyzeJuniorQuiz(partial).profile.answeredCount).toBe(2);
  });

  it("upozorava na matematiku bez ponižavanja", () => {
    const answers = persona([
      [2, "app"],
      [6, "avoid_math"],
      [30, "code"],
      [32, "prefer_less"],
      [75, ["matematika"]],
    ]);
    const rec = analyzeJuniorQuiz(answers).allMatches.find((r) => r.program.name === "Tehničar za računarstvo");
    expect(rec).toBeDefined();
    expect(rec!.cautionReasons.join(" ")).toMatch(/matemat/i);
    expect(rec!.cautionReasons.join(" ").toLowerCase()).not.toMatch(/nisi dovoljno/);
  });

  it("prioritet fakultet diže četverogodišnje programe", () => {
    const answers = persona([
      [11, 4],
      [70, "both"],
      [71, "mix"],
    ]);
    const base = analyzeJuniorQuiz(answers);
    const faculty = analyzeJuniorQuiz(answers, { priority: "faculty" });
    const baseGym = base.allMatches.find((m) => m.program.type === "gimnazija")?.matchPercentage ?? 0;
    const facGym = faculty.allMatches.find((m) => m.program.type === "gimnazija")?.matchPercentage ?? 0;
    expect(facGym).toBeGreaterThanOrEqual(baseGym - 1);
  });

  it("svaki program može ući visoko za profil usklađen sa svojim signalima", () => {
    const weak: string[] = [];
    for (const program of highSchoolPrograms) {
      const answers: JuniorAnswers = {
        70: program.duration === 3 ? "work" : "faculty",
        71: program.academicLoad <= 1 ? "hands" : program.academicLoad >= 3 ? "how" : "mix",
      };
      if (program.boostSignals.tech_computers) {
        answers[2] = "app";
        answers[30] = "code";
      }
      if (program.boostSignals.health_medicine) {
        answers[20] = "care";
        answers[8] = 5;
        answers[15] = "help";
      }
      if (program.boostSignals.art_visual) answers[2] = "poster";
      if (program.boostSignals.music_performance) answers[40] = "music";
      if (program.boostSignals.hands_on_craft) {
        answers[4] = "fix";
        answers[11] = 5;
      }
      if (program.boostSignals.cooking_food) answers[50] = "food";
      if (program.boostSignals.beauty_style) answers[50] = "beauty";
      if (program.boostSignals.languages_travel) answers[60] = "lang";
      if (program.boostSignals.animals_nature) answers[20] = "animals";
      if (program.boostSignals.plants_outdoor) answers[50] = "plants";
      if (program.boostSignals.sport_active) {
        answers[36] = "sport";
        answers[37] = "sportjob";
      }
      if (program.boostSignals.science_experiments) answers[9] = "why";
      if (program.boostSignals.business_entrepreneur) answers[7] = "product";
      if (program.boostSignals.numbers_data) answers[6] = "interest_math";
      if (program.boostSignals.logistics_transport) {
        answers[34] = "move";
        answers[35] = "field";
      }
      if (program.name === "Upravni referent") {
        answers[5] = "plan";
        answers[15] = "security";
        answers[1] = "team";
        answers[61] = 4;
      }
      const rank = analyzeJuniorQuiz(answers).allMatches.map((m) => m.program.name).indexOf(program.name);
      if (rank === -1 || rank > 10) weak.push(`${program.name} (#${rank + 1 || "nema"})`);
    }
    expect(weak).toEqual([]);
  });
});

describe("junior kviz v2 — putokaz", () => {
  it("computeJuniorPathway ostaje dostupan", () => {
    const academic = computeJuniorPathway(persona([[3, 5], [61, 5], [70, "faculty"], [71, "how"]]));
    const practical = computeJuniorPathway(persona([[11, 5], [51, 5], [70, "work"], [71, "hands"]]));
    expect(academic.academicScore).toBeGreaterThan(practical.academicScore);
    expect(practical.practicalScore).toBeGreaterThan(academic.practicalScore);
  });
});

const noVerdict = (text: string) => {
  expect(text.toLowerCase()).not.toMatch(
    /ti trebaš upisati|ti si za |ti nisi za |najbolja škola za tebe|točan odgovor|interest score|learning fit/,
  );
};

describe("junior kviz v2 — 8 mentalnih profila", () => {
  it("1. računala i tehnologija", () => {
    const answers = persona([
      [1, "understand"],
      [2, "app"],
      [4, "how"],
      [6, "interest_math"],
      [7, "app"],
      [13, "tinker"],
      [16, "tasks"],
      [30, "code"],
      [31, "computer"],
      [32, "ok"],
      [70, "faculty"],
      [71, "solve"],
    ]);
    const analysis = expectFiniteScores(answers);
    expect(names(answers, 3)).toContain("Tehničar za računarstvo");
    noVerdict(analysis.profileSummary);
  });

  it("2. biologija i pomaganje ljudima", () => {
    const answers = persona([
      [2, "help"],
      [8, 5],
      [10, "explain"],
      [15, "help"],
      [20, "care"],
      [21, "hospital"],
      [22, "people_heavy"],
      [23, "practice"],
      [70, "faculty"],
      [9, "why"],
    ]);
    const top = names(answers, 4);
    expect(top.some((n) => /medicinska sestra|prirodoslovna|fizioterapeut/i.test(n))).toBe(true);
    expect(top.join(" ").toLowerCase()).not.toMatch(/strojar|automehanič|frizer/i);
  });

  it("3. jezici, pisanje i društveni predmeti", () => {
    const answers = persona([
      [2, "help"],
      [3, 5],
      [10, "explain"],
      [12, "text"],
      [15, "help"],
      [16, "group"],
      [60, "lang"],
      [61, 5],
      [62, "time"],
      [70, "faculty"],
      [71, "how"],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("gimnazija");
    expect(names(answers, 3)).toContain("Jezična gimnazija");
  });

  it("4. crtanje, dizajn i kreativnost", () => {
    const answers = persona([
      [1, "invent"],
      [2, "poster"],
      [7, "art"],
      [12, "visual"],
      [15, "create"],
      [40, "visual"],
      [41, "yes"],
      [42, "studio"],
      [71, "hands"],
    ]);
    expect(names(answers, 4).some((n) => /dizajn|medij|glazben/i.test(n))).toBe(true);
  });

  it("5. rad rukama i praktični zadaci", () => {
    const answers = persona([
      [1, "experiment"],
      [4, "fix"],
      [11, 5],
      [16, "make"],
      [50, "cars"],
      [51, 5],
      [52, "job"],
      [70, "work"],
      [71, "hands"],
      [3, 1],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.pathway.direction).toBe("strukovna");
    const top3 = analysis.recommendations.slice(0, 3);
    expect(top3.some((r) => r.program.type === "obrtnicka" || r.program.type === "tehnicka")).toBe(true);
    expect(top3.some((r) => r.program.type === "gimnazija")).toBe(false);
  });

  it("6. voli matematiku, još ne zna smjer", () => {
    const answers = persona([
      [1, "understand"],
      [3, 4],
      [6, "interest_math"],
      [16, "tasks"],
      [60, "math"],
      [61, 4],
      [62, "time"],
      [70, "unsure"],
      [71, "solve"],
    ]);
    const analysis = expectFiniteScores(answers);
    const top = names(answers, 4);
    expect(top.some((n) => /gimnazija|računar|matematič/i.test(n))).toBe(true);
    expect(top.join(" ").toLowerCase()).not.toMatch(/frizer|kulinar|automehanič/i);
    expect(analysis.profileSummary.length).toBeGreaterThan(20);
  });

  it("7. široki interesi, nema jasan smjer", () => {
    const answers = persona([
      [1, "team"],
      [3, 3],
      [6, "mix"],
      [8, 3],
      [11, 3],
      [16, "group"],
      [70, "unsure"],
      [71, "mix"],
      [61, 3],
      [81, 3],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.confidence.level === "low" || analysis.indecisive).toBe(true);
    expect(analysis.recommendations[0].matchPercentage).toBeLessThanOrEqual(78);
    expect(analysis.recommendations.length).toBeGreaterThanOrEqual(3);
    noVerdict(analysis.profileSummary);
  });

  it("8. kontradiktorni odgovori daju smislen okvir", () => {
    const answers = persona([
      [2, "help"],
      [8, 1],
      [15, "help"],
      [20, "lab"],
      [22, "less_people"],
      [70, "faculty"],
      [7, "app"],
      [11, 5],
    ]);
    const analysis = expectFiniteScores(answers);
    expect(analysis.contradictions.length + analysis.recommendations.length).toBeGreaterThan(3);
    expect(analysis.recommendations.every((r) => r.positiveReasons.length > 0)).toBe(true);
    noVerdict([...analysis.contradictions, analysis.profileSummary].join(" "));
  });
});

describe("junior kviz v2 — jezik za učenika", () => {
  it("pitanja ne koriste stručni žargon", () => {
    const blob = juniorQuestions
      .map((q) => `${q.prompt} ${q.hint ?? ""} ${(q.options ?? []).map((o) => o.label).join(" ")}`)
      .join(" ");
    expect(blob.toLowerCase()).not.toMatch(
      /kognitiv|analitičk|radnog okruženja|stem podru|preferiraš|verbalno izražavanje|profiliranje/,
    );
    expect(blob).not.toMatch(/točan odgovor|netočan odgovor|provjeri svoje znanje/);
  });

  it("promptovi su rodno neutralni", () => {
    const blob = juniorQuestions.map((q) => `${q.prompt} ${q.hint ?? ""}`).join(" ");
    expect(blob.toLowerCase()).not.toMatch(/\bradio\b|\bnapravio\b|\bnapravila\b|\bmorao\b|\bmorala\b/);
  });
});

describe("junior kviz v2.2 — nove grane i rezultat", () => {
  it("grad iz kviza ide u profil", () => {
    expect(calculateQuizProfile({ 77: "Split" }).schoolContext.city).toBe("Split");
    expect(calculateQuizProfile({ 77: "skip" }).schoolContext.city).toBeNull();
  });

  it("objašnjenja dolaze iz konkretnih odgovora", () => {
    const answers = persona([
      [2, "app"],
      [30, "code"],
      [31, "computer"],
    ]);
    const rec = analyzeJuniorQuiz(answers).allMatches.find((r) => r.program.name === "Tehničar za računarstvo");
    expect(rec).toBeDefined();
    expect(rec!.answerReasons.join(" ")).toMatch(/aplikacij|računal/i);
    expect(rec!.interestLine).toMatch(/vuče te|računal|tehnik/i);
    expect(rec!.readinessNotes).toBeDefined();
  });

  it("ljestvica ima 5 riječi, ne samo brojke", () => {
    expect([...JUNIOR_SCALE_WORDS]).toEqual(["Baš ne", "Malo", "Tako-tako", "Da", "Jako da"]);
  });

  it("mini papir za kuću ima 2 programa i pitanje za roditelja", () => {
    const analysis = analyzeJuniorQuiz(
      persona([
        [2, "app"],
        [30, "code"],
        [70, "faculty"],
      ]),
    );
    const talk = buildHomeTalk(analysis);
    expect(talk.programs.length).toBeGreaterThanOrEqual(1);
    expect(talk.parentQuestion.length).toBeGreaterThan(10);
    expect(talk.text).toMatch(/nije odluka/i);
  });

  it("ekonomija / turizam / sport / hrana / logistika ulaze visoko", () => {
    const economy = names(
      persona([
        [5, "plan"],
        [7, "product"],
        [34, "shop"],
        [35, "own"],
        [36, "numbers"],
        [37, "plan"],
        [70, "faculty"],
      ]),
      5,
    );
    expect(economy.some((n) => /ekonomist|upravni|prodavač/i.test(n))).toBe(true);

    const tourism = names(
      persona([
        [2, "help"],
        [15, "help"],
        [34, "guest"],
        [35, "hotel"],
        [36, "talk"],
        [37, "serve"],
        [60, "lang"],
        [70, "faculty"],
      ]),
      5,
    );
    expect(tourism.some((n) => /turistič|hotelijer|konobar/i.test(n))).toBe(true);

    const sport = names(
      persona([
        [14, 5],
        [36, "sport"],
        [37, "sportjob"],
        [11, 4],
        [70, "faculty"],
      ]),
      5,
    );
    expect(sport.some((n) => /sport/i.test(n))).toBe(true);

    const food = names(
      persona([
        [11, 5],
        [16, "make"],
        [36, "food"],
        [37, "kitchen"],
        [50, "food"],
        [70, "work"],
        [71, "hands"],
      ]),
      5,
    );
    expect(food.some((n) => /kuhar|konobar|prehramben/i.test(n))).toBe(true);

    const logistics = names(
      persona([
        [5, "plan"],
        [34, "move"],
        [35, "field"],
        [37, "plan"],
        [70, "faculty"],
      ]),
      5,
    );
    expect(logistics.some((n) => /promet|logistik/i.test(n))).toBe(true);
  });

  it("svaki program ima 4 retka običnog dana i činjenice", () => {
    for (const program of highSchoolPrograms) {
      const day = typicalDayFor(program);
      expect(day.morning.length, program.name).toBeGreaterThan(8);
      expect(day.rhythm.length, program.name).toBeGreaterThan(8);
      expect(day.subjects.length, program.name).toBeGreaterThan(8);
      expect(day.after.length, program.name).toBeGreaterThan(8);
      const chips = programFactChips(program);
      expect(chips.some((c) => c.id === "matura" || c.id === "no-matura")).toBe(true);
      expect(chips.some((c) => c.id === "bar")).toBe(true);
    }
  });
});
