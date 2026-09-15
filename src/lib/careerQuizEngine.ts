/**
 * HZZ „Moj izbor” kompatibilna logika v2.0 (prilagođeno upitniku 2×50):
 * - zbroj bodova po kategoriji (Likert 1–5)
 * - normalizacija po kategoriji: (zbroj / (broj pitanja u kategoriji × 5)) × 100
 * - profil: top 3 interesna tipa (RIASEC)
 * - zanimanje: prosjek relevantnih normaliziranih interesa/kompetencija,
 *   završni rezultat = 0,7×interesi + 0,3×kompetencije (+ balans), prag vidi HZZ_CAREER_MATCH_THRESHOLD_PERCENT
 */

export type InterestQuestion = {
  id: number;
  question: string;
  category: string;
  description?: string;
  /** Za usklađivanje odgovora s pojedinim zanimanjima (npr. biljke vs životinje). */
  signalKey?: string;
};
export type CompetencyQuestion = { id: number; question: string; category: string; description?: string };

export type CareerInterestSignalKey =
  | "plant_crop_interest"
  | "animal_vet_interest"
  | "law_judiciary_interest"
  | "music_interest"
  | "acting_interest"
  | "medicine_health_interest"
  | "teaching_mentoring_interest"
  | "sales_persuasion_interest"
  | "office_administration_interest"
  | "media_stage_interest"
  | "science_lab_interest"
  // Prošireni signali za precizno podudaranje studijskih programa (v3).
  | "software_it_interest"
  | "math_interest"
  | "sport_kinesiology_interest"
  | "security_defense_interest"
  | "design_visual_interest"
  | "language_literature_interest"
  | "social_help_interest"
  | "entrepreneurship_interest"
  | "nature_outdoor_interest"
  | "materials_construction_interest"
  | "machines_tech_interest";

export type CareerRow = {
  id: number;
  name: string;
  description: string;
  education: string;
  interestCategories: string[];
  competencyCategories: string[];
  /** Tipični fakulteti / smjerovi u HR za upis (preporuka za daljnji odabir) */
  facultyPaths?: string[];
  salary?: string;
  employmentPerspective?: string;
  keywords?: string[];
  /**
   * Prag na signalu iz interesnog upitnika (Likert 1–5). Zanimanje se **ne prikazuje** ako je odgovor **strogo ispod** praga.
   * Primjer: vrijednost `2` = isključuje se samo uz **1 (uopće ne)**; 2–5 ostaju u igri (blaga nesigurnost ne gasi preporuku).
   */
  requiresInterestSignals?: Partial<Record<CareerInterestSignalKey, number>>;
  /**
   * false = tipičan ulaz u zanimanje nije sveučilišni studij (kviz je «koji faks») — ne prikazuj u preporukama.
   */
  typicalEntryRequiresUniversity?: boolean;
};

/** Likert gornja granica po pitanju. */
export const QUIZ_LIKERT_MAX = 5;

/** Očekivani broj pitanja po bloku (interesi / kompetencije) — mora odgovarati JSON-u. */
export const QUIZ_QUESTIONS_PER_BLOCK = 50;

/**
 * @deprecated Stari HZZ djelitelj po kategoriji (47×5). Koristi {@link normalizeScoresByCategory}.
 */
export const HZZ_MAX_SCALE = QUIZ_QUESTIONS_PER_BLOCK * QUIZ_LIKERT_MAX;

/**
 * Prag za „podudaranje” zanimanja u punoj analizi (interesi + kompetencije).
 * Ispod službenog HZZ 30% da korisnik uvijek dobije barem poredane prijedloge iz baze.
 */
export const HZZ_CAREER_MATCH_THRESHOLD_PERCENT = 18;

/** Broj preporuka u UI: smjerovi studija i zanimanja. */
export const QUIZ_TOP_FACULTY_PATHS = 10;
export const QUIZ_TOP_CAREERS = 10;

export type PersonalitySlot = { type: string; score: number };

export function calculateCategoryScores(
  answers: number[],
  questions: { category: string }[],
): Record<string, number> {
  const scores: Record<string, number> = {};
  const allCategories = [...new Set(questions.map((q) => q.category))];
  allCategories.forEach((cat) => {
    scores[cat] = 0;
  });
  answers.forEach((score, index) => {
    if (typeof score === "number" && score >= 1 && questions[index]) {
      const category = questions[index].category;
      scores[category] = (scores[category] || 0) + score;
    }
  });
  return scores;
}

/** Broj pitanja po svakoj kategoriji (za ispravnu normalizaciju kad kategorije nemaju isti broj pitanja). */
export function countQuestionsPerCategory<T extends { category: string }>(questions: T[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of questions) {
    counts[q.category] = (counts[q.category] ?? 0) + 1;
  }
  return counts;
}

/**
 * Normalizacija 0–100 po kategoriji: zbroj / (broj pitanja u kategoriji × max Likert) × 100.
 */
export function normalizeScoresByCategory(
  scores: Record<string, number>,
  questionsPerCategory: Record<string, number>,
  likertMax = QUIZ_LIKERT_MAX,
): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [category, score] of Object.entries(scores)) {
    const n = questionsPerCategory[category] ?? 0;
    const denom = n * likertMax;
    normalized[category] = denom > 0 ? Math.round((score / denom) * 100) : 0;
  }
  return normalized;
}

/** @deprecated Koristi {@link normalizeScoresByCategory} s brojem pitanja po kategoriji. */
export function normalizeScores(scores: Record<string, number>, maxPerCategory = HZZ_MAX_SCALE): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [category, score] of Object.entries(scores)) {
    normalized[category] = Math.round((score / maxPerCategory) * 100);
  }
  return normalized;
}

export function getPersonalityProfile(interestScoresNormalized: Record<string, number>): {
  primary: PersonalitySlot;
  secondary: PersonalitySlot;
  tertiary: PersonalitySlot;
} {
  const sorted = Object.entries(interestScoresNormalized)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type, score]) => ({ type, score }));

  const pad = (i: number): PersonalitySlot => sorted[i] || { type: "", score: 0 };

  return {
    primary: pad(0),
    secondary: pad(1),
    tertiary: pad(2),
  };
}

export type CareerMatchResult = {
  career: CareerRow;
  matchPercentage: number;
  interestMatch: number;
  competencyMatch: number;
  /** Koliko su jasni negativni / pozitivni signali iz interesnog bloka prilagodili rezultat (0–1). */
  signalMultiplier?: number;
};

type RecommendationDomain =
  | "economics_business"
  | "law_public"
  | "health_medicine"
  | "arts_media"
  | "engineering_tech"
  | "science_research"
  | "education_helping"
  | "agri_env"
  | "general";

const SIGNAL_RESPONSE_MULTIPLIER: Record<number, number> = {
  1: 0.08,
  2: 0.42,
  3: 0.72,
  4: 0.9,
  5: 1,
};

function getSignalPenaltyMultiplierForLikert(score: number): number {
  return SIGNAL_RESPONSE_MULTIPLIER[Math.round(score)] ?? 1;
}

function normalizeBlob(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function inferRecommendationDomainFromText(value: string): RecommendationDomain {
  const blob = normalizeBlob(value);
  if (
    /medicin|lijecn|zdrav|farmacij|sestra|tehnicar|fizioterap|veterin|rehabilit|klin|bolnic|njega/.test(blob)
  ) {
    return "health_medicine";
  }
  if (/pravo|pravni|sud|odvjet|sudstvo|javna uprava|upravn/.test(blob)) {
    return "law_public";
  }
  if (/ekonom|financ|racunov|marketing|menadz|poduzet|poslov|bank|trgov/.test(blob)) {
    return "economics_business";
  }
  if (/glazb|muzi|glum|kazalis|film|fotograf|dizajn|arhitekt|novinar|medij|vizual|likovn/.test(blob)) {
    return "arts_media";
  }
  if (/psiholog|socijal|ucitelj|pedagog|mentor|obrazov|ljudima|savjetov|hr /.test(` ${blob} `)) {
    return "education_helping";
  }
  if (/agronom|poljopriv|biljn|usjev|hortik|stocar|sumar|ekolog|okolis|tlo|prehramb/.test(blob)) {
    return "agri_env";
  }
  if (/kemij|fizik|pmf|znanost|istraz|laborator|matematik|biolog/.test(blob)) {
    return "science_research";
  }
  if (/stroj|elektro|informat|program|softver|racunar|gradjev|inzenjer|tehnik|tehnolog/.test(blob)) {
    return "engineering_tech";
  }
  return "general";
}

function inferRecommendationDomainForCareer(career: CareerRow): RecommendationDomain {
  return inferRecommendationDomainFromText(
    [career.name, career.description, career.education, ...(career.facultyPaths || []), ...(career.keywords || [])].join(" "),
  );
}

function inferRecommendationDomainForPath(path: string): RecommendationDomain {
  return inferRecommendationDomainFromText(path);
}

function allocateIntegerSlots(weights: number[], totalSlots: number): number[] {
  if (weights.length === 0) return [];
  const safe = weights.map((w) => Math.max(0, w));
  const sum = safe.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    const base = Math.floor(totalSlots / safe.length);
    const rem = totalSlots - base * safe.length;
    return safe.map((_, i) => base + (i < rem ? 1 : 0));
  }
  const exact = safe.map((w) => (w / sum) * totalSlots);
  const floors = exact.map((x) => Math.floor(x));
  const remainder = totalSlots - floors.reduce((a, b) => a + b, 0);
  const ranked = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => (b.frac !== a.frac ? b.frac - a.frac : a.i - b.i));
  const out = [...floors];
  for (let i = 0; i < remainder; i++) out[ranked[i].i]++;
  return out;
}

function applyDomainConsensusBoost(matches: CareerMatchResult[]): CareerMatchResult[] {
  if (matches.length === 0) return matches;

  const domainTotals = new Map<RecommendationDomain, number>();
  for (const m of matches) {
    const domain = inferRecommendationDomainForCareer(m.career);
    domainTotals.set(domain, (domainTotals.get(domain) || 0) + m.matchPercentage);
  }

  const total = [...domainTotals.values()].reduce((a, b) => a + b, 0) || 1;
  return matches
    .map((m) => {
      const domain = inferRecommendationDomainForCareer(m.career);
      const share = (domainTotals.get(domain) || 0) / total;
      const multiplier = Math.min(1.18, Math.max(0.9, 0.92 + share * 0.65));
      return {
        ...m,
        matchPercentage: Math.max(0, Math.min(100, Math.round(m.matchPercentage * multiplier))),
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

function applyDomainConsensusBoostToInterestMatches<T extends { career: CareerRow; interestMatch: number }>(items: T[]): T[] {
  if (items.length === 0) return items;
  const domainTotals = new Map<RecommendationDomain, number>();
  for (const item of items) {
    const domain = inferRecommendationDomainForCareer(item.career);
    domainTotals.set(domain, (domainTotals.get(domain) || 0) + item.interestMatch);
  }
  const total = [...domainTotals.values()].reduce((a, b) => a + b, 0) || 1;
  return items
    .map((item) => {
      const domain = inferRecommendationDomainForCareer(item.career);
      const share = (domainTotals.get(domain) || 0) / total;
      const multiplier = Math.min(1.16, Math.max(0.9, 0.93 + share * 0.55));
      return {
        ...item,
        interestMatch: Math.max(0, Math.min(100, Math.round(item.interestMatch * multiplier))),
      };
    })
    .sort((a, b) => b.interestMatch - a.interestMatch);
}

/**
 * Signal pitanja služe kao psihološki "reality check":
 * - 1 = snažno ne želim → zanimanje praktički nestaje
 * - 2 = slabo zanimanje → i dalje moguće, ali znatno spušteno
 * - 3 = neutralno → umjereno spuštanje
 * - 4/5 = nema relevantne kazne
 */
export function getCareerInterestSignalMultiplier(
  career: CareerRow,
  signals: Partial<Record<CareerInterestSignalKey, number>>,
): number {
  const req = career.requiresInterestSignals;
  if (!req) return 1;

  let multiplier = 1;
  for (const [signalKey, minLikert] of Object.entries(req) as [CareerInterestSignalKey, number][]) {
    const value = signals[signalKey];
    if (value === undefined) continue;
    if (value < minLikert) return 0;
    multiplier *= getSignalPenaltyMultiplierForLikert(value);
  }
  return Math.max(0, Math.min(1, Number(multiplier.toFixed(3))));
}

function matchCareerHzzV2(
  career: CareerRow,
  normalizedInterestScores: Record<string, number>,
  normalizedCompetencyScores: Record<string, number>,
  interestSignals: Partial<Record<CareerInterestSignalKey, number>> = {},
): CareerMatchResult {
  let interestMatch = 0;
  let competencyMatch = 0;

  if (career.interestCategories?.length) {
    const interestTotal = career.interestCategories.reduce(
      (sum, cat) => sum + (normalizedInterestScores[cat] || 0),
      0,
    );
    interestMatch = Math.round(interestTotal / career.interestCategories.length);
  }

  if (career.competencyCategories?.length) {
    const competencyTotal = career.competencyCategories.reduce(
      (sum, cat) => sum + (normalizedCompetencyScores[cat] || 0),
      0,
    );
    competencyMatch = Math.round(competencyTotal / career.competencyCategories.length);
  }

  /** Linearni HZZ zbroj + naglasak na slabiju dimenziju da rezultat bolje prati oba skupa odgovora. */
  const linear = interestMatch * 0.7 + competencyMatch * 0.3;
  const balance = Math.min(interestMatch, competencyMatch);
  const rawMatchScore = linear * 0.62 + balance * 0.38;
  const signalMultiplier = getCareerInterestSignalMultiplier(career, interestSignals);
  const matchScore = Math.round(rawMatchScore * signalMultiplier);
  const matchPercentage = Math.max(0, Math.min(100, matchScore));

  return {
    career,
    interestMatch,
    competencyMatch,
    matchPercentage,
    signalMultiplier,
  };
}

/** Sva zanimanja s postotkom, sortirano (za agregaciju i fallback liste). */
export function rankAllCareersHzzV2(
  normalizedInterestScores: Record<string, number>,
  normalizedCompetencyScores: Record<string, number>,
  careers: CareerRow[],
  interestSignals: Partial<Record<CareerInterestSignalKey, number>> = {},
): CareerMatchResult[] {
  return careers
    .map((career) => matchCareerHzzV2(career, normalizedInterestScores, normalizedCompetencyScores, interestSignals))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function findMatchingCareersHzzV2(
  normalizedInterestScores: Record<string, number>,
  normalizedCompetencyScores: Record<string, number>,
  careers: CareerRow[],
  thresholdPercent: number = HZZ_CAREER_MATCH_THRESHOLD_PERCENT,
  interestSignals: Partial<Record<CareerInterestSignalKey, number>> = {},
): CareerMatchResult[] {
  return rankAllCareersHzzV2(normalizedInterestScores, normalizedCompetencyScores, careers, interestSignals).filter(
    (x) => x.matchPercentage > thresholdPercent,
  );
}

/** Jedan smjer upisa (fakultet / program) iz agregacije više zanimanja. */
export type FacultyPathRecommendation = {
  path: string;
  /** Zbroj pondera (za sortiranje; više fragmenta / zanimanja = veći signal). */
  weight: number;
  /** Zanimanja čija preporuka uključuje ovaj smjer. */
  careerNames: string[];
  /** Prosjek postotka podudaranja povezanih zanimanja s odgovorima (0–100). */
  avgMatchPercent: number;
  /** Udio u zbroju signala među prikazanim redovima (zbroj točno 100% za cijelu listu). */
  sharePercent: number;
  /** Tekstualni okvir kad nema dovoljno signala iz baze — prema RIASEC tipu. */
  fromRiasecFallback?: boolean;
};

/** Okvirni smjerovi studija u HR kad treba fallback (prva faza ili vrlo nizak signal). */
const RIASEC_OUTLINE_FACULTY_HR: Record<string, string> = {
  realistic:
    "Okvirno: tehnički, prirodoslovni i strukovni studiji (npr. strojarstvo, elektrotehnika, građevina, poljoprivreda, laboratorijski rad).",
  investigative:
    "Okvirno: znanstveni i istraživački programi (npr. PMF, medicina, informatika, kemija, matematika, veterina).",
  artistic:
    "Okvirno: kreativni i umjetnički studiji (npr. likovna i dramska akademija, arhitektura, dizajn, mediji).",
  social:
    "Okvirno: studiji usmjereni na ljude (npr. pedagogija, psihologija, socijalni rad, zdravstvena i sportska edukacija).",
  enterprising:
    "Okvirno: poslovni, pravni i menadžerski smjerovi (npr. ekonomija, pravo, političke znanosti, poduzetništvo).",
  conventional:
    "Okvirno: strukturirani administrativni i financijski programi (npr. računovodstvo, javna uprava, informacijske znanosti).",
};

const REALISTIC_RIASEC_NO_PLANT_FOCUS =
  "Okvirno: tehnički, prirodoslovni i strukovni studiji (npr. strojarstvo, elektrotehnika, građevina, šumarstvo gdje nije fokus na biljkama, laboratorijski rad) — bez naglaska na agronomiju biljaka ako ti rad s biljkama i usjevima nije privlačan.";

/** Likert 1–5 po signalu (iz pitanja s `signalKey` u JSON-u). */
export function buildInterestSignalMap(
  interestQs: InterestQuestion[],
  interestAnswers: number[],
): Partial<Record<CareerInterestSignalKey, number>> {
  const buckets = new Map<CareerInterestSignalKey, number[]>();
  interestQs.forEach((q, idx) => {
    const key = q.signalKey as CareerInterestSignalKey | undefined;
    if (!key) return;
    const v = interestAnswers[idx];
    if (typeof v === "number" && v >= 1 && v <= QUIZ_LIKERT_MAX) {
      const prev = buckets.get(key) ?? [];
      prev.push(v);
      buckets.set(key, prev);
    }
  });
  const out: Partial<Record<CareerInterestSignalKey, number>> = {};
  for (const [key, values] of buckets.entries()) {
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    out[key] = Number(avg.toFixed(2));
  }
  return out;
}

/**
 * Uklanja zanimanja koja ne spadaju u «put preko fakulteta» ili su u kontradikciji s jasnim negativnim signalom iz upitnika.
 */
export function filterCareersForRecommendations(
  careers: CareerRow[],
  interestQs: InterestQuestion[],
  interestAnswers: number[],
): CareerRow[] {
  const signals = buildInterestSignalMap(interestQs, interestAnswers);
  return careers.filter((c) => {
    if (c.typicalEntryRequiresUniversity === false) return false;
    const req = c.requiresInterestSignals;
    if (!req) return true;
    for (const [sig, minLikert] of Object.entries(req) as [CareerInterestSignalKey, number][]) {
      const v = signals[sig];
      if (v !== undefined && v < minLikert) return false;
    }
    return true;
  });
}

function realisticRiasecOutlineForSignals(signals: Partial<Record<CareerInterestSignalKey, number>>): string {
  const plant = signals.plant_crop_interest;
  /** U skladu s pragom u bazi: samo izričito «1 — uopće ne» mijenja okvirni tekst. */
  if (plant !== undefined && plant < 2) {
    return REALISTIC_RIASEC_NO_PLANT_FOCUS;
  }
  return RIASEC_OUTLINE_FACULTY_HR.realistic;
}

/**
 * Kad agregacija iz baze zanimanja ne vrati niti jedan smjer, gradi okvirnu listu iz RIASEC bodova.
 */
export function buildFacultyRecommendationsFromRiasec(
  interestScoresNormalized: Record<string, number>,
  topN = QUIZ_TOP_FACULTY_PATHS,
  interestSignals?: Partial<Record<CareerInterestSignalKey, number>>,
): FacultyPathRecommendation[] {
  const sorted = Object.entries(interestScoresNormalized)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN);

  const weights = sorted.map(([, sc]) => sc);
  const shares = distributeIntegerPercentsFromWeights(weights);

  return sorted.map(([type, score], idx) => {
    let path = RIASEC_OUTLINE_FACULTY_HR[type] ?? `Okvirno: područje interesa „${type}”.`;
    if (type === "realistic" && interestSignals) {
      path = realisticRiasecOutlineForSignals(interestSignals);
    }
    return {
      path,
      weight: score,
      careerNames: [],
      avgMatchPercent: Math.round(score),
      sharePercent: shares[idx] ?? 0,
      fromRiasecFallback: true,
    };
  });
}

/**
 * Od nenegativnih pondera (npr. težine smjerova) gradi cijele postotke 0–100 čiji je zbroj točno 100.
 * Najveći ostatak — standardno za „udio među N stavki“ kad ne želimo zaokruživanje koje razbije sumu.
 */
function distributeIntegerPercentsFromWeights(weights: number[]): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    const base = Math.floor(100 / n);
    const rem = 100 - base * n;
    return weights.map((_, i) => base + (i < rem ? 1 : 0));
  }
  const exact = weights.map((w) => (w / sum) * 100);
  const floors = exact.map((x) => Math.floor(x));
  const remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const withFrac = exact.map((x, i) => ({ i, frac: x - Math.floor(x) }));
  withFrac.sort((a, b) => (b.frac !== a.frac ? b.frac - a.frac : a.i - b.i));
  const out = [...floors];
  for (let k = 0; k < remainder; k++) {
    out[withFrac[k].i]++;
  }
  return out;
}

/** Razdvaja unutar jednog zapisa u `facultyPaths` (npr. „A; B“) na zasebne smjerove. */
function splitFacultyPathRecord(record: string): string[] {
  return record
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Agregira tekstualne smjerove upisa (`facultyPaths`) ponderom po zanimanju.
 * Koristi se i za puni rezultat (ponder = ukupni %) i za prvu fazu (ponder = interes %).
 */
export function aggregateFacultyPathsByWeight(
  items: { career: CareerRow; weight: number }[],
  topN = QUIZ_TOP_FACULTY_PATHS,
): FacultyPathRecommendation[] {
  const acc = new Map<
    string,
    { weight: number; careers: Set<string>; matchByCareer: Map<string, number>; domain: RecommendationDomain }
  >();

  for (const { career, weight } of items) {
    const paths = career.facultyPaths;
    if (!paths?.length) continue;
    for (const raw of paths) {
      for (const fragment of splitFacultyPathRecord(raw)) {
        const prev =
          acc.get(fragment) || {
            weight: 0,
            careers: new Set<string>(),
            matchByCareer: new Map<string, number>(),
            domain: inferRecommendationDomainForPath(fragment),
          };
        prev.weight += weight;
        prev.careers.add(career.name);
        prev.matchByCareer.set(career.name, weight);
        acc.set(fragment, prev);
      }
    }
  }

  const allEntries = [...acc.entries()].sort((a, b) => b[1].weight - a[1].weight);

  const domainTotals = new Map<RecommendationDomain, number>();
  for (const [, value] of allEntries) {
    domainTotals.set(value.domain, (domainTotals.get(value.domain) || 0) + value.weight);
  }

  const domainOrder = [...domainTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([domain]) => domain);
  const slotCounts = allocateIntegerSlots(
    domainOrder.map((domain) => domainTotals.get(domain) || 0),
    topN,
  );

  const selected = new Set<string>();
  const sorted: typeof allEntries = [];
  domainOrder.forEach((domain, idx) => {
    const take = slotCounts[idx] || 0;
    if (take <= 0) return;
    const inDomain = allEntries.filter(([path, value]) => value.domain === domain && !selected.has(path)).slice(0, take);
    for (const entry of inDomain) {
      selected.add(entry[0]);
      sorted.push(entry);
    }
  });
  for (const entry of allEntries) {
    if (sorted.length >= topN) break;
    if (selected.has(entry[0])) continue;
    selected.add(entry[0]);
    sorted.push(entry);
  }

  const rawWeights = sorted.map(([, v]) => v.weight);
  const shares = distributeIntegerPercentsFromWeights(rawWeights);

  return sorted.map(([path, { weight, careers, matchByCareer }], idx) => {
    const matches = [...matchByCareer.values()];
    const avgMatchPercent =
      matches.length > 0 ? Math.round(matches.reduce((a, b) => a + b, 0) / matches.length) : 0;
    return {
      path,
      weight: Math.round(weight * 10) / 10,
      careerNames: [...careers].sort((a, b) => a.localeCompare(b, "hr")),
      avgMatchPercent,
      sharePercent: shares[idx] ?? 0,
    };
  });
}

/**
 * Na temelju svih zanimanja iznad praga (interesi + kompetencije) agregira preporuke za upis.
 */
export function aggregateFacultyRecommendationsFromMatches(
  matches: CareerMatchResult[],
  topN = QUIZ_TOP_FACULTY_PATHS,
): FacultyPathRecommendation[] {
  return aggregateFacultyPathsByWeight(
    matches.map((m) => ({ career: m.career, weight: m.matchPercentage })),
    topN,
  );
}

export type HzzV2Analysis = {
  interestScoresNormalized: Record<string, number>;
  competencyScoresNormalized: Record<string, number>;
  personalityProfile: ReturnType<typeof getPersonalityProfile>;
  recommended: CareerMatchResult[];
  totalMatches: number;
  /** Preporuke za studij — izračun iz svih podudaranja iznad praga, ne samo iz top N zanimanja. */
  facultyRecommendations: FacultyPathRecommendation[];
  /** Sva zanimanja u bazi rangirana (puna lista za naprednu analizu / grupiranje). */
  allRanked: CareerMatchResult[];
  /** Zanimanja iznad praga podudaranja (prazno ako nitko ne prelazi — UI tada koristi allRanked kao fallback). */
  matchesAboveThreshold: CareerMatchResult[];
  /** Prag korišten za matchesAboveThreshold. */
  matchThresholdPercent: number;
};

export type InterestsPhaseOnlyAnalysis = {
  interestScoresNormalized: Record<string, number>;
  personalityProfile: ReturnType<typeof getPersonalityProfile>;
  recommendedByInterest: { career: CareerRow; interestMatch: number }[];
  totalInterestMatches: number;
  /** Preporuke za upis na temelju svih zanimanja iznad praga interesa (ne samo top lista). */
  facultyRecommendations: FacultyPathRecommendation[];
};

/** Nakon pitanja o interesima (blok 1): profil RIASEC + gruba ljestvica zanimanja samo po interesima (bez kompetencija). */
export function analyzeInterestsPhaseOnly(
  interestQs: InterestQuestion[],
  interestAnswers: number[],
  careers: CareerRow[],
  topN = QUIZ_TOP_CAREERS,
): InterestsPhaseOnlyAnalysis {
  const interestSignals = buildInterestSignalMap(interestQs, interestAnswers);
  const eligibleCareers = filterCareersForRecommendations(careers, interestQs, interestAnswers);
  const careerPool =
    eligibleCareers.length > 0
      ? eligibleCareers
      : careers.filter((c) => c.typicalEntryRequiresUniversity !== false);

  const interestRaw = calculateCategoryScores(interestAnswers, interestQs);
  const interestPerCat = countQuestionsPerCategory(interestQs);
  const interestScoresNormalized = normalizeScoresByCategory(interestRaw, interestPerCat);
  const personalityProfile = getPersonalityProfile(interestScoresNormalized);

  const allByInterest = careerPool
    .map((career) => {
      let interestMatch = 0;
      if (career.interestCategories?.length) {
        const interestTotal = career.interestCategories.reduce(
          (sum, cat) => sum + (interestScoresNormalized[cat] || 0),
          0,
        );
        interestMatch = Math.round(interestTotal / career.interestCategories.length);
      }
      const signalMultiplier = getCareerInterestSignalMultiplier(career, interestSignals);
      const adjustedInterestMatch = Math.round(interestMatch * signalMultiplier);
      return { career, interestMatch: adjustedInterestMatch, signalMultiplier };
    })
    .sort((a, b) => b.interestMatch - a.interestMatch);

  const allByInterestBoosted = applyDomainConsensusBoostToInterestMatches(allByInterest);
  const rankedStrong = allByInterestBoosted.filter((x) => x.interestMatch > 28);

  /** Okvirna lista smjerova: uvijek top zanimanja po interesu (bez praga), zatim RIASEC ako treba. */
  let facultyRecommendations = aggregateFacultyPathsByWeight(
    allByInterestBoosted.slice(0, 24).map((r) => ({
      career: r.career,
      weight: Math.max(1, r.interestMatch),
    })),
    QUIZ_TOP_FACULTY_PATHS,
  );
  if (facultyRecommendations.length === 0) {
    facultyRecommendations = buildFacultyRecommendationsFromRiasec(
      interestScoresNormalized,
      QUIZ_TOP_FACULTY_PATHS,
      interestSignals,
    );
  }

  const recommendedByInterest =
    rankedStrong.length > 0 ? rankedStrong.slice(0, topN) : allByInterestBoosted.slice(0, topN);
  const totalInterestMatches = rankedStrong.length > 0 ? rankedStrong.length : allByInterestBoosted.length;

  return {
    interestScoresNormalized,
    personalityProfile,
    recommendedByInterest,
    totalInterestMatches,
    facultyRecommendations,
  };
}

export function analyzeHzzMojIzborV2(
  interestQs: InterestQuestion[],
  competencyQs: CompetencyQuestion[],
  interestAnswers: number[],
  competencyAnswers: number[],
  careers: CareerRow[],
  topN = QUIZ_TOP_CAREERS,
): HzzV2Analysis {
  const interestSignals = buildInterestSignalMap(interestQs, interestAnswers);
  const eligibleCareers = filterCareersForRecommendations(careers, interestQs, interestAnswers);
  const careerPool =
    eligibleCareers.length > 0
      ? eligibleCareers
      : careers.filter((c) => c.typicalEntryRequiresUniversity !== false);

  const interestRaw = calculateCategoryScores(interestAnswers, interestQs);
  const competencyRaw = calculateCategoryScores(competencyAnswers, competencyQs);
  const interestPerCat = countQuestionsPerCategory(interestQs);
  const competencyPerCat = countQuestionsPerCategory(competencyQs);
  const interestScoresNormalized = normalizeScoresByCategory(interestRaw, interestPerCat);
  const competencyScoresNormalized = normalizeScoresByCategory(competencyRaw, competencyPerCat);
  const personalityProfile = getPersonalityProfile(interestScoresNormalized);
  const matched = findMatchingCareersHzzV2(
    interestScoresNormalized,
    competencyScoresNormalized,
    careerPool,
    HZZ_CAREER_MATCH_THRESHOLD_PERCENT,
    interestSignals,
  );
  const allRankedRaw = rankAllCareersHzzV2(
    interestScoresNormalized,
    competencyScoresNormalized,
    careerPool,
    interestSignals,
  );
  const matchedBoosted = applyDomainConsensusBoost(matched);
  const allRanked = applyDomainConsensusBoost(allRankedRaw);

  /** Uvijek barem top zanimanja iz baze — nitko ne ostaje s praznom listom. */
  const recommendedPool = matchedBoosted.length > 0 ? matchedBoosted : allRanked;
  const facultySourceForAgg =
    matchedBoosted.length > 0
      ? matchedBoosted
      : allRanked.slice(0, Math.min(24, allRanked.length));

  let facultyRecommendations = aggregateFacultyRecommendationsFromMatches(
    facultySourceForAgg,
    QUIZ_TOP_FACULTY_PATHS,
  );
  if (facultyRecommendations.length === 0) {
    facultyRecommendations = aggregateFacultyPathsByWeight(
      allRanked.slice(0, 24).map((m) => ({
        career: m.career,
        weight: Math.max(1, m.matchPercentage),
      })),
      QUIZ_TOP_FACULTY_PATHS,
    );
  }
  if (facultyRecommendations.length === 0) {
    facultyRecommendations = buildFacultyRecommendationsFromRiasec(
      interestScoresNormalized,
      QUIZ_TOP_FACULTY_PATHS,
      interestSignals,
    );
  }

  return {
    interestScoresNormalized,
    competencyScoresNormalized,
    personalityProfile,
    recommended: recommendedPool.slice(0, topN),
    totalMatches: matchedBoosted.length > 0 ? matchedBoosted.length : allRanked.length,
    facultyRecommendations,
    allRanked,
    matchesAboveThreshold: matchedBoosted,
    matchThresholdPercent: HZZ_CAREER_MATCH_THRESHOLD_PERCENT,
  };
}
