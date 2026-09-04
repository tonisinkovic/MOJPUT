import { describe, expect, it } from "vitest";

import competenciesJson from "@/data/career-quiz/questions-competencies.json";
import interestsJson from "@/data/career-quiz/questions-interests.json";
import programsJson from "@/data/career-quiz/study-programs.json";
import type { CompetencyQuestion, InterestQuestion, CareerInterestSignalKey } from "@/lib/careerQuizEngine";
import {
  analyzeStudyPrograms,
  analyzeStudyProgramsInterestOnly,
  type StudyProgramRow,
} from "@/lib/studyProgramEngine";

const interests = interestsJson.interests as InterestQuestion[];
const competencies = competenciesJson.competencies as CompetencyQuestion[];
const programs = programsJson.programs as StudyProgramRow[];

type InterestProfile = Partial<Record<string, number>> & {
  signals?: Partial<Record<CareerInterestSignalKey, number>>;
};

/** Gradi odgovore: default po RIASEC kategoriji + specifični signali preko signalKey pitanja. */
function buildInterestAnswers(profile: InterestProfile): number[] {
  return interests.map((q) => {
    const signalOverride = q.signalKey ? profile.signals?.[q.signalKey as CareerInterestSignalKey] : undefined;
    if (signalOverride !== undefined) return signalOverride;
    return profile[q.category] ?? 2;
  });
}

function buildCompetencyAnswers(profile: Partial<Record<string, number>>): number[] {
  return competencies.map((q) => profile[q.category] ?? 3);
}

function topNames(matches: { program: StudyProgramRow }[], n = 5): string[] {
  return matches.slice(0, n).map((m) => m.program.name);
}

describe("analyzeStudyPrograms — simulirani profili", () => {
  it("IT profil dobiva računarstvo na vrhu (ispred strojarstva)", () => {
    const ia = buildInterestAnswers({
      investigative: 5,
      realistic: 4,
      artistic: 2,
      social: 2,
      enterprising: 2,
      conventional: 3,
      signals: {
        software_it_interest: 5,
        math_interest: 4,
        machines_tech_interest: 3,
        materials_construction_interest: 2,
        science_lab_interest: 3,
      },
    });
    const ca = buildCompetencyAnswers({
      technical: 5,
      problem_solving: 5,
      analytical: 5,
      numerical: 5,
      adaptability: 4,
    });
    const { matches } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(matches[0].program.name).toBe("Računarstvo i informatika");
    const names = topNames(matches);
    const itIdx = names.indexOf("Računarstvo i informatika");
    const fsbIdx = names.indexOf("Strojarstvo");
    if (fsbIdx !== -1) expect(itIdx).toBeLessThan(fsbIdx);
  });

  it("medicinski profil dobiva medicinu/zdravstvo na vrhu", () => {
    const ia = buildInterestAnswers({
      social: 5,
      investigative: 5,
      realistic: 2,
      artistic: 1,
      enterprising: 2,
      conventional: 3,
      signals: {
        medicine_health_interest: 5,
        social_help_interest: 4,
        science_lab_interest: 4,
        animal_vet_interest: 1,
        software_it_interest: 2,
      },
    });
    const ca = buildCompetencyAnswers({
      learning: 5,
      stress_management: 4,
      analytical: 5,
      interpersonal: 5,
      patience: 4,
      attention_to_detail: 4,
    });
    const { matches } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(matches[0].program.area).toBe("health");
    expect(topNames(matches)).toContain("Medicina");
    // Jasan negativan odgovor na životinje → veterina ne smije biti u preporukama.
    expect(topNames(matches, matches.length)).not.toContain("Veterinarska medicina");
  });

  it("pravni profil dobiva pravo, glazbena akademija je isključena negativnim signalom", () => {
    const ia = buildInterestAnswers({
      enterprising: 5,
      conventional: 5,
      social: 4,
      investigative: 3,
      artistic: 1,
      realistic: 1,
      signals: {
        law_judiciary_interest: 5,
        office_administration_interest: 4,
        sales_persuasion_interest: 3,
        music_interest: 1,
        acting_interest: 1,
        design_visual_interest: 1,
      },
    });
    const ca = buildCompetencyAnswers({
      communication: 5,
      analytical: 4,
      critical_thinking: 5,
      writing: 4,
      organization: 5,
    });
    const analysis = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(topNames(analysis.matches, 3)).toContain("Pravo");
    expect(topNames(analysis.matches, analysis.matches.length)).not.toContain("Glazbena umjetnost");
    expect(analysis.excludedBySignals).toBeGreaterThan(0);
  });

  it("sportski profil dobiva kineziologiju visoko", () => {
    const ia = buildInterestAnswers({
      realistic: 4,
      social: 4,
      investigative: 2,
      artistic: 2,
      enterprising: 3,
      conventional: 2,
      signals: {
        sport_kinesiology_interest: 5,
        medicine_health_interest: 3,
        software_it_interest: 1,
        math_interest: 1,
      },
    });
    const ca = buildCompetencyAnswers({
      wellness: 5,
      communication: 4,
      interpersonal: 4,
      goal_oriented: 5,
    });
    const { matches } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(topNames(matches, 3)).toContain("Kineziologija");
  });

  it("upozorava na tešku matematiku kad su numeričke kompetencije niske", () => {
    const ia = buildInterestAnswers({
      investigative: 5,
      realistic: 3,
      artistic: 2,
      social: 2,
      enterprising: 2,
      conventional: 3,
      signals: { software_it_interest: 5, math_interest: 4 },
    });
    const ca = buildCompetencyAnswers({
      technical: 4,
      problem_solving: 4,
      analytical: 3,
      numerical: 1,
    });
    const { matches } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    const it = matches.find((m) => m.program.name === "Računarstvo i informatika");
    expect(it).toBeDefined();
    expect(it!.warnings.some((w) => w.toLowerCase().includes("matemati"))).toBe(true);
  });

  it("svaka preporuka ima obrazloženje, interestFit i readinessFit", () => {
    const ia = buildInterestAnswers({ investigative: 4, social: 4 });
    const ca = buildCompetencyAnswers({ analytical: 4 });
    const { matches } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) {
      expect(m.reasons.length).toBeGreaterThan(0);
      expect(m.interestFit).toBeGreaterThanOrEqual(0);
      expect(m.readinessFit).not.toBeNull();
    }
  });
});

describe("pouzdanost preporuke", () => {
  it("odlučan, diferenciran profil → visoka ili srednja pouzdanost", () => {
    const ia = buildInterestAnswers({
      investigative: 5,
      realistic: 4,
      artistic: 1,
      social: 1,
      enterprising: 2,
      conventional: 2,
      signals: { software_it_interest: 5, math_interest: 5 },
    });
    const ca = buildCompetencyAnswers({ technical: 5, numerical: 5, analytical: 5 });
    const { confidence } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(["visoka", "srednja"]).toContain(confidence.level);
  });

  it("sve neutralno (3) → niska pouzdanost", () => {
    const ia = interests.map(() => 3);
    const ca = competencies.map(() => 3);
    const { confidence } = analyzeStudyPrograms(interests, competencies, ia, ca, programs);
    expect(confidence.level).toBe("niska");
  });
});

describe("analyzeStudyProgramsInterestOnly — faza 1", () => {
  it("radi bez kompetencija i vraća readinessFit = null", () => {
    const ia = buildInterestAnswers({
      artistic: 5,
      social: 3,
      signals: { design_visual_interest: 5, music_interest: 1 },
    });
    const { matches } = analyzeStudyProgramsInterestOnly(interests, ia, programs);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].readinessFit).toBeNull();
    // Dizajnerski signal → kreativni programi na vrhu, glazba isključena.
    expect(matches.slice(0, 4).some((m) => m.program.area === "creative")).toBe(true);
    expect(matches.map((m) => m.program.name)).not.toContain("Glazbena umjetnost");
  });
});

describe("konzistentnost baze programa", () => {
  const validInterestKeys = new Set(interests.map((q) => q.category));
  const validCompetencyKeys = new Set(competencies.map((q) => q.category));
  const validSignalKeys = new Set(interests.map((q) => q.signalKey).filter(Boolean));

  it("svi interestWeights ključevi postoje u pitanjima", () => {
    for (const p of programs) {
      for (const key of Object.keys(p.interestWeights)) {
        expect(validInterestKeys.has(key), `${p.name}: interes ${key}`).toBe(true);
      }
    }
  });

  it("svi competencyWeights ključevi postoje u pitanjima", () => {
    for (const p of programs) {
      for (const key of Object.keys(p.competencyWeights)) {
        expect(validCompetencyKeys.has(key), `${p.name}: kompetencija ${key}`).toBe(true);
      }
    }
  });

  it("svi boost/requires signali imaju barem jedno pitanje sa signalKey", () => {
    for (const p of programs) {
      for (const key of Object.keys(p.boostSignals ?? {})) {
        expect(validSignalKeys.has(key), `${p.name}: boost ${key}`).toBe(true);
      }
      for (const key of Object.keys(p.requiresSignals ?? {})) {
        expect(validSignalKeys.has(key), `${p.name}: requires ${key}`).toBe(true);
      }
    }
  });
});
