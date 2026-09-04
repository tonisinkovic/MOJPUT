/**
 * Preporuke studijskih programa (v3) — sloj iznad HZZ v2 logike.
 *
 * Za razliku od baze zanimanja, ovdje se svaki studijski program boduje izravno:
 * - interestFit: ponderirani prosjek RIASEC interesa specifičnih za program (0–100)
 * - readinessFit: ponderirani prosjek procijenjenih kompetencija koje program traži (0–100)
 * - signalBoost: specifična pitanja (signalKey) pojačavaju ili spuštaju rezultat
 *   (npr. „Želiš li programiranje?” izravno utječe na Računarstvo, a ne samo na opći profil)
 * - requiresSignals: tvrdi filter — jasan negativan odgovor uklanja program
 * - mathDemand: programi s teškom matematikom dobivaju upozorenje/penal ako su
 *   numeričke kompetencije niske
 *
 * Rezultat uvijek razdvaja „koliko te zanima” od „koliko si spreman/na” i za svaku
 * preporuku vraća obrazloženje i upozorenja, plus globalnu razinu pouzdanosti.
 */

import {
  buildInterestSignalMap,
  calculateCategoryScores,
  countQuestionsPerCategory,
  normalizeScoresByCategory,
  QUIZ_LIKERT_MAX,
  type CareerInterestSignalKey,
  type CompetencyQuestion,
  type InterestQuestion,
} from "@/lib/careerQuizEngine";

export type StudyProgramRow = {
  id: number;
  name: string;
  /** Ključ područja iz study-programs.json → areas. */
  area: string;
  /** Konkretni fakulteti u HR na kojima se program upisuje. */
  faculties: string[];
  description: string;
  /** RIASEC ponderi specifični za program (ključ → težina 1–3). */
  interestWeights: Record<string, number>;
  /** Kompetencijski ponderi (ključ → težina 1–3). */
  competencyWeights: Record<string, number>;
  /** Signali koji pojačavaju/spuštaju rezultat ovisno o odgovoru (težina 1–3). */
  boostSignals?: Partial<Record<CareerInterestSignalKey, number>>;
  /** Tvrdi filter: odgovor ispod praga uklanja program iz preporuka. */
  requiresSignals?: Partial<Record<CareerInterestSignalKey, number>>;
  /** 0–3: koliko je matematika kritična u prvoj godini. */
  mathDemand?: 0 | 1 | 2 | 3;
  /** Što program realno traži — za objašnjenje korisniku. */
  keyDemands?: string[];
};

export type MatchStrength = "jaka" | "umjerena" | "slaba";

export type StudyProgramMatch = {
  program: StudyProgramRow;
  /** Konačni rezultat 0–100. */
  matchPercentage: number;
  /** Iskrena oznaka snage podudaranja — slabe preporuke se ne smiju činiti jakima. */
  strength: MatchStrength;
  /** Podudaranje interesa 0–100. */
  interestFit: number;
  /** Procijenjena spremnost 0–100 (null u fazi 1 kad kompetencije još nisu ispunjene). */
  readinessFit: number | null;
  /** Bodovi dodani/oduzeti zbog specifičnih signala (može biti negativno). */
  signalBoost: number;
  /** Obrazloženje — zašto je program preporučen. */
  reasons: string[];
  /** Upozorenja specifična za program (matematika, slabe kompetencije). */
  warnings: string[];
};

export type RecommendationConfidenceLevel = "visoka" | "srednja" | "niska";

export type RecommendationConfidence = {
  level: RecommendationConfidenceLevel;
  /** 0–100 kompozitni pokazatelj. */
  score: number;
  explanation: string;
};

export type StudyProgramAnalysis = {
  matches: StudyProgramMatch[];
  confidence: RecommendationConfidence;
  /** Broj programa uklonjenih tvrdim filterom (jasan negativan odgovor ili averzija). */
  excludedBySignals: number;
  /** True kad ni najbolja preporuka nije čvrsta — UI to mora jasno reći. */
  weakProfile: boolean;
};

/** Koliko preporučenih programa prikazujemo. */
export const STUDY_PROGRAM_TOP_N = 8;

/** Ispod ovog postotka preporuku uopće ne prikazujemo (osim nužnog minimuma). */
export const STUDY_PROGRAM_MIN_MATCH = 45;

/** Broj preporuka koje zadržavamo čak i kad su ispod praga — uz oznaku „slaba”. */
export const STUDY_PROGRAM_FALLBACK_N = 3;

export function strengthForPercentage(matchPercentage: number): MatchStrength {
  if (matchPercentage >= 70) return "jaka";
  if (matchPercentage >= 55) return "umjerena";
  return "slaba";
}

const INTEREST_LABEL_HR: Record<string, string> = {
  realistic: "praktičan i tehnički rad",
  investigative: "analizu i istraživanje",
  artistic: "kreativnost i izražavanje",
  social: "rad s ljudima",
  enterprising: "vodstvo i poslovnost",
  conventional: "strukturu i organizaciju",
};

const COMPETENCY_LABEL_HR: Record<string, string> = {
  communication: "komunikacija",
  problem_solving: "rješavanje problema",
  leadership: "vodstvo",
  analytical: "analitičke vještine",
  technical: "tehničke vještine",
  numerical: "numeričke vještine",
  writing: "pisanje",
  design: "dizajn",
  learning: "kapacitet učenja",
  presentation: "prezentiranje",
  interpersonal: "međuljudske vještine",
  organization: "organizacija",
  adaptability: "prilagodljivost",
  attention_to_detail: "pažnja na detalje",
  creativity: "kreativnost",
  business_acumen: "poslovni osjećaj",
  domain_knowledge: "specijalizacija",
  teamwork: "timski rad",
  negotiation: "pregovaranje",
  wellness: "zdravlje i pokret",
  research: "istraživanje",
  initiative: "inicijativa",
  financial: "financije",
  stress_management: "otpornost na stres",
  languages: "strani jezici",
  goal_oriented: "usmjerenost na cilj",
  independence: "samostalnost",
  consulting: "savjetovanje",
  diversity: "rad s različitima",
  work_ethic: "radna etika",
  confidence: "samopouzdanje",
  safety: "sigurnost",
  patience: "strpljenje",
  customer_service: "rad s klijentima",
  time_management: "upravljanje vremenom",
  critical_thinking: "kritičko mišljenje",
  emotional_intelligence: "emocionalna inteligencija",
  conflict_resolution: "rješavanje konflikata",
};

function clamp01to100(x: number): number {
  return Math.max(0, Math.min(100, Math.round(x)));
}

/**
 * Klasteri srodnih kompetencija — služe za stabilizaciju procjena.
 *
 * Problem: 28 od 38 kompetencijskih kategorija mjeri se samo JEDNIM pitanjem,
 * pa jedan (ne)raspoložen odgovor može prejako pomaknuti preporuku.
 * Rješenje (psihometrijska praksa za kratke skale): procjena kategorije
 * "steže se" (shrinkage) prema prosjeku klastera srodnih kompetencija —
 * što kategorija ima manje pitanja, to više vjerujemo klasteru.
 */
export const COMPETENCY_CLUSTERS: Record<string, string[]> = {
  analiticko_misljenje: [
    "analytical",
    "critical_thinking",
    "research",
    "problem_solving",
    "learning",
    "domain_knowledge",
  ],
  brojke_i_podaci: ["numerical", "financial"],
  tehnicki_rad: ["technical", "safety"],
  komunikacija_nastup: [
    "communication",
    "presentation",
    "negotiation",
    "consulting",
    "confidence",
    "languages",
    "writing",
  ],
  rad_s_ljudima: [
    "interpersonal",
    "emotional_intelligence",
    "patience",
    "customer_service",
    "diversity",
    "conflict_resolution",
    "teamwork",
  ],
  vodstvo_poslovnost: [
    "leadership",
    "business_acumen",
    "initiative",
    "goal_oriented",
  ],
  kreativnost_dizajn: ["creativity", "design"],
  samoorganizacija: [
    "organization",
    "time_management",
    "attention_to_detail",
    "adaptability",
    "stress_management",
    "work_ethic",
    "independence",
  ],
  tijelo_i_pokret: ["wellness"],
};

const KEY_TO_CLUSTER: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [cluster, keys] of Object.entries(COMPETENCY_CLUSTERS)) {
    for (const key of keys) map[key] = cluster;
  }
  return map;
})();

/**
 * Stabilizirane kompetencijske procjene: kategorija s n pitanja zadržava
 * w(n) vlastite procjene, a ostatak preuzima iz prosjeka svog klastera
 * (ponderiran brojem pitanja). w(1)=0,55; w(2)=0,70; w(≥3)=0,85.
 */
export function robustCompetencyScores(
  normalizedScores: Record<string, number>,
  questionCounts: Record<string, number>,
): Record<string, number> {
  // Prosjek klastera, ponderiran brojem pitanja po kategoriji.
  const clusterTotals: Record<string, { sum: number; n: number }> = {};
  for (const [key, score] of Object.entries(normalizedScores)) {
    const cluster = KEY_TO_CLUSTER[key];
    if (!cluster) continue;
    const n = questionCounts[key] ?? 1;
    const entry = (clusterTotals[cluster] ??= { sum: 0, n: 0 });
    entry.sum += score * n;
    entry.n += n;
  }

  const result: Record<string, number> = {};
  for (const [key, score] of Object.entries(normalizedScores)) {
    const cluster = KEY_TO_CLUSTER[key];
    const totals = cluster ? clusterTotals[cluster] : undefined;
    if (!totals || totals.n === 0) {
      result[key] = score;
      continue;
    }
    const clusterAvg = totals.sum / totals.n;
    const n = questionCounts[key] ?? 1;
    const w = n >= 3 ? 0.85 : n === 2 ? 0.7 : 0.55;
    result[key] = clamp01to100(w * score + (1 - w) * clusterAvg);
  }
  return result;
}

/** Ponderirani prosjek normaliziranih bodova (0–100) po zadanim težinama. */
export function weightedFit(
  weights: Record<string, number>,
  normalizedScores: Record<string, number>,
): number {
  let sum = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (weight <= 0) continue;
    sum += (normalizedScores[key] ?? 0) * weight;
    weightSum += weight;
  }
  return weightSum > 0 ? sum / weightSum : 0;
}

/**
 * Bodovi iz specifičnih signala: prosječan Likert odgovor iznad 3 dodaje,
 * ispod 3 oduzima. Težina 3 i odgovor 5 → +8,8; odgovor 1 → −8,8.
 * Ukupno ograničeno na ±16 da signali usmjeravaju, a ne dominiraju.
 */
export function computeSignalBoost(
  boostSignals: Partial<Record<CareerInterestSignalKey, number>> | undefined,
  signals: Partial<Record<CareerInterestSignalKey, number>>,
): number {
  if (!boostSignals) return 0;
  let boost = 0;
  for (const [key, weight] of Object.entries(boostSignals) as [CareerInterestSignalKey, number][]) {
    const value = signals[key];
    if (value === undefined) continue;
    boost += weight * (value - 3) * 1.47;
  }
  return Math.max(-16, Math.min(16, Math.round(boost * 10) / 10));
}

/** Tvrdi filter: vraća false ako je bilo koji zahtijevani signal strogo ispod praga. */
export function passesRequiredSignals(
  program: StudyProgramRow,
  signals: Partial<Record<CareerInterestSignalKey, number>>,
): boolean {
  const req = program.requiresSignals;
  if (!req) return true;
  for (const [key, min] of Object.entries(req) as [CareerInterestSignalKey, number][]) {
    const value = signals[key];
    if (value !== undefined && value < min) return false;
  }
  return true;
}

/**
 * Averzija: ako je korisnik na ključni signal programa (boost težine ≥ 2)
 * odgovorio s 1 („uopće me ne zanima”), program se potpuno isključuje —
 * ni kao zadnja opcija. Temeljeno na SCCT nalazima: aktivno izbjegavanje
 * domene snažniji je prediktor od umjerenog interesa (npr. tko izričito ne
 * želi medicinu, ne treba dobiti ni fizioterapiju ni sestrinstvo).
 */
export function hasSignalAversion(
  program: StudyProgramRow,
  signals: Partial<Record<CareerInterestSignalKey, number>>,
): boolean {
  if (!program.boostSignals) return false;
  for (const [key, weight] of Object.entries(program.boostSignals) as [
    CareerInterestSignalKey,
    number,
  ][]) {
    if (weight < 2) continue;
    if (signals[key] === 1) return true;
  }
  return false;
}

function buildReasons(
  program: StudyProgramRow,
  interestScores: Record<string, number>,
  competencyScores: Record<string, number> | null,
  signalBoost: number,
): string[] {
  const reasons: string[] = [];

  const topInterests = Object.entries(program.interestWeights)
    .map(([key, weight]) => ({ key, contribution: weight * (interestScores[key] ?? 0) }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 2)
    .filter((x) => (interestScores[x.key] ?? 0) >= 45);

  if (topInterests.length > 0) {
    const parts = topInterests.map(
      (x) => `${INTEREST_LABEL_HR[x.key] ?? x.key} (${interestScores[x.key] ?? 0}%)`,
    );
    reasons.push(`Tvoji interesi za ${parts.join(" i ")} poklapaju se s onim što ovaj studij traži.`);
  }

  if (competencyScores) {
    const topComp = Object.entries(program.competencyWeights)
      .map(([key, weight]) => ({ key, weight, score: competencyScores[key] ?? 0 }))
      .filter((x) => x.weight >= 2 && x.score >= 55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    if (topComp.length > 0) {
      const parts = topComp.map((x) => `${COMPETENCY_LABEL_HR[x.key] ?? x.key} (${x.score}%)`);
      reasons.push(`Procijenjene jake strane: ${parts.join(", ")} — važne za ovaj program.`);
    }
  }

  if (signalBoost >= 5) {
    reasons.push("U odgovorima si izravno potvrdio/la interes za teme ovog studija.");
  }

  if (reasons.length === 0) {
    reasons.push("Podudaranje je umjereno — program prati tvoj opći profil, ali bez jakih specifičnih signala.");
  }

  return reasons;
}

function buildProgramWarnings(
  program: StudyProgramRow,
  competencyScores: Record<string, number> | null,
): string[] {
  const warnings: string[] = [];
  if (!competencyScores) return warnings;

  const numerical = competencyScores.numerical ?? 0;
  const mathDemand = program.mathDemand ?? 0;
  if (mathDemand >= 2 && numerical < 40) {
    warnings.push(
      mathDemand === 3
        ? `Prva godina nosi tešku matematiku, a tvoja procjena numeričkih vještina je ${numerical}% — planiraj ozbiljne pripreme ili instrukcije.`
        : `Program traži solidnu matematiku (procjena numeričkih vještina: ${numerical}%) — provjeri gradivo prve godine.`,
    );
  }

  const weakKey = Object.entries(program.competencyWeights)
    .filter(([key, weight]) => weight >= 2 && key !== "numerical" && (competencyScores[key] ?? 0) < 35)
    .sort((a, b) => (competencyScores[a[0]] ?? 0) - (competencyScores[b[0]] ?? 0))[0];
  if (weakKey) {
    const [key] = weakKey;
    warnings.push(
      `Program se oslanja na: ${COMPETENCY_LABEL_HR[key] ?? key} (tvoja procjena: ${competencyScores[key] ?? 0}%) — to se da razviti, ali računaj s tim.`,
    );
  }

  return warnings;
}

function matchProgram(
  program: StudyProgramRow,
  interestScores: Record<string, number>,
  competencyScores: Record<string, number> | null,
  signals: Partial<Record<CareerInterestSignalKey, number>>,
): StudyProgramMatch {
  const interestFit = clamp01to100(weightedFit(program.interestWeights, interestScores));
  const readinessFit = competencyScores
    ? clamp01to100(weightedFit(program.competencyWeights, competencyScores))
    : null;
  const signalBoost = computeSignalBoost(program.boostSignals, signals);

  let base: number;
  if (readinessFit === null) {
    base = interestFit;
  } else {
    /** 65% interesi + 35% spremnost, uz naglasak na slabiju dimenziju (iskrenost rezultata). */
    const linear = interestFit * 0.65 + readinessFit * 0.35;
    base = linear * 0.75 + Math.min(interestFit, readinessFit) * 0.25;
  }

  /** Penal za tešku matematiku uz vrlo niske numeričke kompetencije. */
  let mathPenalty = 0;
  if (competencyScores && (program.mathDemand ?? 0) === 3 && (competencyScores.numerical ?? 0) < 35) {
    mathPenalty = 6;
  }

  const matchPercentage = clamp01to100(base + signalBoost - mathPenalty);

  return {
    program,
    matchPercentage,
    strength: strengthForPercentage(matchPercentage),
    interestFit,
    readinessFit,
    signalBoost,
    reasons: buildReasons(program, interestScores, competencyScores, signalBoost),
    warnings: buildProgramWarnings(program, competencyScores),
  };
}

/**
 * Zadrži samo preporuke iznad praga; ako ih je premalo, vrati nužni minimum
 * (top 3) koji će u UI-ju biti jasno označen kao slabo podudaranje.
 */
function applyMatchThreshold(ranked: StudyProgramMatch[], topN: number): StudyProgramMatch[] {
  const aboveThreshold = ranked.filter((m) => m.matchPercentage >= STUDY_PROGRAM_MIN_MATCH);
  if (aboveThreshold.length >= STUDY_PROGRAM_FALLBACK_N) {
    return aboveThreshold.slice(0, topN);
  }
  return ranked.slice(0, Math.min(STUDY_PROGRAM_FALLBACK_N, ranked.length));
}

/**
 * Pouzdanost preporuke iz tri komponente:
 * - diferencijacija RIASEC profila (koliko se najjači tip izdvaja od prosjeka ostalih)
 * - odlučnost odgovora (udio odgovora koji nisu neutralni „3”)
 * - razmak među top programima (koliko se vrh liste izdvaja)
 */
export function computeRecommendationConfidence(
  interestScoresNormalized: Record<string, number>,
  interestAnswers: number[],
  topMatches: StudyProgramMatch[],
): RecommendationConfidence {
  const scores = Object.values(interestScoresNormalized).sort((a, b) => b - a);
  const top = scores[0] ?? 0;
  const restAvg = scores.length > 1 ? scores.slice(1).reduce((a, b) => a + b, 0) / (scores.length - 1) : 0;
  const differentiation = Math.max(0, Math.min(30, top - restAvg)) / 30; // 0–1

  const answered = interestAnswers.filter((a) => a >= 1 && a <= QUIZ_LIKERT_MAX);
  const decisive = answered.filter((a) => a !== 3).length;
  const decisiveness = answered.length > 0 ? decisive / answered.length : 0; // 0–1

  let separation = 0;
  if (topMatches.length >= 4) {
    separation = Math.max(0, Math.min(18, topMatches[0].matchPercentage - topMatches[3].matchPercentage)) / 18;
  }

  const score = Math.round(differentiation * 40 + decisiveness * 35 + separation * 25);

  let level: RecommendationConfidenceLevel;
  let explanation: string;
  if (score >= 60) {
    level = "visoka";
    explanation =
      "Tvoji odgovori su dosljedni i jasno razlikuju područja — top preporuke imaju čvrst temelj u onome što si označio/la.";
  } else if (score >= 40) {
    level = "srednja";
    explanation =
      "Profil je prepoznatljiv, ali nekoliko područja je blizu — top preporuke shvati kao uži izbor za daljnje istraživanje, ne kao konačan odgovor.";
  } else {
    level = "niska";
    explanation =
      "Odgovori su dosta ujednačeni ili često neutralni — preporuke tretiraj okvirno, istraži više područja i po potrebi ponovi kviz s odlučnijim odgovorima.";
  }

  return { level, score, explanation };
}

/**
 * Puna analiza studijskih programa (nakon obje faze kviza).
 */
export function analyzeStudyPrograms(
  interestQs: InterestQuestion[],
  competencyQs: CompetencyQuestion[],
  interestAnswers: number[],
  competencyAnswers: number[],
  programs: StudyProgramRow[],
  topN = STUDY_PROGRAM_TOP_N,
): StudyProgramAnalysis {
  const interestRaw = calculateCategoryScores(interestAnswers, interestQs);
  const interestScores = normalizeScoresByCategory(interestRaw, countQuestionsPerCategory(interestQs));
  const competencyCounts = countQuestionsPerCategory(competencyQs);
  const competencyRaw = calculateCategoryScores(competencyAnswers, competencyQs);
  const competencyScores = robustCompetencyScores(
    normalizeScoresByCategory(competencyRaw, competencyCounts),
    competencyCounts,
  );
  const signals = buildInterestSignalMap(interestQs, interestAnswers);

  const eligible = programs.filter(
    (p) => passesRequiredSignals(p, signals) && !hasSignalAversion(p, signals),
  );
  const excludedBySignals = programs.length - eligible.length;

  const ranked = eligible
    .map((p) => matchProgram(p, interestScores, competencyScores, signals))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const matches = applyMatchThreshold(ranked, topN);
  const confidence = computeRecommendationConfidence(interestScores, interestAnswers, ranked);
  const weakProfile = matches.length === 0 || matches[0].matchPercentage < 55;

  return { matches, confidence, excludedBySignals, weakProfile };
}

/**
 * Analiza samo iz interesa (faza 1) — spremnost još nije poznata, rezultat je okviran.
 */
export function analyzeStudyProgramsInterestOnly(
  interestQs: InterestQuestion[],
  interestAnswers: number[],
  programs: StudyProgramRow[],
  topN = STUDY_PROGRAM_TOP_N,
): StudyProgramAnalysis {
  const interestRaw = calculateCategoryScores(interestAnswers, interestQs);
  const interestScores = normalizeScoresByCategory(interestRaw, countQuestionsPerCategory(interestQs));
  const signals = buildInterestSignalMap(interestQs, interestAnswers);

  const eligible = programs.filter(
    (p) => passesRequiredSignals(p, signals) && !hasSignalAversion(p, signals),
  );
  const excludedBySignals = programs.length - eligible.length;

  const ranked = eligible
    .map((p) => matchProgram(p, interestScores, null, signals))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const matches = applyMatchThreshold(ranked, topN);
  const confidence = computeRecommendationConfidence(interestScores, interestAnswers, ranked);
  const weakProfile = matches.length === 0 || matches[0].matchPercentage < 55;

  return { matches, confidence, excludedBySignals, weakProfile };
}
