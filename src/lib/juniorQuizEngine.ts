/**
 * Junior kviz engine — usmjeravanje učenika 8. razreda prema srednjim školama.
 *
 * Mjeri tri dimenzije:
 *  1. Interesi (6 kategorija, prilagođeni RIASEC za osnovnoškolce)
 *  2. Školski predmeti (samoprocjena: "ide mi i volim")
 *  3. Stil učenja i rada (akademski vs. praktični put)
 *
 * Preporuke su obitelji stvarnih srednjoškolskih programa (gimnazije, tehničke,
 * umjetničke i obrtničke škole), a svaka se povezuje sa stvarnom bazom škola
 * (srednjaPrograms.ts) kako bi učenik vidio koliko škola u Hrvatskoj nudi program.
 */

import quizData from "@/data/junior-quiz/questions.json";
import programsData from "@/data/junior-quiz/high-school-programs.json";
import { srednjaProgramCounties } from "@/data/srednjaPrograms";

// ---------------------------------------------------------------------------
// Tipovi
// ---------------------------------------------------------------------------

export type JuniorSectionKey = "interests" | "subjects" | "workstyle";

export type JuniorInterestCategory =
  | "prakticno"
  | "istrazivanje"
  | "kreativa"
  | "ljudi"
  | "organizacija"
  | "red";

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
  | "security_service";

export type JuniorQuestion = {
  id: number;
  section: JuniorSectionKey;
  category: string;
  question: string;
  hint?: string;
  signalKey?: JuniorSignalKey;
  /** Zabavni oblačić koji iskoči uz pitanje (može se kliknuti ili ignorirati). */
  joke?: string;
};

export type JuniorSection = {
  key: JuniorSectionKey;
  title: string;
  blurb: string;
};

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
  academicLoad: number; // 0–3: koliko programa traži teorijskog učenja
  boostSignals: Partial<Record<JuniorSignalKey, number>>;
  requiresSignals: Partial<Record<JuniorSignalKey, number>>;
  matchKeywords: string[];
  goodFor: string[];
  /** Tipičan upisni prag: koliko je realno teško upasti. */
  entryBar: "visok" | "srednji" | "nizi";
  /** Što upis stvarno traži (pragovi, prijemni, potvrde) — za pošten prikaz. */
  entryNote: string;
};

export type JuniorAnswers = Record<number, number>; // questionId -> Likert 1–5

export type SchoolAvailability = {
  totalSchools: number;
  exampleSchools: { name: string; city: string }[];
};

export type JuniorProgramMatch = {
  program: HighSchoolProgram;
  matchPercentage: number;
  interestFit: number;
  subjectFit: number;
  workstyleFit: number;
  signalBoost: number;
  reasons: string[];
  warnings: string[];
  availability: SchoolAvailability;
};

export type JuniorPathway = {
  /** 0–100: koliko učeniku odgovara akademski (gimnazijski) put */
  academicScore: number;
  /** 0–100: koliko učeniku odgovara praktični (strukovni) put */
  practicalScore: number;
  direction: "gimnazija" | "strukovna" | "balanced";
  title: string;
  explanation: string;
};

export type JuniorConfidence = {
  level: "high" | "medium" | "low";
  score: number; // 0–100
  explanation: string;
};

export type JuniorQuizAnalysis = {
  interestScores: Record<JuniorInterestCategory, number>;
  subjectScores: Record<JuniorSubjectCategory, number>;
  topInterests: { category: JuniorInterestCategory; label: string; score: number }[];
  topSubjects: { category: JuniorSubjectCategory; label: string; score: number }[];
  pathway: JuniorPathway;
  recommendations: JuniorProgramMatch[];
  confidence: JuniorConfidence;
  /** Broj programa uklonjenih tvrdim filterima (averzija ili prag signala). */
  excludedBySignals: number;
  /** Posebne napomene (npr. put prema policiji/vojsci ide nakon srednje škole). */
  specialNotes: string[];
};

// ---------------------------------------------------------------------------
// Podaci
// ---------------------------------------------------------------------------

export const juniorSections = quizData.sections as JuniorSection[];
export const juniorQuestions = quizData.questions as JuniorQuestion[];
export const juniorInterestLabels = quizData.interestCategories as Record<
  JuniorInterestCategory,
  string
>;
export const juniorSubjectLabels = quizData.subjectCategories as Record<
  JuniorSubjectCategory,
  string
>;
export const highSchoolPrograms = programsData as HighSchoolProgram[];

export const JUNIOR_TOP_RECOMMENDATIONS = 8;

export const juniorProgramTypeLabels: Record<HighSchoolProgramType, string> = {
  gimnazija: "Gimnazija",
  tehnicka: "Tehnička / strukovna",
  umjetnicka: "Umjetnička škola",
  obrtnicka: "Obrtnička (zanat)",
};

// ---------------------------------------------------------------------------
// Pomoćne funkcije
// ---------------------------------------------------------------------------

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Likert prosjek (1–5) -> 0–100 */
const likertAvgToScore = (values: number[]): number => {
  if (values.length === 0) return 0;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return clamp(Math.round(((avg - 1) / 4) * 100), 0, 100);
};

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Skupi odgovore po kategoriji unutar sekcije. */
const collectByCategory = (
  answers: JuniorAnswers,
  section: JuniorSectionKey
): Record<string, number[]> => {
  const grouped: Record<string, number[]> = {};
  for (const q of juniorQuestions) {
    if (q.section !== section) continue;
    const answer = answers[q.id];
    if (typeof answer !== "number") continue;
    if (!grouped[q.category]) grouped[q.category] = [];
    grouped[q.category].push(answer);
  }
  return grouped;
};

const scoresFromGrouped = <T extends string>(
  grouped: Record<string, number[]>,
  keys: readonly T[]
): Record<T, number> => {
  const result = {} as Record<T, number>;
  for (const key of keys) {
    result[key] = likertAvgToScore(grouped[key] ?? []);
  }
  return result;
};

const INTEREST_KEYS: readonly JuniorInterestCategory[] = [
  "prakticno",
  "istrazivanje",
  "kreativa",
  "ljudi",
  "organizacija",
  "red",
];

const SUBJECT_KEYS: readonly JuniorSubjectCategory[] = [
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

/** Mapa signalKey -> Likert odgovor (1–5). */
export const buildJuniorSignalMap = (
  answers: JuniorAnswers
): Partial<Record<JuniorSignalKey, number>> => {
  const map: Partial<Record<JuniorSignalKey, number>> = {};
  for (const q of juniorQuestions) {
    if (!q.signalKey) continue;
    const answer = answers[q.id];
    if (typeof answer === "number") map[q.signalKey] = answer;
  }
  return map;
};

/** Ponderirani prosjek score-ova (0–100) prema težinama 1–3. */
const weightedFit = (
  scores: Record<string, number>,
  weights: Partial<Record<string, number>>
): number | null => {
  let weightSum = 0;
  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (!weight) continue;
    const score = scores[key];
    if (typeof score !== "number") continue;
    total += score * weight;
    weightSum += weight;
  }
  if (weightSum === 0) return null;
  return clamp(Math.round(total / weightSum), 0, 100);
};

/** Boost/penal iz signalnih pitanja: (odgovor − 3) × 4.4 × težina, ukupno ±16. */
const computeSignalBoost = (
  signalMap: Partial<Record<JuniorSignalKey, number>>,
  boostSignals: Partial<Record<JuniorSignalKey, number>>
): number => {
  let boost = 0;
  for (const [key, weight] of Object.entries(boostSignals)) {
    if (!weight) continue;
    const answer = signalMap[key as JuniorSignalKey];
    if (typeof answer !== "number") continue;
    boost += (answer - 3) * 4.4 * (weight / 3);
  }
  return clamp(Math.round(boost), -16, 16);
};

const passesRequiredSignals = (
  signalMap: Partial<Record<JuniorSignalKey, number>>,
  requiresSignals: Partial<Record<JuniorSignalKey, number>>
): boolean => {
  for (const [key, minimum] of Object.entries(requiresSignals)) {
    if (!minimum) continue;
    const answer = signalMap[key as JuniorSignalKey];
    if (typeof answer !== "number" || answer < minimum) return false;
  }
  return true;
};

/**
 * Averzija: ako je učenik na ključni signal programa (težina ≥ 2) odgovorio
 * s 1 („ne, nikako”), program se u potpunosti isključuje iz preporuka.
 * Temeljeno na SCCT nalazima — aktivno izbjegavanje domene jači je prediktor
 * od umjerenog interesa, pa takav program ne nudimo ni kao zadnju opciju.
 */
const hasSignalAversion = (
  signalMap: Partial<Record<JuniorSignalKey, number>>,
  boostSignals: Partial<Record<JuniorSignalKey, number>>
): boolean => {
  for (const [key, weight] of Object.entries(boostSignals)) {
    if ((weight ?? 0) < 2) continue;
    if (signalMap[key as JuniorSignalKey] === 1) return true;
  }
  return false;
};

// ---------------------------------------------------------------------------
// Dostupnost programa u stvarnim školama
// ---------------------------------------------------------------------------

const availabilityCache = new Map<number, SchoolAvailability>();

/** Prebroji škole iz stvarne baze (srednja.hr) koje nude program. */
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
        if (examples.length < 3) {
          examples.push({ name: school.name, city: school.city });
        }
      }
    }
  }

  const availability: SchoolAvailability = { totalSchools: total, exampleSchools: examples };
  availabilityCache.set(program.id, availability);
  return availability;
};

// ---------------------------------------------------------------------------
// Putokaz: gimnazija vs. strukovna
// ---------------------------------------------------------------------------

const workstyleScore = (
  grouped: Record<string, number[]>,
  categories: JuniorWorkstyleCategory[]
): number => {
  const values: number[] = [];
  for (const cat of categories) {
    for (const v of grouped[cat] ?? []) values.push(v);
  }
  return likertAvgToScore(values);
};

export const computeJuniorPathway = (answers: JuniorAnswers): JuniorPathway => {
  const grouped = collectByCategory(answers, "workstyle");
  const workstyleAcademic = workstyleScore(grouped, ["teorija", "faks", "disciplina", "sjedenje"]);
  const workstylePractical = workstyleScore(grouped, ["zanat", "praksa"]);

  // Istraživanja (npr. švicarska kohorta, Vocations and Learning 2020) pokazuju da
  // istraživački interesi predviđaju izbor općeg obrazovanja, a praktični izbor
  // strukovnog puta — zato interese miješamo u putokaz uz izravna pitanja o stilu rada.
  const interestScores = scoresFromGrouped(collectByCategory(answers, "interests"), INTEREST_KEYS);
  const academicScore = Math.round(0.7 * workstyleAcademic + 0.3 * interestScores.istrazivanje);
  const practicalScore = Math.round(0.7 * workstylePractical + 0.3 * interestScores.prakticno);
  const diff = academicScore - practicalScore;

  if (diff >= 15) {
    return {
      academicScore,
      practicalScore,
      direction: "gimnazija",
      title: "Akademski put ti dobro leži",
      explanation:
        "Tvoji odgovori pokazuju da ti učenje, teorija i plan za fakultet dobro sjedaju. Gimnazija ili zahtjevniji četverogodišnji program vjerojatno su pravi smjer — ali pogledaj i tehničke programe koji te zanimaju.",
    };
  }
  if (diff <= -15) {
    return {
      academicScore,
      practicalScore,
      direction: "strukovna",
      title: "Praktični put ti dobro leži",
      explanation:
        "Najviše te vuku konkretni zadaci i brzi rezultati. Strukovne i obrtničke škole daju ti zanat i praksu — a vrata fakulteta ostaju otvorena kroz četverogodišnje programe i maturu.",
    };
  }
  return {
    academicScore,
    practicalScore,
    direction: "balanced",
    title: "Otvorena su ti oba puta",
    explanation:
      "Podjednako ti odgovaraju učenje i praktičan rad. Četverogodišnji tehnički programi često su super sredina — daju zanat, ali i maturu za fakultet. Gimnazija je dobar izbor ako želiš još vremena za odluku.",
  };
};

// ---------------------------------------------------------------------------
// Razlozi i upozorenja po programu
// ---------------------------------------------------------------------------

const buildReasons = (
  program: HighSchoolProgram,
  interestScores: Record<JuniorInterestCategory, number>,
  subjectScores: Record<JuniorSubjectCategory, number>,
  signalMap: Partial<Record<JuniorSignalKey, number>>
): string[] => {
  const reasons: string[] = [];

  const signalLabels: Partial<Record<JuniorSignalKey, string>> = {
    hands_on_craft: "voliš popravljati i raditi rukama",
    tech_computers: "zanimaju te računala i programiranje",
    art_visual: "voliš crtati i dizajnirati",
    helping_people: "voliš pomagati drugima",
    animals_nature: "voliš životinje",
    science_experiments: "vole te pokusi i znanost",
    music_performance: "voliš glazbu i nastupanje",
    health_medicine: "privlači te medicina i zdravstvo",
    business_entrepreneur: "privlači te vlastiti posao",
    numbers_data: "dobro ti idu brojke i tablice",
    plants_outdoor: "voliš prirodu i rad vani",
    cooking_food: "voliš kuhati",
    beauty_style: "zanimaju te styling i njega",
    sport_active: "sport ti je važan dio života",
    languages_travel: "vole te jezici i putovanja",
    security_service: "privlače te uniformirane službe",
  };

  for (const [key] of Object.entries(program.boostSignals).sort(
    (a, b) => (b[1] ?? 0) - (a[1] ?? 0)
  )) {
    const answer = signalMap[key as JuniorSignalKey];
    if (typeof answer === "number" && answer >= 4) {
      const label = signalLabels[key as JuniorSignalKey];
      if (label) reasons.push(`Rekao/la si da ${label}.`);
    }
    if (reasons.length >= 2) break;
  }

  const strongInterests = Object.entries(program.interestWeights)
    .filter(([key, weight]) => (weight ?? 0) >= 2 && interestScores[key as JuniorInterestCategory] >= 60)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  if (strongInterests.length > 0) {
    const key = strongInterests[0][0] as JuniorInterestCategory;
    reasons.push(`Jak ti je interes: ${juniorInterestLabels[key].toLowerCase()}.`);
  }

  const strongSubjects = Object.entries(program.subjectWeights)
    .filter(([key, weight]) => (weight ?? 0) >= 2 && subjectScores[key as JuniorSubjectCategory] >= 60)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  if (strongSubjects.length > 0) {
    const key = strongSubjects[0][0] as JuniorSubjectCategory;
    reasons.push(`U školi ti dobro ide: ${juniorSubjectLabels[key].toLowerCase()}.`);
  }

  if (reasons.length === 0) {
    reasons.push("Ukupni profil interesa i predmeta dobro se poklapa s ovim programom.");
  }
  return reasons.slice(0, 3);
};

const buildProgramWarnings = (
  program: HighSchoolProgram,
  subjectScores: Record<JuniorSubjectCategory, number>,
  pathway: JuniorPathway,
  avgSubjectScore: number
): string[] => {
  const warnings: string[] = [];

  const mathWeight = program.subjectWeights.matematika ?? 0;
  if (mathWeight >= 2 && subjectScores.matematika < 40) {
    warnings.push(
      "Ovaj program traži solidnu matematiku, a rekao/la si da ti baš ne leži — računaj na dodatni trud."
    );
  }

  // Visok upisni prag + slabija samoprocjena predmeta -> pošteno upozori.
  if (program.entryBar === "visok" && avgSubjectScore < 55) {
    warnings.push(
      "Upisni pragovi za ovaj program su visoki, a školski predmeti ti po tvojoj procjeni idu osrednje — obavezno provjeri svoje bodove u Kalkulatoru."
    );
  }

  if (program.type === "gimnazija" && pathway.academicScore < 45) {
    warnings.push(
      "Gimnazija znači puno redovitog učenja i teorije — tvoji odgovori pokazuju da te to trenutno manje privlači."
    );
  }

  if (program.duration === 3) {
    warnings.push(
      "Trogodišnji program ne završava maturom — za fakultet bi kasnije trebao/la doškolovanje."
    );
  }

  if (program.type === "umjetnicka") {
    warnings.push("Za upis se obično polaže prijemni (portfolio ili audicija) — počni se pripremati na vrijeme.");
  }

  return warnings.slice(0, 2);
};

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

const matchProgram = (
  program: HighSchoolProgram,
  interestScores: Record<JuniorInterestCategory, number>,
  subjectScores: Record<JuniorSubjectCategory, number>,
  pathway: JuniorPathway,
  signalMap: Partial<Record<JuniorSignalKey, number>>,
  avgSubjectScore: number
): JuniorProgramMatch => {
  const interestFit = weightedFit(interestScores, program.interestWeights) ?? 50;
  const subjectFit = weightedFit(subjectScores, program.subjectWeights) ?? 50;

  // Uskladi program s time koliko učeniku leži teorija odnosno praksa.
  let workstyleFit: number;
  if (program.academicLoad >= 3) {
    workstyleFit = pathway.academicScore;
  } else if (program.academicLoad === 2) {
    workstyleFit = Math.round(0.5 * pathway.academicScore + 0.5 * pathway.practicalScore);
  } else {
    workstyleFit = pathway.practicalScore;
  }

  const signalBoost = computeSignalBoost(signalMap, program.boostSignals);

  const base = 0.4 * interestFit + 0.3 * subjectFit + 0.3 * workstyleFit;
  const matchPercentage = clamp(Math.round(base + signalBoost), 1, 99);

  return {
    program,
    matchPercentage,
    interestFit,
    subjectFit,
    workstyleFit,
    signalBoost,
    reasons: buildReasons(program, interestScores, subjectScores, signalMap),
    warnings: buildProgramWarnings(program, subjectScores, pathway, avgSubjectScore),
    availability: getProgramAvailability(program),
  };
};

// ---------------------------------------------------------------------------
// Pouzdanost preporuke
// ---------------------------------------------------------------------------

const computeJuniorConfidence = (
  answers: JuniorAnswers,
  interestScores: Record<JuniorInterestCategory, number>,
  recommendations: JuniorProgramMatch[]
): JuniorConfidence => {
  // 1. Koliko se interesi razlikuju (profil "sve mi je isto" daje nisku pouzdanost)
  const values = INTEREST_KEYS.map((k) => interestScores[k]);
  const spread = Math.max(...values) - Math.min(...values); // 0–100
  const differentiation = clamp(spread, 0, 60) / 60; // 0–1

  // 2. Odlučnost odgovora (udio odgovora koji nisu "onako" = 3)
  const answered = Object.values(answers).filter((v) => typeof v === "number");
  const decisive = answered.filter((v) => v !== 3).length;
  const decisiveness = answered.length > 0 ? decisive / answered.length : 0;

  // 3. Razmak između najbolje i 4. preporuke
  const separation =
    recommendations.length >= 4
      ? clamp(recommendations[0].matchPercentage - recommendations[3].matchPercentage, 0, 20) / 20
      : 0.5;

  const score = Math.round((differentiation * 0.4 + decisiveness * 0.35 + separation * 0.25) * 100);

  if (score >= 65) {
    return {
      level: "high",
      score,
      explanation:
        "Tvoji su odgovori jasni i dosljedni — preporuke se dobro razlikuju i možeš im vjerovati kao ozbiljnom putokazu.",
    };
  }
  if (score >= 40) {
    return {
      level: "medium",
      score,
      explanation:
        "Preporuke su dobar smjer, ali dio odgovora je neodlučan. Razmisli o prvih nekoliko programa i porazgovaraj s nekim tko te dobro poznaje.",
    };
  }
  return {
    level: "low",
    score,
    explanation:
      "Puno odgovora je bilo neutralno pa se interesi još ne razlikuju jasno. To je sasvim normalno u 8. razredu — shvati rezultate kao ideje za istraživanje, ne kao konačan odgovor.",
  };
};

// ---------------------------------------------------------------------------
// Glavna analiza
// ---------------------------------------------------------------------------

export const analyzeJuniorQuiz = (answers: JuniorAnswers): JuniorQuizAnalysis => {
  const interestScores = scoresFromGrouped(collectByCategory(answers, "interests"), INTEREST_KEYS);
  const subjectScores = scoresFromGrouped(collectByCategory(answers, "subjects"), SUBJECT_KEYS);
  const pathway = computeJuniorPathway(answers);
  const signalMap = buildJuniorSignalMap(answers);

  const subjectValues = SUBJECT_KEYS.map((k) => subjectScores[k]);
  const avgSubjectScore = subjectValues.reduce((a, b) => a + b, 0) / subjectValues.length;

  const eligible = highSchoolPrograms.filter(
    (program) =>
      passesRequiredSignals(signalMap, program.requiresSignals) &&
      !hasSignalAversion(signalMap, program.boostSignals)
  );
  const excludedBySignals = highSchoolPrograms.length - eligible.length;

  const matches = eligible
    .map((program) =>
      matchProgram(program, interestScores, subjectScores, pathway, signalMap, avgSubjectScore)
    )
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const recommendations = matches.slice(0, JUNIOR_TOP_RECOMMENDATIONS);

  const topInterests = INTEREST_KEYS.map((category) => ({
    category,
    label: juniorInterestLabels[category],
    score: interestScores[category],
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Napomene za interese koji nemaju izravan srednjoškolski program u stvarnoj
  // bazi škola — poštenije je objasniti put nego preporučiti nepostojeći program.
  const specialNotes: string[] = [];
  if ((signalMap.security_service ?? 0) >= 4) {
    specialNotes.push(
      "Zanimaju te policija, vojska ili vatrogasci? Za ta zanimanja se školuješ NAKON srednje (Policijska akademija, Hrvatsko vojno učilište). Najbolja podloga je bilo koja četverogodišnja škola koju ćeš dobro završiti — uz redovito treniranje kondicije."
    );
  }

  const topSubjects = SUBJECT_KEYS.map((category) => ({
    category,
    label: juniorSubjectLabels[category],
    score: subjectScores[category],
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    interestScores,
    subjectScores,
    topInterests,
    topSubjects,
    pathway,
    recommendations,
    confidence: computeJuniorConfidence(answers, interestScores, recommendations),
    excludedBySignals,
    specialNotes,
  };
};
