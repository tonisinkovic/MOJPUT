/**
 * Shared types, question catalog and student-profile scoring for junior quiz v2.
 */

import quizData from "@/data/junior-quiz/questions.json";
import programsData from "@/data/junior-quiz/high-school-programs.json";
import programProfilesData from "@/data/junior-quiz/program-profiles.json";

export const JUNIOR_QUIZ_VERSION = "v2.2";

/** Riječi na ljestvici 1–5. Scoring i dalje šalje broj. */
export const JUNIOR_SCALE_WORDS = ["Baš ne", "Malo", "Tako-tako", "Da", "Jako da"] as const;

export type InterestKey =
  | "technology"
  | "mathematics"
  | "science"
  | "people"
  | "languages"
  | "society"
  | "economy"
  | "art_design"
  | "practical"
  | "nature"
  | "sport"
  | "media";

export type ThinkingKey =
  | "analytical"
  | "practical"
  | "creative"
  | "verbal"
  | "social"
  | "organizational"
  | "technical"
  | "investigative";

export type LearningKey =
  | "theory"
  | "practical"
  | "project"
  | "experiment"
  | "independent"
  | "group"
  | "repetition"
  | "reading"
  | "problems";

export type EnvironmentKey =
  | "office"
  | "lab"
  | "workshop"
  | "computer"
  | "field"
  | "nature"
  | "health"
  | "people"
  | "shop"
  | "studio"
  | "classroom"
  | "dynamic";

export type ValueKey =
  | "security"
  | "salary"
  | "creativity"
  | "helping"
  | "freedom"
  | "flexibility"
  | "stableHours"
  | "advancement"
  | "entrepreneurship"
  | "impact"
  | "prestige"
  | "abroad";

export type ToleranceKey =
  | "math"
  | "reading"
  | "memorizing"
  | "publicSpeaking"
  | "concentration"
  | "people"
  | "physical"
  | "precision"
  | "responsibility"
  | "pressure";

export type PostSchoolKey = "work" | "faculty" | "unsure" | "both";
export type RequirementLevel = "low" | "medium" | "medium-high" | "high";

export const INTEREST_DIMS: readonly InterestKey[] = [
  "technology",
  "mathematics",
  "science",
  "people",
  "languages",
  "society",
  "economy",
  "art_design",
  "practical",
  "nature",
  "sport",
  "media",
];
export const THINKING_DIMS: readonly ThinkingKey[] = [
  "analytical",
  "practical",
  "creative",
  "verbal",
  "social",
  "organizational",
  "technical",
  "investigative",
];
export const LEARNING_DIMS: readonly LearningKey[] = [
  "theory",
  "practical",
  "project",
  "experiment",
  "independent",
  "group",
  "repetition",
  "reading",
  "problems",
];
export const ENVIRONMENT_DIMS: readonly EnvironmentKey[] = [
  "office",
  "lab",
  "workshop",
  "computer",
  "field",
  "nature",
  "health",
  "people",
  "shop",
  "studio",
  "classroom",
  "dynamic",
];
export const VALUE_DIMS: readonly ValueKey[] = [
  "security",
  "salary",
  "creativity",
  "helping",
  "freedom",
  "flexibility",
  "stableHours",
  "advancement",
  "entrepreneurship",
  "impact",
  "prestige",
  "abroad",
];
export const TOLERANCE_DIMS: readonly ToleranceKey[] = [
  "math",
  "reading",
  "memorizing",
  "publicSpeaking",
  "concentration",
  "people",
  "physical",
  "precision",
  "responsibility",
  "pressure",
];
export const POST_SCHOOL_DIMS: readonly PostSchoolKey[] = ["work", "faculty", "unsure", "both"];

export type JuniorPriority =
  | "practical"
  | "faculty"
  | "people"
  | "employment"
  | "creative"
  | "technology";

export const JUNIOR_PRIORITIES: { id: JuniorPriority; label: string }[] = [
  { id: "practical", label: "Želim što više rada rukama" },
  { id: "faculty", label: "Želim kasnije na fakultet" },
  { id: "people", label: "Želim raditi s ljudima" },
  { id: "employment", label: "Želim lakše naći posao" },
  { id: "creative", label: "Želim više crtanja i stvaranja" },
  { id: "technology", label: "Želim raditi s računalima" },
];

export type JuniorSectionKey = "interests" | "subjects" | "workstyle" | "context";

export type JuniorInterestCategory =
  | "prakticno"
  | "istrazivanje"
  | "kreativa"
  | "ljudi"
  | "organizacija"
  | "red"
  | "jezici";

export type JuniorSubjectCategory =
  | "matematika"
  | "hrvatski"
  | "jezici"
  | "biologija"
  | "kemija_fizika"
  | "informatika"
  | "likovni"
  | "glazbeni"
  | "tjelesni"
  | "drustveni";

export type JuniorWorkstyleCategory =
  | "teorija"
  | "faks"
  | "zanat"
  | "disciplina"
  | "struktura"
  | "sjedenje"
  | "praksa"
  | "upornost";

export type JuniorSignalKey =
  | "hands_on_craft"
  | "tech_computers"
  | "art_visual"
  | "helping_people"
  | "animals_nature"
  | "science_experiments"
  | "music_performance"
  | "health_medicine"
  | "business_entrepreneur"
  | "numbers_data"
  | "plants_outdoor"
  | "cooking_food"
  | "beauty_style"
  | "sport_active"
  | "languages_travel"
  | "security_service"
  | "logistics_transport";

export const INTEREST_KEYS: readonly JuniorInterestCategory[] = [
  "prakticno",
  "istrazivanje",
  "kreativa",
  "ljudi",
  "organizacija",
  "red",
  "jezici",
];

export const SUBJECT_KEYS: readonly JuniorSubjectCategory[] = [
  "matematika",
  "hrvatski",
  "jezici",
  "biologija",
  "kemija_fizika",
  "informatika",
  "likovni",
  "glazbeni",
  "tjelesni",
  "drustveni",
];

export type JuniorEffects = {
  interests?: Partial<Record<string, number>>;
  thinking?: Partial<Record<string, number>>;
  learning?: Partial<Record<string, number>>;
  environment?: Partial<Record<string, number>>;
  values?: Partial<Record<string, number>>;
  tolerance?: Partial<Record<string, number>>;
  subjects?: Partial<Record<string, number>>;
  postSchool?: Partial<Record<string, number>>;
  signals?: Partial<Record<string, number>>;
  theoryPractice?: number;
};

export type JuniorQuestionOption = {
  id: string;
  label: string;
  effects?: JuniorEffects;
};

export type JuniorQuestionFormat = "choice" | "scale" | "multi" | "text";
export type JuniorQuestionPool =
  | "core"
  | "health"
  | "tech"
  | "creative"
  | "practical"
  | "academic"
  | "peoplebiz"
  | "context"
  | "followup";

export type JuniorQuestion = {
  id: number;
  format: JuniorQuestionFormat;
  pool: JuniorQuestionPool;
  section: JuniorSectionKey;
  category?: string;
  prompt: string;
  question?: string;
  hint?: string;
  skippable?: boolean;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  signalKey?: JuniorSignalKey;
  options?: JuniorQuestionOption[];
  effects?: JuniorEffects;
  maxSelect?: number;
  placeholder?: string;
  joke?: string;
};

export type JuniorSection = { key: JuniorSectionKey; title: string; blurb: string };

export type HighSchoolProgramType = "gimnazija" | "tehnicka" | "umjetnicka" | "obrtnicka";

export type HighSchoolProgram = {
  id: number;
  name: string;
  type: HighSchoolProgramType;
  duration: number;
  description: string;
  afterSchool: string;
  interestWeights: Partial<Record<JuniorInterestCategory, number>>;
  subjectWeights: Partial<Record<JuniorSubjectCategory, number>>;
  academicLoad: number;
  boostSignals: Partial<Record<JuniorSignalKey, number>>;
  requiresSignals: Partial<Record<JuniorSignalKey, number>>;
  matchKeywords: string[];
  goodFor: string[];
  entryBar: "visok" | "srednji" | "nizi";
  entryNote: string;
};

export type ProgramDimensionProfile = {
  interests?: Partial<Record<InterestKey, number>>;
  thinking?: Partial<Record<ThinkingKey, number>>;
  learning?: Partial<Record<string, number>>;
  environment?: Partial<Record<EnvironmentKey, number>>;
  values?: Partial<Record<ValueKey, number>>;
  requirements?: Partial<Record<string, RequirementLevel>>;
  postSchool?: Partial<Record<PostSchoolKey, number>>;
  theoryPractice?: number;
};

export type JuniorAnswerValue = number | string | string[];
export type JuniorAnswers = Record<number, JuniorAnswerValue>;

export type SchoolContext = {
  grade: string | null;
  city: string | null;
  averageBand: string | null;
  favoriteSubjects: JuniorSubjectCategory[];
  hardSubjects: JuniorSubjectCategory[];
  skippedGrades: boolean;
};

export type JuniorStudentProfile = {
  interests: Record<InterestKey, number>;
  thinking: Record<ThinkingKey, number>;
  learning: Record<LearningKey, number>;
  environment: Record<EnvironmentKey, number>;
  values: Record<ValueKey, number>;
  tolerance: Record<ToleranceKey, number>;
  subjects: Record<JuniorSubjectCategory, number>;
  postSchool: Record<PostSchoolKey, number>;
  theoryPractice: number;
  signals: Partial<Record<JuniorSignalKey, number>>;
  schoolContext: SchoolContext;
  considering: string | null;
  answeredCount: number;
  knownInterests: number;
};

export type ProfileTrait = {
  key: string;
  group: "interests" | "thinking" | "learning";
  label: string;
  score: number;
  band: "very" | "strong" | "medium" | "low";
};

export type AnalyzeOptions = { priority?: JuniorPriority | null; answers?: JuniorAnswers };

export const juniorSections = quizData.sections as JuniorSection[];
export const juniorQuestions = quizData.questions as JuniorQuestion[];
export const juniorInterestLabels = quizData.interestCategories as Record<JuniorInterestCategory, string>;
export const juniorSubjectLabels = quizData.subjectCategories as Record<JuniorSubjectCategory, string>;
export const juniorTraitLabels = (
  quizData as {
    traitLabels?: {
      interests: Record<string, string>;
      thinking: Record<string, string>;
      learning: Record<string, string>;
    };
  }
).traitLabels ?? { interests: {}, thinking: {}, learning: {} };

export const highSchoolPrograms = programsData as HighSchoolProgram[];
export const JUNIOR_PROGRAM_FAMILY_COUNT = highSchoolPrograms.length;
export const JUNIOR_TOP_RECOMMENDATIONS = 5;
export const JUNIOR_QUIZ_QUESTION_COUNT = 33;

export const juniorProgramTypeLabels: Record<HighSchoolProgramType, string> = {
  gimnazija: "Gimnazija",
  tehnicka: "Tehnička / strukovna",
  umjetnicka: "Umjetnička škola",
  obrtnicka: "Obrtnička (zanat)",
};

export const programOverlays = programProfilesData as Record<string, ProgramDimensionProfile>;

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const safe = (value: number, fallback = 50): number => (Number.isFinite(value) ? value : fallback);

export const round100 = (value: number) => clamp(Math.round(safe(value)), 0, 100);

export const avg = (values: number[]): number => {
  const usable = values.filter((v) => Number.isFinite(v));
  if (!usable.length) return 50;
  return usable.reduce((a, b) => a + b, 0) / usable.length;
};

export const questionPrompt = (q: JuniorQuestion): string => q.prompt || q.question || "";

export const isAnswered = (value: JuniorAnswerValue | undefined): boolean => {
  if (value === undefined || value === "skip") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return typeof value === "number";
};

export const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const bandFor = (score: number): ProfileTrait["band"] => {
  if (score >= 80) return "very";
  if (score >= 65) return "strong";
  if (score >= 45) return "medium";
  return "low";
};

export const bandLabel = (band: ProfileTrait["band"]): string =>
  ({ very: "jako ti leži", strong: "dosta ti leži", medium: "srednje", low: "manje ti leži" })[band];

type AccCell = { sum: number; weight: number };
type Acc = Record<string, AccCell>;

const addEffect = (acc: Acc, key: string, weight: number, score01to100: number) => {
  if (!key || !weight) return;
  const w = Math.abs(weight);
  const score = weight < 0 ? 100 - score01to100 : score01to100;
  if (!acc[key]) acc[key] = { sum: 0, weight: 0 };
  acc[key].sum += score * w;
  acc[key].weight += w;
};

const finalize = <T extends string>(acc: Acc, keys: readonly T[], unknown = 50): Record<T, number> => {
  const result = {} as Record<T, number>;
  for (const key of keys) {
    const cell = acc[key];
    if (!cell || cell.weight <= 0) result[key] = unknown;
    else result[key] = round100(cell.sum / cell.weight);
  }
  return result;
};

const knownCount = (acc: Acc) => Object.values(acc).filter((c) => c.weight > 0).length;

type ProfileAcc = {
  interests: Acc;
  thinking: Acc;
  learning: Acc;
  environment: Acc;
  values: Acc;
  tolerance: Acc;
  subjects: Acc;
  postSchool: Acc;
  signals: Partial<Record<JuniorSignalKey, number>>;
  theoryPractice: number;
};

const applyEffects = (effects: JuniorEffects | undefined, score: number, acc: ProfileAcc) => {
  if (!effects) return;
  const buckets: [keyof JuniorEffects, Acc][] = [
    ["interests", acc.interests],
    ["thinking", acc.thinking],
    ["learning", acc.learning],
    ["environment", acc.environment],
    ["values", acc.values],
    ["tolerance", acc.tolerance],
    ["subjects", acc.subjects],
    ["postSchool", acc.postSchool],
  ];
  for (const [bucket, target] of buckets) {
    const map = effects[bucket] as Partial<Record<string, number>> | undefined;
    if (!map) continue;
    for (const [key, weight] of Object.entries(map)) {
      if (typeof weight !== "number") continue;
      addEffect(target, key, weight, score);
    }
  }
  if (effects.signals) {
    for (const [key, value] of Object.entries(effects.signals)) {
      if (typeof value !== "number") continue;
      const prev = acc.signals[key as JuniorSignalKey];
      acc.signals[key as JuniorSignalKey] = typeof prev === "number" ? Math.max(prev, value) : value;
    }
  }
  if (typeof effects.theoryPractice === "number") {
    acc.theoryPractice = clamp(acc.theoryPractice + effects.theoryPractice * (score / 100), 0, 100);
  }
};

export const calculateQuizProfile = (answers: JuniorAnswers): JuniorStudentProfile => {
  const acc: ProfileAcc = {
    interests: {},
    thinking: {},
    learning: {},
    environment: {},
    values: {},
    tolerance: {},
    subjects: {},
    postSchool: {},
    signals: {},
    theoryPractice: 50,
  };

  let considering: string | null = null;
  const schoolContext: SchoolContext = {
    grade: null,
    city: null,
    averageBand: null,
    favoriteSubjects: [],
    hardSubjects: [],
    skippedGrades: false,
  };

  for (const q of juniorQuestions) {
    const raw = answers[q.id];
    if (raw === "skip") {
      if (q.id === 72 || q.id === 73 || q.id === 74 || q.id === 75) schoolContext.skippedGrades = true;
      continue;
    }
    if (raw === undefined) continue;

    if (q.format === "scale" && typeof raw === "number") {
      applyEffects(q.effects, clamp(((raw - 1) / 4) * 100, 0, 100), acc);
      if (q.signalKey) acc.signals[q.signalKey] = raw;
      continue;
    }

    if (q.format === "choice" && typeof raw === "string") {
      const option = q.options?.find((o) => o.id === raw);
      applyEffects(option?.effects, 100, acc);
      if (q.id === 72) schoolContext.grade = raw;
      if (q.id === 73) schoolContext.averageBand = raw;
      continue;
    }

    if (q.format === "multi" && Array.isArray(raw)) {
      const selected = raw.filter((id) => typeof id === "string") as string[];
      if (q.id === 74) {
        schoolContext.favoriteSubjects = selected.filter((id): id is JuniorSubjectCategory =>
          SUBJECT_KEYS.includes(id as JuniorSubjectCategory),
        );
        for (const id of schoolContext.favoriteSubjects) addEffect(acc.subjects, id, 2, 88);
      }
      if (q.id === 75) {
        schoolContext.hardSubjects = selected.filter((id): id is JuniorSubjectCategory =>
          SUBJECT_KEYS.includes(id as JuniorSubjectCategory),
        );
        for (const id of schoolContext.hardSubjects) addEffect(acc.subjects, id, 2, 28);
      }
      continue;
    }

    if (q.format === "text" && typeof raw === "string" && raw.trim()) {
      if (q.id === 77) schoolContext.city = raw.trim().slice(0, 80);
      else considering = raw.trim().slice(0, 180);
    }
  }

  return {
    interests: finalize(acc.interests, INTEREST_DIMS),
    thinking: finalize(acc.thinking, THINKING_DIMS),
    learning: finalize(acc.learning, LEARNING_DIMS),
    environment: finalize(acc.environment, ENVIRONMENT_DIMS),
    values: finalize(acc.values, VALUE_DIMS),
    tolerance: finalize(acc.tolerance, TOLERANCE_DIMS),
    subjects: finalize(acc.subjects, SUBJECT_KEYS),
    postSchool: finalize(acc.postSchool, POST_SCHOOL_DIMS),
    theoryPractice: round100(acc.theoryPractice),
    signals: acc.signals,
    schoolContext,
    considering,
    answeredCount: Object.values(answers).filter((v) => isAnswered(v)).length,
    knownInterests: knownCount(acc.interests),
  };
};

export const toLegacyInterestScores = (
  profile: JuniorStudentProfile,
): Record<JuniorInterestCategory, number> => ({
  prakticno: round100(avg([profile.interests.practical, profile.interests.technology])),
  istrazivanje: round100(avg([profile.interests.science, profile.interests.mathematics])),
  kreativa: round100(avg([profile.interests.art_design, profile.interests.media])),
  ljudi: profile.interests.people,
  organizacija: round100(avg([profile.interests.economy, profile.thinking.organizational])),
  red: round100(avg([profile.tolerance.precision, profile.thinking.organizational])),
  jezici: profile.interests.languages,
});

export const buildJuniorSignalMap = (answers: JuniorAnswers): Partial<Record<JuniorSignalKey, number>> =>
  calculateQuizProfile(answers).signals;

export const analyticsAnswerPayload = (
  question: JuniorQuestion,
  value: JuniorAnswerValue | undefined,
): string | number => {
  if (question.format === "text") return value && value !== "skip" ? "provided" : "skipped";
  if (question.id === 72 || question.id === 73 || question.id === 74 || question.id === 75) {
    return isAnswered(value) ? "provided" : "skipped";
  }
  if (Array.isArray(value)) return value.join(",");
  if (value === undefined) return "skipped";
  return value;
};
