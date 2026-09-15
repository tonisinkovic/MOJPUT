/**
 * Junior orientation quiz engine v2.
 * Rank programs from a student profile. Match % is tool-criteria similarity, not success odds.
 */

import { srednjaProgramCounties } from "@/data/srednjaPrograms";
import {
  INTEREST_DIMS,
  INTEREST_KEYS,
  JUNIOR_TOP_RECOMMENDATIONS,
  SUBJECT_KEYS,
  THINKING_DIMS,
  avg,
  bandFor,
  calculateQuizProfile,
  clamp,
  highSchoolPrograms,
  juniorInterestLabels,
  juniorSubjectLabels,
  juniorTraitLabels,
  normalizeText,
  programOverlays,
  round100,
  toLegacyInterestScores,
  type AnalyzeOptions,
  type HighSchoolProgram,
  type JuniorAnswers,
  type JuniorInterestCategory,
  type JuniorPriority,
  type JuniorSignalKey,
  type JuniorStudentProfile,
  type JuniorSubjectCategory,
  type ProfileTrait,
  type ProgramDimensionProfile,
  type RequirementLevel,
} from "@/lib/juniorQuizModel";
import { answerReasonLines, interestLineFor } from "@/lib/juniorQuizReasons";

export * from "@/lib/juniorQuizModel";

export type SchoolAvailability = {
  totalSchools: number;
  exampleSchools: { name: string; city: string }[];
};

export type JuniorProgramMatch = {
  program: HighSchoolProgram;
  matchPercentage: number;
  overallScore: number;
  interestScore: number;
  learningFitScore: number;
  workStyleScore: number;
  requirementFitScore: number;
  motivationScore: number;
  constraintScore: number;
  confidence: number;
  interestFit: number;
  subjectFit: number;
  workstyleFit: number;
  signalBoost: number;
  reasons: string[];
  warnings: string[];
  positiveReasons: string[];
  cautionReasons: string[];
  answerReasons: string[];
  interestLine: string;
  readinessNotes: string[];
  availability: SchoolAvailability;
};

export type JuniorPathway = {
  academicScore: number;
  practicalScore: number;
  direction: "gimnazija" | "strukovna" | "balanced";
  title: string;
  explanation: string;
};

export type JuniorConfidence = {
  level: "high" | "medium" | "low";
  score: number;
  explanation: string;
};

export type JuniorQuizAnalysis = {
  profile: JuniorStudentProfile;
  interestScores: Record<JuniorInterestCategory, number>;
  subjectScores: Record<JuniorSubjectCategory, number>;
  topInterests: { category: JuniorInterestCategory; label: string; score: number }[];
  topSubjects: { category: JuniorSubjectCategory; label: string; score: number }[];
  topTraits: ProfileTrait[];
  pathway: JuniorPathway;
  recommendations: JuniorProgramMatch[];
  lessAligned: JuniorProgramMatch[];
  allMatches: JuniorProgramMatch[];
  confidence: JuniorConfidence;
  indecisive: boolean;
  insufficientData: boolean;
  contradictions: string[];
  profileSummary: string;
  drivers: string[];
  learningSummary: string;
  consideringNote: string | null;
  excludedBySignals: number;
  specialNotes: string[];
  priority: JuniorPriority | null;
};

const LEVEL_NUM: Record<RequirementLevel, number> = {
  low: 28,
  medium: 50,
  "medium-high": 68,
  high: 84,
};

const availabilityCache = new Map<number, SchoolAvailability>();

export const getProgramAvailability = (program: HighSchoolProgram): SchoolAvailability => {
  const cached = availabilityCache.get(program.id);
  if (cached) return cached;
  const keywords = program.matchKeywords.map(normalizeText);
  const examples: { name: string; city: string }[] = [];
  let total = 0;
  for (const county of srednjaProgramCounties) {
    for (const school of county.schools) {
      const hasProgram = school.programs.some((p) => {
        const normalized = normalizeText(p);
        return keywords.some((kw) => normalized.includes(kw));
      });
      if (hasProgram) {
        total += 1;
        if (examples.length < 3) examples.push({ name: school.name, city: school.city });
      }
    }
  }
  const availability = { totalSchools: total, exampleSchools: examples };
  availabilityCache.set(program.id, availability);
  return availability;
};

const defaultOverlayFromProgram = (program: HighSchoolProgram): ProgramDimensionProfile => {
  const interests: ProgramDimensionProfile["interests"] = {};
  const w = program.interestWeights;
  if (w.prakticno) {
    interests.practical = (w.prakticno ?? 0) / 3;
    interests.technology = (w.prakticno ?? 0) / 6;
  }
  if (w.istrazivanje) interests.science = (w.istrazivanje ?? 0) / 3;
  if (w.kreativa) interests.art_design = (w.kreativa ?? 0) / 3;
  if (w.ljudi) interests.people = (w.ljudi ?? 0) / 3;
  if (w.organizacija) interests.economy = (w.organizacija ?? 0) / 3;
  if (w.jezici) interests.languages = (w.jezici ?? 0) / 3;
  return {
    interests,
    theoryPractice: program.academicLoad >= 3 ? 22 : program.academicLoad <= 1 ? 78 : 50,
    postSchool: {
      faculty: program.academicLoad >= 3 ? 0.9 : program.duration === 3 ? 0.2 : 0.55,
      work: program.duration === 3 ? 0.85 : program.academicLoad <= 1 ? 0.65 : 0.35,
    },
  };
};

export const resolveProgramProfile = (program: HighSchoolProgram): ProgramDimensionProfile => {
  const base = defaultOverlayFromProgram(program);
  const extra = programOverlays[String(program.id)];
  if (!extra) return base;
  return {
    interests: { ...base.interests, ...extra.interests },
    thinking: { ...base.thinking, ...extra.thinking },
    learning: { ...base.learning, ...extra.learning },
    environment: { ...base.environment, ...extra.environment },
    values: { ...base.values, ...extra.values },
    requirements: { ...base.requirements, ...extra.requirements },
    postSchool: { ...base.postSchool, ...extra.postSchool },
    theoryPractice: extra.theoryPractice ?? base.theoryPractice,
  };
};

export const weightedFit = (
  scores: Record<string, number>,
  weights: Partial<Record<string, number>> | undefined,
): number => {
  if (!weights) return 50;
  let total = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (!weight || weight <= 0) continue;
    const score = scores[key];
    if (typeof score !== "number" || !Number.isFinite(score)) continue;
    total += score * weight;
    weightSum += weight;
  }
  if (weightSum === 0) return 50;
  return round100(total / weightSum);
};

const studentRequirementScore = (profile: JuniorStudentProfile, key: string): number => {
  if (key === "mathematics" || key === "math") return avg([profile.tolerance.math, profile.interests.mathematics]);
  if (key === "reading") return profile.tolerance.reading;
  if (key === "memorizing") return profile.tolerance.memorizing;
  if (key === "publicSpeaking") return profile.tolerance.publicSpeaking;
  if (key === "concentration") return profile.tolerance.concentration;
  if (key === "people") return profile.tolerance.people;
  if (key === "physical") return profile.tolerance.physical;
  if (key === "precision") return profile.tolerance.precision;
  if (key === "responsibility") return profile.tolerance.responsibility;
  if (key === "pressure") return profile.tolerance.pressure;
  if (key === "languages") return profile.interests.languages;
  if (key === "organizational") return profile.thinking.organizational;
  return 50;
};

const requirementFit = (profile: JuniorStudentProfile, overlay: ProgramDimensionProfile): number => {
  const entries = Object.entries(overlay.requirements ?? {}).filter(([, level]) => level);
  if (!entries.length) return 70;
  let total = 0;
  for (const [key, level] of entries) {
    const needed = LEVEL_NUM[level as RequirementLevel] ?? 50;
    const have = studentRequirementScore(profile, key);
    total += 100 - Math.max(0, needed - have) * 0.9;
  }
  return round100(total / entries.length);
};

const consideringBoost = (profile: JuniorStudentProfile, program: HighSchoolProgram): number => {
  if (!profile.considering) return 0;
  const hay = normalizeText(
    `${program.name} ${program.description} ${program.matchKeywords.join(" ")} ${program.goodFor.join(" ")}`,
  );
  const needle = normalizeText(profile.considering);
  if (needle.length < 3) return 0;
  const tokens = needle.split(/\s+/).filter((t) => t.length >= 4);
  return tokens.some((t) => hay.includes(t)) || hay.includes(needle) ? 6 : 0;
};

const signalAdjustment = (profile: JuniorStudentProfile, program: HighSchoolProgram) => {
  let boost = 0;
  let constraintPenalty = 0;
  for (const [key, weight] of Object.entries(program.boostSignals)) {
    if (!weight) continue;
    const answer = profile.signals[key as JuniorSignalKey];
    if (typeof answer !== "number") continue;
    boost += (answer - 3) * 3.2 * (weight / 3);
    if (weight >= 2 && answer === 1) constraintPenalty += 22;
  }
  for (const [key, minimum] of Object.entries(program.requiresSignals)) {
    if (!minimum) continue;
    const answer = profile.signals[key as JuniorSignalKey];
    if (typeof answer !== "number") constraintPenalty += 14;
    else if (answer < minimum) constraintPenalty += (minimum - answer) * 8;
  }
  return { boost: clamp(Math.round(boost), -10, 10), constraintPenalty: clamp(constraintPenalty, 0, 45) };
};

const readinessAdjustment = (profile: JuniorStudentProfile, program: HighSchoolProgram): number => {
  let delta = 0;
  const hard = new Set(profile.schoolContext.hardSubjects);
  const fav = new Set(profile.schoolContext.favoriteSubjects);
  if (hard.has("matematika") && (program.subjectWeights.matematika ?? 0) >= 2) delta -= 6;
  if (hard.has("hrvatski") && (program.subjectWeights.hrvatski ?? 0) >= 2) delta -= 4;
  if (hard.has("jezici") && (program.subjectWeights.jezici ?? 0) >= 2) delta -= 4;
  if (fav.has("informatika") && /računar|informat/i.test(program.name)) delta += 4;
  if (fav.has("biologija") && /medicin|farmac|veterin|prirodoslov/i.test(program.name)) delta += 3;
  if (profile.schoolContext.averageBand === "good" && program.entryBar === "visok") delta -= 4;
  if (profile.schoolContext.averageBand === "excellent" && program.entryBar === "visok") delta += 2;
  return delta;
};

const priorityAdjustment = (
  priority: JuniorPriority | null | undefined,
  profile: JuniorStudentProfile,
  program: HighSchoolProgram,
  overlay: ProgramDimensionProfile,
): number => {
  if (!priority) return 0;
  if (priority === "practical") return Math.round(((overlay.theoryPractice ?? 50) - 50) * 0.28);
  if (priority === "faculty") return Math.round((overlay.postSchool?.faculty ?? 0.4) * 14) - (program.duration === 3 ? 10 : 0);
  if (priority === "people") return Math.round((profile.interests.people / 100) * 6 + (overlay.interests?.people ?? 0) * 10);
  if (priority === "employment") {
    return program.duration === 3 || program.type === "obrtnicka" ? 10 : program.type === "tehnicka" ? 4 : -4;
  }
  if (priority === "creative") {
    return Math.round((overlay.interests?.art_design ?? 0) * 12 + (overlay.interests?.media ?? 0) * 8);
  }
  return Math.round((overlay.interests?.technology ?? 0) * 14);
};

const INTEREST_REASON: Record<string, string> = {
  technology: "Zanimaju te računala i tehnologija.",
  mathematics: "Voliš matematiku i logiku.",
  science: "Zanimaju te priroda i pokusi.",
  people: "Voliš raditi s ljudima i pomagati.",
  languages: "Zanimaju te jezici.",
  society: "Zanimaju te društvo i svijet oko nas.",
  economy: "Zanima te organizirati stvari i smisliti posao.",
  art_design: "Voliš crtanje i dizajn.",
  practical: "Voliš raditi rukama.",
  nature: "Zanimaju te priroda i životinje.",
  sport: "Voliš sport i kretanje.",
  media: "Zanimaju te video, tekst i objave.",
};

const buildExplanations = (
  profile: JuniorStudentProfile,
  program: HighSchoolProgram,
  overlay: ProgramDimensionProfile,
  workStyleScore: number,
  answers: JuniorAnswers,
  interestScore: number,
): { positive: string[]; caution: string[]; answerReasons: string[]; interestLine: string; readinessNotes: string[] } => {
  const positive: string[] = [];
  const caution: string[] = [];
  const answerReasons = answerReasonLines(answers, program, overlay);
  positive.push(...answerReasons);

  const interestHits = Object.entries(overlay.interests ?? {})
    .filter(([, w]) => (w ?? 0) >= 0.55)
    .map(([key]) => {
      const score = profile.interests[key as keyof typeof profile.interests];
      if (score < 62) return null;
      const label = INTEREST_REASON[key];
      return label ?? null;
    })
    .filter((x): x is string => !!x);
  for (const hit of interestHits) {
    if (positive.length >= 4) break;
    if (!positive.includes(hit)) positive.push(hit);
  }

  if (Math.abs(profile.theoryPractice - (overlay.theoryPractice ?? 50)) <= 18) {
    if (profile.theoryPractice >= 62) {
      positive.push("Voliš učiti tako da nešto stvarno napraviš, a ovdje to ima.");
    } else if (profile.theoryPractice <= 38) {
      positive.push("Voliš prvo shvatiti kako nešto radi, a ovaj program to traži.");
    } else {
      positive.push("Odgovara ti i razmišljanje i praktičan rad, a ovaj program ima oboje.");
    }
  }

  if (profile.postSchool.faculty >= 65 && program.duration === 4 && program.academicLoad >= 2) {
    positive.push("Želiš ostaviti vrata za fakultet, a ovaj program ima maturu.");
  }
  if (profile.postSchool.work >= 65 && program.duration === 3) {
    positive.push("Želiš što prije raditi — ovdje se uči vještina za posao.");
  }

  if (workStyleScore >= 68) {
    const env = overlay.environment ?? {};
    if ((env.computer ?? 0) >= 0.7) positive.push("Odgovara ti rad za računalom, a ovdje ga ima dosta.");
    if ((env.workshop ?? 0) >= 0.7) positive.push("Odgovara ti radionica i rad s alatom.");
    if ((env.health ?? 0) >= 0.7) positive.push("Odgovara ti rad u zdravstvu, uz ljude kojima treba pomoć.");
    if ((env.studio ?? 0) >= 0.7) positive.push("Odgovara ti stvarati u radionici ili učionici.");
    if ((env.nature ?? 0) >= 0.7 || (env.field ?? 0) >= 0.7) {
      positive.push("Odgovara ti rad vani, na terenu.");
    }
  }

  const mathReq = overlay.requirements?.mathematics;
  if ((mathReq === "high" || mathReq === "medium-high") && profile.tolerance.math < 45) {
    caution.push(
      "Ovdje ima dosta matematike. Ako te program jako zanima, vrijedi ga pogledati — samo računaj da treba vježbati.",
    );
  }
  if (profile.schoolContext.hardSubjects.includes("matematika") && (program.subjectWeights.matematika ?? 0) >= 2) {
    caution.push(
      "Matematika ti trenutno teže ide, a ovdje je ima. Ako te program zanima, vrijedi ga pogledati — samo obrati pažnju na taj dio.",
    );
  }
  if ((overlay.requirements?.people === "high" || overlay.requirements?.people === "medium-high") && profile.tolerance.people < 40) {
    caution.push(
      "Ovdje se svaki dan dosta radi s ljudima, a tvoji odgovori kažu da ti to manje leži. Pogledaj kako izgleda običan dan.",
    );
  }
  if (program.duration === 3 && profile.postSchool.faculty >= 70) {
    caution.push(
      "Ovaj program traje 3 godine i nema mature. Ako kasnije želiš fakultet, usporedi i četverogodišnje smjerove.",
    );
  }
  if (program.type === "gimnazija" && profile.theoryPractice >= 70) {
    caution.push(
      "U gimnaziji se više sjedi i uči iz knjiga. Ti više voliš konkretan rad — nije smetnja, samo je ritam drugačiji.",
    );
  }
  if (program.type === "umjetnicka") {
    caution.push(
      "Za upis obično treba prijemni ili mapa radova. To kviz ne ocjenjuje — raspitaj se na vrijeme što škola traži.",
    );
  }
  if (program.entryBar === "visok" && profile.schoolContext.averageBand === "good") {
    caution.push(
      "Za ovaj program često treba više bodova. To nije odluka — provjeri bodove u kalkulatoru i pitaj školu.",
    );
  }
  if (overlay.requirements?.reading === "high" && profile.tolerance.reading < 40) {
    caution.push("Ovdje ima dosta čitanja i učenja iz tekstova, a to ti trenutno manje leži.");
  }
  if (!positive.length) {
    positive.push("Prema tvojim odgovorima, ovaj program ti se djelomično slaže.");
  }
  const readinessNotes = [...new Set(caution)].slice(0, 3);
  return {
    positive: [...new Set(positive)].slice(0, 4),
    caution: readinessNotes,
    answerReasons,
    interestLine: interestLineFor(profile, interestScore),
    readinessNotes,
  };
};

export const calculateProgramMatch = (
  profile: JuniorStudentProfile,
  program: HighSchoolProgram,
  options: AnalyzeOptions = {},
): JuniorProgramMatch => {
  const overlay = resolveProgramProfile(program);
  const interestScore = weightedFit(profile.interests, overlay.interests);
  const thinkingFit = weightedFit(profile.thinking, overlay.thinking);
  const learningFit = weightedFit(profile.learning, overlay.learning);
  const theoryFit = round100(100 - Math.abs(profile.theoryPractice - (overlay.theoryPractice ?? 50)));
  const learningFitScore = round100(learningFit * 0.45 + thinkingFit * 0.35 + theoryFit * 0.2);
  const workStyleScore = weightedFit(profile.environment, overlay.environment);
  const requirementFitScore = requirementFit(profile, overlay);
  const valuesFit = weightedFit(profile.values, overlay.values);
  const postFit = weightedFit(profile.postSchool, overlay.postSchool);
  const motivationScore = round100(valuesFit * 0.45 + postFit * 0.55 + consideringBoost(profile, program));
  const { boost, constraintPenalty } = signalAdjustment(profile, program);
  const constraintScore = round100(100 - constraintPenalty + readinessAdjustment(profile, program));
  const overall = round100(
    interestScore * 0.32 +
      learningFitScore * 0.22 +
      workStyleScore * 0.14 +
      requirementFitScore * 0.1 +
      motivationScore * 0.12 +
      constraintScore * 0.1 +
      boost +
      priorityAdjustment(options.priority, profile, program, overlay),
  );
  const { positive, caution, answerReasons, interestLine, readinessNotes } = buildExplanations(
    profile,
    program,
    overlay,
    workStyleScore,
    options.answers ?? {},
    interestScore,
  );
  const matchPercentage = clamp(overall, 1, 99);
  const workstyleFit =
    program.academicLoad >= 3
      ? round100(100 - profile.theoryPractice)
      : program.academicLoad <= 1
        ? profile.theoryPractice
        : 50;

  return {
    program,
    matchPercentage,
    overallScore: matchPercentage,
    interestScore: round100(interestScore),
    learningFitScore,
    workStyleScore: round100(workStyleScore),
    requirementFitScore,
    motivationScore,
    constraintScore,
    confidence: round100(avg([interestScore, learningFitScore, workStyleScore, motivationScore])),
    interestFit: weightedFit(toLegacyInterestScores(profile), program.interestWeights),
    subjectFit: weightedFit(profile.subjects, program.subjectWeights),
    workstyleFit: round100(workstyleFit),
    signalBoost: boost,
    reasons: positive,
    warnings: caution,
    positiveReasons: positive,
    cautionReasons: caution,
    answerReasons,
    interestLine,
    readinessNotes,
    availability: getProgramAvailability(program),
  };
};

export const pathwayFromProfile = (profile: JuniorStudentProfile): JuniorPathway => {
  const academicScore = round100(
    avg([
      profile.learning.theory,
      profile.thinking.analytical,
      profile.thinking.investigative,
      profile.postSchool.faculty,
      100 - profile.theoryPractice,
      profile.tolerance.concentration,
    ]),
  );
  const practicalScore = round100(
    avg([
      profile.learning.practical,
      profile.thinking.practical,
      profile.thinking.technical,
      profile.theoryPractice,
      profile.postSchool.work,
      profile.interests.practical,
    ]),
  );
  const diff = academicScore - practicalScore;
  if (diff >= 15) {
    return {
      academicScore,
      practicalScore,
      direction: "gimnazija",
      title: "Više ti odgovara učenje i širi program",
      explanation:
        "Prema tvojim odgovorima, voliš shvatiti kako stvari rade i ostaviti otvoren nastavak škole. Vrijedi pogledati gimnaziju ili četverogodišnje smjerove — i tehničke ako ti se slažu s onim što te zanima.",
    };
  }
  if (diff <= -15) {
    return {
      academicScore,
      practicalScore,
      direction: "strukovna",
      title: "Više ti odgovara konkretan, praktičan put",
      explanation:
        "Prema tvojim odgovorima, više ti leži učiti kroz zadatke i vidljiv rezultat. Strukovni i obrtnički programi to daju — a četverogodišnji smjerovi i dalje ostavljaju vrata za maturu.",
    };
  }
  return {
    academicScore,
    practicalScore,
    direction: "balanced",
    title: "Odgovara ti i učenje i praktičan rad",
    explanation:
      "Tvoji odgovori nisu samo na jednoj strani. Četverogodišnji tehnički programi često su dobra sredina — učiš vještinu i možeš ići na maturu. Gimnazija ima smisla ako želiš još vremena prije odluke.",
  };
};

export const computeJuniorPathway = (answers: JuniorAnswers): JuniorPathway =>
  pathwayFromProfile(calculateQuizProfile(answers));

const detectContradictions = (profile: JuniorStudentProfile): string[] => {
  const notes: string[] = [];
  if ((profile.signals.health_medicine ?? 0) >= 4 && profile.tolerance.people < 40) {
    notes.push(
      "Zanimljiva razlika: zanima te zdravlje, ali manje ti leži stalni rad s ljudima. Vrijedi pogledati i laboratorij ili farmaciju, ne samo njegu.",
    );
  }
  if ((profile.signals.tech_computers ?? 0) >= 4 && profile.tolerance.math < 35 && profile.interests.technology >= 70) {
    notes.push(
      "Zanimaju te računala i tehnika, a matematika ti trenutno manje leži. To nije razlog za odustajanje — usporedi i smjerove s više rada rukama.",
    );
  }
  if (profile.postSchool.faculty >= 70 && profile.theoryPractice >= 75) {
    notes.push(
      "Želiš fakultet, a jako te vuče i rad rukama. Četverogodišnji tehnički programi često spajaju oboje bolje nego samo gimnazija ili samo trogodišnji zanat.",
    );
  }
  return notes;
};

const profileSummaryFrom = (profile: JuniorStudentProfile): string => {
  const interest = INTEREST_DIMS.map((key) => ({ key, score: profile.interests[key] })).sort((a, b) => b.score - a.score)[0];
  const drive =
    interest && interest.score >= 60
      ? ` Posebno te zanima ${(juniorTraitLabels.interests[interest.key] ?? interest.key).toLowerCase()}.`
      : "";
  if (profile.theoryPractice >= 62) {
    return `Prema tvojim odgovorima, najviše ti leži kad nešto stvarno napraviš, ne samo pročitaš.${drive}`;
  }
  if (profile.theoryPractice <= 38) {
    return `Prema tvojim odgovorima, najviše ti leži kad prvo shvatiš kako nešto radi.${drive}`;
  }
  return `Prema tvojim odgovorima, odgovara ti i razmišljanje i praktičan rad.${drive}`;
};

const learningSummaryFrom = (profile: JuniorStudentProfile): string => {
  if (profile.theoryPractice >= 68) {
    return "Najviše ti odgovara učenje kroz zadatke i vidljiv rezultat, uz manje samog sjedenja nad knjigom.";
  }
  if (profile.theoryPractice <= 32) {
    return "Najviše ti odgovara prvo pročitati i shvatiti, pa tek onda krenuti na zadatak.";
  }
  if (profile.learning.group >= 68 && profile.learning.independent < 50) {
    return "Najviše ti odgovara učiti s drugima — objasniti i rješavati zajedno.";
  }
  if (profile.learning.independent >= 68) {
    return "Odgovara ti učiti sam, svojim tempom, uz zadatke koje možeš rastaviti na korake.";
  }
  return "Najviše ti odgovara i učenje iz knjige i praktični zadaci.";
};

const driversFrom = (profile: JuniorStudentProfile): string[] => {
  const pool = [
    ...THINKING_DIMS.map((key) => ({
      label: juniorTraitLabels.thinking[key] ?? key,
      score: profile.thinking[key],
    })),
    ...INTEREST_DIMS.map((key) => ({
      label: juniorTraitLabels.interests[key] ?? key,
      score: profile.interests[key],
    })),
    { label: "rješavanje problema", score: profile.learning.problems },
    { label: "samostalni rad", score: profile.learning.independent },
    { label: "rad u grupi", score: profile.learning.group },
    { label: "praktičan rad", score: profile.learning.practical },
  ];
  return pool
    .sort((a, b) => b.score - a.score)
    .filter((x, i, arr) => arr.findIndex((y) => y.label === x.label) === i && x.score >= 58)
    .slice(0, 5)
    .map((x) => x.label);
};

const topTraitsFrom = (profile: JuniorStudentProfile): ProfileTrait[] => {
  const rows: ProfileTrait[] = [
    ...INTEREST_DIMS.map((key) => ({
      key,
      group: "interests" as const,
      label: juniorTraitLabels.interests[key] ?? key,
      score: profile.interests[key],
      band: bandFor(profile.interests[key]),
    })),
    ...THINKING_DIMS.map((key) => ({
      key,
      group: "thinking" as const,
      label: juniorTraitLabels.thinking[key] ?? key,
      score: profile.thinking[key],
      band: bandFor(profile.thinking[key]),
    })),
  ];
  const interesting = rows.filter((r) => r.score !== 50).sort((a, b) => b.score - a.score);
  return (interesting.length >= 5 ? interesting : rows.sort((a, b) => b.score - a.score)).slice(0, 8);
};

const computeConfidence = (
  profile: JuniorStudentProfile,
  matches: JuniorProgramMatch[],
  answers: JuniorAnswers,
): JuniorConfidence => {
  const interestValues = INTEREST_DIMS.map((k) => profile.interests[k]);
  const spread = Math.max(...interestValues) - Math.min(...interestValues);
  const differentiation = clamp(spread, 0, 55) / 55;
  const answered = Object.values(answers).filter((v) => v !== undefined && v !== "skip");
  const midCount = answered.filter((v) => v === 3 || v === "mix" || v === "both" || v === "unsure").length;
  const decisiveness = answered.length ? 1 - midCount / answered.length : 0;
  const separation =
    matches.length >= 3 ? clamp(matches[0].matchPercentage - matches[2].matchPercentage, 0, 18) / 18 : 0.4;
  const score = round100((differentiation * 0.42 + decisiveness * 0.33 + separation * 0.25) * 100);

  if (profile.answeredCount < 8) {
    return {
      level: "low",
      score: Math.min(score, 28),
      explanation:
        "Još par odgovora pa ćemo moći predložiti smjerove. Sada je još rano.",
    };
  }
  if (score >= 65) {
    return {
      level: "high",
      score,
      explanation:
        "Tvoji odgovori se dosta slažu. Ovo nije odluka — ali se vidi koji ti se smjerovi više slažu.",
    };
  }
  if (score >= 40) {
    return {
      level: "medium",
      score,
      explanation:
        "Imaš nekoliko stvari koje te jednako zanimaju. Ovo su prijedlozi za istraživanje, ne jedan točan odgovor.",
    };
  }
  return {
    level: "low",
    score,
    explanation:
      "Još istražuješ što ti odgovara. Nije problem što još ne znaš — usporedi par smjerova i vidi što ti zvuči najbliže.",
  };
};

const consideringNoteFor = (profile: JuniorStudentProfile, matches: JuniorProgramMatch[]): string | null => {
  if (!profile.considering) return null;
  const needle = normalizeText(profile.considering);
  const hit = matches
    .map((m) => m.program)
    .find((p) => {
      const blob = normalizeText(`${p.name} ${p.matchKeywords.join(" ")}`);
      return needle.split(/\s+/).some((t) => t.length >= 4 && blob.includes(t)) || blob.includes(needle);
    });
  if (hit) {
    const pct = matches.find((m) => m.program.id === hit.id)?.matchPercentage ?? 0;
    return `U kvizu stoji da razmišljaš o „${profile.considering}”. To se najbliže slaže s programom ${hit.name} (${pct}% prema tvojim odgovorima).`;
  }
  return `U kvizu stoji da razmišljaš o „${profile.considering}”. Usporedi tu ideju s programima niže: gdje se slaže, a gdje ne.`;
};

export const analyzeJuniorQuiz = (answers: JuniorAnswers, options: AnalyzeOptions = {}): JuniorQuizAnalysis => {
  const profile = calculateQuizProfile(answers);
  const pathway = pathwayFromProfile(profile);
  const interestScores = toLegacyInterestScores(profile);
  const matches = highSchoolPrograms
    .map((program) => calculateProgramMatch(profile, program, { ...options, answers }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .map((m) => ({ ...m, matchPercentage: clamp(m.matchPercentage, 1, 99), overallScore: clamp(m.overallScore, 1, 99) }));

  const confidence = computeConfidence(profile, matches, answers);
  const indecisive =
    confidence.level === "low" &&
    profile.answeredCount >= 8 &&
    Math.max(...INTEREST_DIMS.map((k) => profile.interests[k])) - Math.min(...INTEREST_DIMS.map((k) => profile.interests[k])) < 22;

  const displayMatches = matches.map((m) => {
    if (!indecisive && confidence.level !== "low") return m;
    const capped = clamp(Math.min(m.matchPercentage, 78), 1, 99);
    return { ...m, matchPercentage: capped, overallScore: capped };
  });

  const recommendations = displayMatches.slice(0, JUNIOR_TOP_RECOMMENDATIONS);
  const lessAligned = [...displayMatches]
    .sort((a, b) => a.matchPercentage - b.matchPercentage)
    .filter((m) => !recommendations.some((r) => r.program.id === m.program.id))
    .slice(0, 3);

  const topInterests = INTEREST_KEYS.map((category) => ({
    category,
    label: juniorInterestLabels[category],
    score: interestScores[category],
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const subjectRows = SUBJECT_KEYS.map((category) => ({
    category,
    label: juniorSubjectLabels[category],
    score: profile.subjects[category],
  })).sort((a, b) => b.score - a.score);
  const topSubjects = (subjectRows.filter((s) => s.score !== 50).slice(0, 3).length
    ? subjectRows.filter((s) => s.score !== 50)
    : subjectRows
  ).slice(0, 3);

  const specialNotes: string[] = [];
  if ((profile.signals.security_service ?? 0) >= 4) {
    specialNotes.push(
      "Zanimaju te policija, vojska ili vatrogasci? Za to se školuješ nakon srednje. Dobro je završiti četverogodišnju školu — plus kondicija.",
    );
  }

  return {
    profile,
    interestScores,
    subjectScores: profile.subjects,
    topInterests,
    topSubjects,
    topTraits: topTraitsFrom(profile),
    pathway,
    recommendations,
    lessAligned,
    allMatches: displayMatches,
    confidence,
    indecisive,
    insufficientData: profile.answeredCount < 8,
    contradictions: detectContradictions(profile),
    profileSummary: profileSummaryFrom(profile),
    drivers: driversFrom(profile),
    learningSummary: learningSummaryFrom(profile),
    consideringNote: consideringNoteFor(profile, displayMatches),
    excludedBySignals: matches.filter((m) => m.constraintScore <= 55).length,
    specialNotes,
    priority: options.priority ?? null,
  };
};
