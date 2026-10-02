import { describe, expect, it } from "vitest";
import {
  analyzeJuniorQuiz,
  calculateProgramMatch,
  calculateQuizProfile,
  computeJuniorPathway,
  getProgramAvailability,
  highSchoolPrograms,
  juniorQuestions,
  selectTopRecommendations,
  type JuniorAnswers,
  type JuniorQuestion,
} from "./juniorQuizEngine";
import { buildMainSequence, jobOptionIds, peopleDayOptionIds, pickBranchQuestionIds, selectFollowupQuestions, typicalJuniorQuizLength } from "./juniorQuizSequence";
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
  it("nedodirnut interes ne ulazi u slaganje kao srednja ocjena", () => {
    const profile = calculateQuizProfile({ 2: "why" });
    expect(profile.touchedInterests).not.toContain("art_design");
    expect(profile.touchedInterests).not.toContain("technology");
    const design = highSchoolPrograms.find((item) => item.id === 26)!;
    const interests = { ...profile.interests, art_design: 10 };
    const skipped = calculateProgramMatch(
      { ...profile, interests, touchedInterests: profile.touchedInterests.filter((key) => key !== "art_design") },
      design,
    ).interestScore;
    const counted = calculateProgramMatch(
      { ...profile, interests, touchedInterests: [...profile.touchedInterests, "art_design"] },
      design,
    ).interestScore;
    expect(counted).toBeLessThan(skipped);
    expect(calculateQuizProfile({ 1: "understand" }).signals.tech_computers).toBeUndefined();
    expect(calculateQuizProfile({ 13: "tinker" }).signals.tech_computers).toBeUndefined();
    expect(calculateQuizProfile({ 10: "explain" }).signals.helping_people).toBeUndefined();
  });

  it("slobodan dan u školi veže izbor na smjer, bez iznosa novca", () => {
    const day = juniorQuestions.find((q) => q.id === 7);
    expect(day?.prompt).toMatch(/dan/);
    expect(day?.prompt ?? "").not.toMatch(/1000|€|eura/);
    expect(day?.options?.find((o) => o.id === "books")?.effects?.signals?.languages_travel).toBeGreaterThanOrEqual(4);
    expect(day?.options?.find((o) => o.id === "product")?.effects?.signals?.business_entrepreneur).toBe(3);
    expect(day?.options?.some((o) => o.id === "app" || o.id === "art" || o.id === "sport")).toBe(false);
    expect(jobOptionIds({ 36: "food" })).toEqual(["plan", "serve"]);
    expect(jobOptionIds({ 36: "numbers" })).toEqual(["plan", "serve"]);
  });

  it("svaki smjer ima u kvizu odgovor koji ga diže", () => {
    const asked = new Set<string>();
    for (const question of juniorQuestions) {
      if (question.signalKey) asked.add(question.signalKey);
      for (const key of question.signalKeys ?? []) asked.add(key);
      for (const option of question.options ?? []) {
        for (const key of Object.keys(option.effects?.signals ?? {})) asked.add(key);
      }
    }
    const missing: string[] = [];
    for (const program of highSchoolPrograms) {
      const keys = Object.keys(program.boostSignals);
      if (!keys.length) {
        if (program.id === 1) continue;
        missing.push(`${program.name}: nema signal`);
        continue;
      }
      if (!keys.some((key) => asked.has(key))) missing.push(program.name);
    }
    const build = juniorQuestions.find((q) => q.id === 30)?.options?.some((o) => o.id === "build");
    expect(build).toBe(true);
    expect(missing).toEqual([]);
  });

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
      if (program.boostSignals.baking_food) answers[50] = "bake";
      else if (program.boostSignals.cooking_food) answers[50] = "food";
      if (program.boostSignals.beauty_style) answers[50] = "beauty";
      if (program.boostSignals.languages_travel) answers[60] = "lang";
      if (program.boostSignals.animals_nature) answers[20] = "animals";
      if (program.boostSignals.plants_outdoor) answers[50] = "plants";
      if (program.boostSignals.sport_active) {
        answers[36] = "sport";
        answers[37] = "sportjob";
      }
      if (program.boostSignals.science_experiments) answers[9] = "why";
      if (program.boostSignals.business_entrepreneur) answers[34] = "shop";
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
    expect(analysis.recommendations.length).toBeGreaterThanOrEqual(1);
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
    const cookAt = food.findIndex((n) => /kuhar/i.test(n));
    const bakerAt = food.findIndex((n) => /pekar/i.test(n));
    expect(cookAt).toBeGreaterThanOrEqual(0);
    expect(cookAt).toBeLessThan(bakerAt === -1 ? 99 : bakerAt);

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

describe("junior kviz — bodovanje praznih signala i grane", () => {
  it("nepostavljeno pitanje ne kažnjava program koji taj signal traži", () => {
    const profile = calculateQuizProfile({});
    const program = highSchoolPrograms.find((item) => item.name === "Tehničar za računarstvo")!;
    expect(calculateProgramMatch(profile, program).constraintScore).toBe(100);
  });

  it("odgovor „baš ne” na traženi signal spušta program", () => {
    const profile = calculateQuizProfile({ 2: "app" });
    const low = calculateQuizProfile({});
    low.signals.tech_computers = 1;
    const program = highSchoolPrograms.find((item) => item.name === "Tehničar za računarstvo")!;
    expect(calculateProgramMatch(low, program).constraintScore).toBeLessThan(
      calculateProgramMatch(profile, program).constraintScore,
    );
  });

  it("skala o prirodi puni boravak vani, a životinje dolaze iz svog pitanja", () => {
    expect(calculateQuizProfile({ 14: 5 }).signals.plants_outdoor).toBe(5);
    expect(calculateQuizProfile({ 14: 5 }).signals.animals_nature).toBeUndefined();
    expect(calculateQuizProfile({ 20: "animals" }).signals.animals_nature).toBe(5);
  });

  it("jasan tehnički odgovor vuče tehničku granu, bez praznih signala", () => {
    const profile = calculateQuizProfile({ 2: "app" });
    const ids = pickBranchQuestionIds(profile);
    const techIds = juniorQuestions.filter((q) => q.pool === "tech").map((q) => q.id);
    expect(techIds.filter((id) => ids.includes(id)).length).toBe(techIds.length);
  });

  it("upisana ideja uđe u prijedloge, a rad s ljudima se razdvoji", () => {
    const pharmacy = analyzeJuniorQuiz({
      1: "understand",
      2: "why",
      3: 4,
      12: "text",
      16: "solo",
      70: "faculty",
      71: "how",
      76: "farmacija",
    }).recommendations.map((item) => item.program.name);
    expect(pharmacy.slice(0, 3).some((name) => /farmaceut/i.test(name))).toBe(true);

    const sea = analyzeJuniorQuiz({
      1: "understand",
      2: "sport",
      11: 4,
      14: 5,
      16: "make",
      70: "both",
      71: "mix",
      76: "pomorstvo",
    }).recommendations.map((item) => item.program.name);
    expect(sea.some((name) => /pomorski|nauti/i.test(name))).toBe(true);

    const base = calculateQuizProfile({ 2: "help", 8: 4, 15: "help", 70: "faculty" });
    const sportSchool = highSchoolPrograms.find((item) => item.id === 6)!;
    const nurse = highSchoolPrograms.find((item) => item.id === 12)!;
    const asSport = calculateProgramMatch({ ...base, peopleFocus: "sport" }, sportSchool).rankScore;
    const asCare = calculateProgramMatch({ ...base, peopleFocus: "care" }, nurse).rankScore;
    const sportAsCare = calculateProgramMatch({ ...base, peopleFocus: "care" }, sportSchool).rankScore;
    const nurseAsSport = calculateProgramMatch({ ...base, peopleFocus: "sport" }, nurse).rankScore;
    expect(asSport).toBeGreaterThan(nurseAsSport);
    expect(asCare).toBeGreaterThan(sportAsCare);

    expect(buildMainSequence({ 2: "help", 8: 5, 15: "help" })).toContain(97);
    expect(buildMainSequence({ 2: "sport" })).not.toContain(97);

    const day = peopleDayOptionIds(calculateQuizProfile({ 2: "help", 8: 5, 15: "help" }));
    expect(day).toContain("none");
    expect(day.length).toBeLessThanOrEqual(5);
    expect(juniorQuestions.find((q) => q.id === 71)?.options?.find((o) => o.id === "mix")?.label).toBe(
      "Sve od navedenog",
    );
  });

  it("svaki težak predmet skida smjer koji na njemu stoji i ne ulazi u interese", () => {
    const analysis = analyzeJuniorQuiz({
      1: "understand",
      2: "app",
      3: 5,
      6: "interest_math",
      7: "books",
      60: "math",
      70: "faculty",
      75: ["matematika", "informatika", "jezici", "biologija", "tjelesni", "likovni", "drustveni"],
    });
    const shown = `${analysis.drivers.join(" ")} ${analysis.profileSummary}`.toLowerCase();
    expect(shown).not.toMatch(/matematika|računala|jezici|priroda|sport|crtanje|društvo/);

    const cases: Array<[string, number]> = [
      ["matematika", 2],
      ["biologija", 5],
      ["kemija_fizika", 23],
      ["informatika", 7],
      ["jezici", 3],
      ["hrvatski", 4],
      ["likovni", 26],
      ["glazbeni", 25],
      ["tjelesni", 6],
      ["drustveni", 4],
    ];
    for (const [subject, programId] of cases) {
      const open = calculateProgramMatch(calculateQuizProfile({}), highSchoolPrograms.find((p) => p.id === programId)!);
      const hard = calculateProgramMatch(
        calculateQuizProfile({ 75: [subject] }),
        highSchoolPrograms.find((p) => p.id === programId)!,
      );
      expect(open.rankScore - hard.rankScore).toBeGreaterThanOrEqual(8);
    }
  });

  it("doktor i fakultet dižu prirodoslovnu iznad sestre, a njega ostaje sestra", () => {
    const doctor = names(
      {
        2: "help",
        8: 5,
        15: "help",
        20: "care",
        21: "hospital",
        22: "mix",
        70: "faculty",
        71: "how",
        76: "želim biti doktorica",
        97: "doctor",
      },
      3,
    );
    const doctorGym = doctor.findIndex((n) => /^prirodoslovna gimnazija/i.test(n));
    const doctorNurse = doctor.findIndex((n) => /medicinska sestra/i.test(n));
    expect(doctorGym).toBeGreaterThanOrEqual(0);
    expect(doctorGym).toBeLessThan(doctorNurse === -1 ? 99 : doctorNurse);

    const nursePath = names(
      {
        2: "help",
        8: 5,
        15: "help",
        20: "care",
        21: "hospital",
        22: "people_heavy",
        70: "work",
        97: "care",
      },
      3,
    );
    expect(nursePath[0]).toMatch(/medicinska sestra/i);

    expect(calculateQuizProfile({ 20: "lab", 21: "class", 70: "faculty" }).peopleFocus).toBe("doctor");
    expect(calculateQuizProfile({ 2: "sport" }).peopleFocus).toBeNull();
  });

  it("rad rukama razdvaja kuhinju, aute, strojeve i more, a sestra traži zdravstvo", () => {
    const cook = names(
      { 2: "cook", 4: "fix", 11: 5, 16: "make", 36: "food", 37: "kitchen", 50: "food", 70: "work", 76: "kuhar" },
      3,
    );
    expect(cook[0]).toMatch(/kuhar/i);
    expect(cook.join(" ")).not.toMatch(/bravar|automehatron/i);

    const cars = names({ 4: "fix", 11: 5, 16: "make", 30: "machines", 50: "cars", 70: "work", 76: "automehaničar" }, 3);
    expect(cars[0]).toMatch(/automehatron/i);

    const machines = names(
      { 4: "fix", 11: 5, 16: "make", 30: "machines", 50: "metal", 70: "faculty", 76: "strojarstvo" },
      3,
    );
    expect(machines[0]).toMatch(/strojar/i);

    const sea = names({ 2: "sport", 11: 4, 14: 5, 50: "sea", 70: "both", 76: "pomorstvo" }, 3);
    expect(sea[0]).toMatch(/pomorski|nauti/i);

    const pharmacy = names(
      { 2: "why", 6: "interest_math", 20: "lab", 21: "class", 60: "phy", 70: "faculty", 76: "farmacija", 97: "lab" },
      3,
    );
    const pharmacyAt = pharmacy.findIndex((n) => /farmaceut/i.test(n));
    const chemistryAt = pharmacy.findIndex((n) => /kemijski/i.test(n));
    expect(pharmacyAt).toBe(0);
    expect(pharmacyAt).toBeLessThan(chemistryAt === -1 ? 99 : chemistryAt);

    const languages = names({ 2: "why", 3: 5, 7: "books", 12: "text", 60: "lang", 70: "faculty", 76: "jezici" }, 3);
    expect(languages.join(" ")).not.toMatch(/medicinska sestra/i);

    const doctor = analyzeJuniorQuiz({ 2: "help", 8: 5, 20: "care", 60: "bio", 70: "faculty", 76: "medicina" });
    expect(doctor.drivers.join(" ").toLowerCase()).not.toMatch(/računala/);

    const electro = names({ 2: "app", 30: "electro", 31: "workshop" }, 3);
    expect(electro[0]).toMatch(/elektro/i);
    const site = names({ 30: "build", 16: "make", 11: 4 }, 3);
    expect(site.some((n) => /građev/i.test(n))).toBe(true);
  });

  it("kuhinja i peć se razdvajaju, a životinje i ples ne padaju na sestru ili sport", () => {
    const baker = names({ 2: "cook", 11: 4, 16: "make", 36: "bake", 50: "bake", 52: "job", 70: "work" }, 3);
    const bakerAt = baker.findIndex((n) => /pekar/i.test(n));
    const cookAt = baker.findIndex((n) => /kuhar/i.test(n));
    expect(bakerAt).toBeGreaterThanOrEqual(0);
    expect(bakerAt).toBeLessThan(cookAt === -1 ? 99 : cookAt);

    const animals = names(
      { 2: "why", 14: 5, 20: "animals", 70: "both", 76: "veterina", 97: "animals" },
      3,
    );
    expect(animals.some((n) => /veterinar/i.test(n))).toBe(true);

    const dancer = calculateQuizProfile({ 2: "music", 40: "music", 97: "dance" });
    const danceSchool = highSchoolPrograms.find((item) => item.id === 34)!;
    const sportSchool = highSchoolPrograms.find((item) => item.id === 6)!;
    expect(calculateProgramMatch(dancer, danceSchool).rankScore).toBeGreaterThan(
      calculateProgramMatch(dancer, sportSchool).rankScore,
    );
  });

  it("popodne pokriva sport i kuhanje, a teže ocjene spuštaju visok prag", () => {
    expect(calculateQuizProfile({ 2: "sport" }).signals.sport_active).toBe(3);
    expect(calculateQuizProfile({ 2: "cook" }).signals.cooking_food).toBe(3);
    const afternoon = juniorQuestions.find((q) => q.id === 2);
    expect(afternoon?.options?.map((o) => o.id)).toEqual(
      expect.arrayContaining(["sport", "music", "cook"]),
    );
    const hard = juniorQuestions.find((q) => q.id === 75);
    expect(hard?.options?.map((o) => o.id)).toEqual(expect.arrayContaining(["likovni", "glazbeni", "tjelesni"]));
    const low = calculateQuizProfile({ 73: "harder", 1: "understand", 3: 3, 16: "tasks" });
    const open = highSchoolPrograms.find((p) => p.id === 1)!;
    const plain = calculateQuizProfile({ 1: "understand", 3: 3, 16: "tasks" });
    expect(calculateProgramMatch(low, open).constraintScore).toBeLessThan(calculateProgramMatch(plain, open).constraintScore);
  });

  it("poslovanje i fakultet drže ekonomista i opću gimnaziju u vrhu", () => {
    const business = analyzeJuniorQuiz(
      persona([
        [1, "team"],
        [5, "plan"],
        [6, "mix"],
        [7, "product"],
        [12, "data"],
        [15, "pay"],
        [16, "tasks"],
        [34, "shop"],
        [62, "time"],
        [70, "faculty"],
        [71, "how"],
      ]),
    );
    const shown = business.recommendations.map((item) => item.program.name);
    const economistAt = shown.findIndex((name) => /ekonomist/i.test(name));
    const openAt = shown.findIndex((name) => name === "Opća gimnazija");
    expect(economistAt).toBeGreaterThanOrEqual(0);
    expect(economistAt).toBeLessThan(2);
    expect(openAt).toBeGreaterThanOrEqual(0);
    expect(openAt).toBeLessThan(3);
    expect(shown.join(" ")).not.toMatch(/prodavač/i);
  });

  it("fakultet bez konkretne ideje nudi opću gimnaziju sa strane", () => {
    const answers = persona([
      [1, "understand"],
      [3, 4],
      [10, "explain"],
      [12, "text"],
      [16, "tasks"],
      [60, "lang"],
      [70, "faculty"],
      [71, "how"],
    ]);
    const analysis = analyzeJuniorQuiz(answers);
    expect(analysis.gymnasiumOffer?.program.name).toBe("Opća gimnazija");
  });

  it("konkretna ideja ili jak praktičan put gase bočnu gimnaziju", () => {
    const withIdea = analyzeJuniorQuiz(
      persona([
        [1, "understand"],
        [2, "app"],
        [3, 4],
        [16, "tasks"],
        [30, "code"],
        [70, "faculty"],
        [71, "how"],
        [76, "računarstvo"],
      ]),
    );
    expect(withIdea.gymnasiumOffer).toBeNull();

    const hands = analyzeJuniorQuiz(
      persona([
        [1, "experiment"],
        [4, "fix"],
        [11, 5],
        [16, "make"],
        [50, "cars"],
        [52, "job"],
        [70, "faculty"],
        [71, "hands"],
      ]),
    );
    expect(hands.gymnasiumOffer).toBeNull();
  });

  it("imenovana ideja je prva, a smjer bez svog odgovora ne ulazi u prijedloge", () => {
    const build = names({ 2: "why", 16: "make", 70: "work", 76: "građevina" }, 3);
    expect(build[0]).toMatch(/građevinsk/i);
    expect(build.join(" ")).not.toMatch(/medicinska sestra|bravar/i);

    const office = names({ 2: "why", 34: "office", 70: "faculty", 76: "ured" }, 3);
    expect(office[0]).toMatch(/upravni/i);

    const architect = names({ 2: "draw", 40: "poster", 70: "faculty", 76: "arhitektura" }, 3);
    expect(architect[0]).toMatch(/arhitekton/i);

    const nurseLeak = names({ 2: "help", 7: "event", 8: 5, 40: "music", 70: "faculty", 76: "glazba" }, 3);
    expect(nurseLeak[0]).toMatch(/glazben/i);
    expect(nurseLeak.join(" ")).not.toMatch(/medicinska sestra/i);

    const cookOnly = names({ 2: "cook", 4: "fix", 50: "food", 70: "work" }, 3);
    expect(cookOnly.join(" ")).not.toMatch(/bravar|stolar/i);
  });

  it("dodatna provjera imenuje dva smjera s kartice i jedan može maknuti", () => {
    const card = (id: number, rankScore: number) =>
      ({ program: highSchoolPrograms.find((item) => item.id === id)!, rankScore }) as ReturnType<
        typeof analyzeJuniorQuiz
      >["recommendations"][number];

    const hands = selectFollowupQuestions({ 50: "metal", 70: "work" }, [card(38, 80), card(9, 74), card(24, 40)]);
    expect(hands.length).toBeGreaterThan(0);
    expect(hands.length).toBeLessThanOrEqual(2);
    expect(hands[0].prompt).toMatch(/Bravar/i);
    expect(hands[0].prompt).toMatch(/strojar/i);
    expect(hands.map((item) => item.prompt).join(" ")).not.toMatch(/matematik|bolnic|crtanje|kod, struja/i);

    const care = selectFollowupQuestions({}, [card(12, 80), card(14, 76)]);
    expect(care[0].prompt).toMatch(/sestra/i);
    expect(care[0].prompt).toMatch(/fizioterap/i);

    const chosen = analyzeJuniorQuiz({ 50: "metal", 70: "work", 76: "bravar", 98: "keep-38-drop-9" });
    expect(chosen.recommendations[0].program.id).toBe(38);
    expect(chosen.recommendations.some((item) => item.program.id === 9)).toBe(false);
  });

  it("u vrhu ne ostaju tri ista tipa ako je druga vrsta blizu", () => {
    const types = ["tehnicka", "tehnicka", "tehnicka", "tehnicka", "gimnazija", "obrtnicka", "umjetnicka"] as const;
    const matches = types.map((type, index) => ({
      program: { ...highSchoolPrograms[index], type, id: 900 + index },
      matchPercentage: 80 - index,
    })) as ReturnType<typeof analyzeJuniorQuiz>["recommendations"];
    const top = selectTopRecommendations(matches, 5);
    expect(top.filter((item) => item.program.type === "tehnicka")).toHaveLength(2);
    expect(new Set(top.map((item) => item.program.type)).size).toBeGreaterThanOrEqual(3);
  });
});
