/**
 * Kalkulator bodova za subvencionirano stanovanje (natječajni sustav MZO-a).
 * Udaljenost u km se ne boduje; bitno je imaš li pravo prijave (prebivalište ≠ mjesto studija).
 */

import rawDorms from "@/data/dorms.json";
import { validateDormsArray } from "./dormValidation";

/** Iz natječaja SCZG za ak. 2025./2026. (obavijest o rezultatima) */
export const PRORACUNSKA_OSNOVICA_EUR_2025 = 441.44;
/** 60 % proračunske osnovice (referentno za natječaj 2025.) */
export const PCT_60_PO_EUR_2025 = 264.86;

export type PublishedCutoff = {
  academic_year: string;
  scope_hr: string;
  points: number | null;
  source_url?: string;
  source_label_hr?: string;
};

export type DormScoringRules = {
  grade_weight: number;
  income_weight: number;
  distance_weight: number;
  special_points: number;
  reference_cohort_grade: number;
  notes_hr?: string;
};

export type Dorm = {
  id: string;
  city: string;
  name: string;
  shortName: string;
  website?: string;
  natječaj_info_url?: string;
  scoring_rules: DormScoringRules;
  /** @deprecated koristi published_cutoff; ostavljeno za kompatibilnost */
  last_year_cutoff?: Record<string, number>;
  published_cutoff?: PublishedCutoff;
  provider_notes_hr?: string;
};

const _loaded = validateDormsArray(rawDorms);
if (import.meta.env.DEV) {
  for (const i of _loaded.issues) {
    if (i.level === "error") console.error("[dorms]", i.message);
    else console.warn("[dorms]", i.message);
  }
}
/** Normalizirani domovi (fallback na sirovi JSON ako validacija ne vrati nijedan zapis) */
export const dorms: Dorm[] =
  _loaded.dorms.length > 0 ? _loaded.dorms : (rawDorms as Dorm[]);

export function getDormById(id: string): Dorm | undefined {
  return dorms.find((d) => d.id === id);
}

/** Mjesečni prihod po članu kućanstva (EUR), prethodna kalendarska godina. */
export const INCOME_BANDS = [
  { id: "le120", label: "do 120,00 EUR", maxEur: 120, points: 750 },
  { id: "120_160", label: "120,01 – 160,00 EUR", maxEur: 160, points: 600 },
  { id: "160_200", label: "160,01 – 200,00 EUR", maxEur: 200, points: 525 },
  { id: "200_240", label: "200,01 – 240,00 EUR", maxEur: 240, points: 450 },
  { id: "240_280", label: "240,01 – 280,00 EUR", maxEur: 280, points: 375 },
  { id: "280_320", label: "280,01 – 320,00 EUR", maxEur: 320, points: 300 },
  { id: "320_360", label: "320,01 – 360,00 EUR", maxEur: 360, points: 225 },
  { id: "360_400", label: "360,01 – 400,00 EUR", maxEur: 400, points: 150 },
  {
    id: "400_po",
    label: `400,01 EUR do 100 % proračunske osnovice (npr. ${PRORACUNSKA_OSNOVICA_EUR_2025.toFixed(2).replace(".", ",")} € u 2025.)`,
    maxEur: null,
    points: 75,
  },
] as const;

export type IncomeBandId = (typeof INCOME_BANDS)[number]["id"];

export type StudyYearOption =
  | "maturant"
  | "g1"
  | "g2"
  | "g3"
  | "g4"
  | "g5"
  | "g6";

/** Prebivalište u odnosu na mjesto studija — ne dodaje bodove, određuje možeš li se uopće prijaviti. */
export type DistanceCategory = "eligible" | "ineligible_same_city";

export const DISTANCE_OPTIONS: {
  id: DistanceCategory;
  label: string;
  /** Informativno — uvijek 0 bodova */
  basePoints: 0;
}[] = [
  {
    id: "eligible",
    label: "Stanujem izvan mjesta u kojem studiram — mogu se prijaviti na natječaj za dom",
    basePoints: 0,
  },
  {
    id: "ineligible_same_city",
    label: "Stanujem u istom mjestu gdje studiram — obično se ne mogu prijaviti na ovaj natječaj",
    basePoints: 0,
  },
];

/** Bodovi prema godini studija (uz oznaku dovoljno ECTS-a u prethodnim godinama gdje to vrijedi). */
const STUDY_YEAR_POINTS: Partial<Record<StudyYearOption, number>> = {
  g2: 100,
  g3: 150,
  g4: 200,
  g5: 250,
  g6: 300,
};

export type SpecialOptionId =
  | "invaliditet2"
  | "branitelj_child_1"
  | "branitelj_child_2"
  | "civil_invalid_parent"
  | "minimalna_naknada"
  | "medjunarodna_zastita"
  | "jedan_roditelj"
  | "oba_roditelja_izravno"
  | "roditelj_dijete"
  | "deficitarni_studij";

export const SPECIAL_OPTIONS: {
  id: SpecialOptionId;
  label: string;
  points: number;
  izravnoPravo?: boolean;
}[] = [
  { id: "invaliditet2", label: "Invaliditet 2. grupe", points: 400 },
  { id: "branitelj_child_1", label: "Djete branitelja / HVO — jedan roditelj (200 bod.)", points: 200 },
  { id: "branitelj_child_2", label: "Djete branitelja / HVO — oba roditelja (400 bod.)", points: 400 },
  { id: "civil_invalid_parent", label: "Roditelj civilni invalid s potpunim invaliditetom (100 %)", points: 200 },
  { id: "minimalna_naknada", label: "Zajamčena minimalna naknada ili slične novčane potpore", points: 750 },
  { id: "medjunarodna_zastita", label: "Međunarodna ili privremena zaštita", points: 750 },
  {
    id: "jedan_roditelj",
    label: "Jedan roditelj umro, nestao ili nepoznat (600 bod.)",
    points: 600,
  },
  {
    id: "oba_roditelja_izravno",
    label: "Oba roditelja umrla, nestala ili nepoznata — posebno pravo (kontaktiraj studentski centar)",
    points: 0,
    izravnoPravo: true,
  },
  { id: "roditelj_dijete", label: "Student roditelj — jedno dijete", points: 500 },
  { id: "deficitarni_studij", label: "Deficitarni studij — među prvima na službenoj listi", points: 200 },
];

export type DormCalculatorInput = {
  gradeAverage: number;
  studyYear: StudyYearOption;
  meetsEcts55Average: boolean;
  incomeBandId: IncomeBandId;
  distance: DistanceCategory;
  specialIds: SpecialOptionId[];
  avgEctsPreviousYears: number | null;
  ectsCurrentYear: number | null;
  invaliditet1: boolean;
};

export type BreakdownLine = { key: string; label: string; points: number; article?: string };

export type DormScoreResult = {
  total: number;
  breakdown: BreakdownLine[];
  warnings: string[];
  /** Nema smisla uspoređivati s natječajem (npr. prebivalište u mjestu studija). */
  competitiveInvalid: boolean;
};

const w = (rule: number, value: number) => {
  const r = Number.isFinite(rule) ? rule : 100;
  const v = Number.isFinite(value) ? value : 0;
  return (r / 100) * v;
};

export function safeRound1(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 10) / 10;
}

/** Teoretski strop za sanity check (nije striktni matematički maksimum). */
export const MAX_SCORE_ROUGH = 5500;

export type ScoreAggregates = {
  grade: number;
  income: number;
  distance: number;
  study: number;
  special: number;
};

/** Grupira pojedinačne stavke u pet kategorija za UI (accordion). */
export function aggregateScoreFromBreakdown(breakdown: BreakdownLine[]): ScoreAggregates {
  const z = { grade: 0, income: 0, distance: 0, study: 0, special: 0 };
  for (const row of breakdown) {
    const p = Number.isFinite(row.points) ? row.points : 0;
    if (row.key === "grade") z.grade += p;
    else if (row.key === "income") z.income += p;
    else if (row.key === "distance_info") z.distance += p;
    else if (row.key === "study") z.study += p;
    else z.special += p;
  }
  return {
    grade: safeRound1(z.grade),
    income: safeRound1(z.income),
    distance: safeRound1(z.distance),
    study: safeRound1(z.study),
    special: safeRound1(z.special),
  };
}

export type ExplainStep = {
  id: string;
  title_hr: string;
  detail_hr: string;
  points: number;
};

/** Čitljiv raspis koraka (za „Objasni izračun“). */
export function explainCalculation(dorm: Dorm, input: DormCalculatorInput): ExplainStep[] {
  const res = calculateDormScore(dorm, input);
  const titles: Record<string, string> = {
    grade: "Prosjek ocjena",
    income: "Prihod po članu kućanstva",
    distance_info: "Prebivalište (kilometri se ne boduju)",
    study: "Godina studija i ECTS",
  };
  return res.breakdown.map((b) => ({
    id: b.key,
    title_hr: titles[b.key] ?? "Posebni uvjeti",
    detail_hr: b.label,
    points: safeRound1(Number.isFinite(b.points) ? b.points : 0),
  }));
}

/** Koliko bodova nedostaje do službenog praga (ako postoji i ima smisla). */
export function pointsBelowCutoff(
  total: number,
  cutoff: number | null,
  competitiveInvalid: boolean,
): number | null {
  if (competitiveInvalid || cutoff == null || !Number.isFinite(total) || !Number.isFinite(cutoff)) return null;
  return Math.max(0, safeRound1(cutoff - total));
}

function computeGradeBlock(
  grade: number,
  refAvg: number,
  avgEctsPrevious: number | null,
  ectsCurrent: number | null,
  rules: DormScoringRules,
): { points: number; warnings: string[] } {
  const warnings: string[] = [];
  const g = Math.min(5, Math.max(1, grade));
  const ref = Math.max(2.5, refAvg);
  let base = (g / ref) * 1000;
  if (base > 1000) base = 1000;

  let factor = 1;
  if (avgEctsPrevious != null && Number.isFinite(avgEctsPrevious)) {
    const a = avgEctsPrevious;
    if (a >= 49.01 && a <= 54) factor *= 0.9;
    else if (a >= 44.01 && a <= 49) factor *= 0.8;
    else if (a >= 40 && a <= 44) factor *= 0.7;
  }
  if (ectsCurrent != null && Number.isFinite(ectsCurrent)) {
    if (ectsCurrent >= 18 && ectsCurrent <= 30) factor *= 0.9;
  }

  const points = w(rules.grade_weight, base * factor);
  if (factor < 1) {
    warnings.push("Zbog unesenih ECTS-a primijenjeno je umanjenje bodova za prosjek.");
  }
  return { points, warnings };
}

function incomePointsForBand(bandId: IncomeBandId): number {
  const b = INCOME_BANDS.find((x) => x.id === bandId);
  return b?.points ?? 0;
}

function studyYearPoints(year: StudyYearOption, meets: boolean): number {
  if (!meets) return 0;
  return STUDY_YEAR_POINTS[year] ?? 0;
}

function specialPointsSum(ids: SpecialOptionId[]): { sum: number; lines: BreakdownLine[]; izravno: boolean } {
  const lines: BreakdownLine[] = [];
  let sum = 0;
  let izravno = false;
  const seen = new Set<SpecialOptionId>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const opt = SPECIAL_OPTIONS.find((o) => o.id === id);
    if (!opt) continue;
    if (opt.izravnoPravo) {
      izravno = true;
    }
    sum += opt.points;
    lines.push({
      key: id,
      label: opt.label,
      points: opt.points,
    });
  }
  return { sum, lines, izravno };
}

export function calculateDormScore(dorm: Dorm, input: DormCalculatorInput): DormScoreResult {
  const warnings: string[] = [];
  let competitiveInvalid = false;

  if (input.distance === "ineligible_same_city") {
    competitiveInvalid = true;
    warnings.push(
      "Ako stanuješ u mjestu gdje studiraš, obično nemaš pravo na ovaj natječaj — broj bodova ispod je informativan.",
    );
  }

  if (input.invaliditet1) {
    warnings.push(
      "Invaliditet 1. grupe često znači posebno pravo na smještaj — obrati se studentskom centru; ovaj zbroj bodova nije glavna informacija.",
    );
  }

  const { points: gradePts, warnings: gw } = computeGradeBlock(
    input.gradeAverage,
    dorm.scoring_rules.reference_cohort_grade,
    input.avgEctsPreviousYears,
    input.ectsCurrentYear,
    dorm.scoring_rules,
  );
  warnings.push(...gw);

  const incRaw = incomePointsForBand(input.incomeBandId);
  const incPts = w(dorm.scoring_rules.income_weight, incRaw);

  const studyRaw = studyYearPoints(input.studyYear, input.meetsEcts55Average);
  const studyPts = studyRaw;

  const spec = specialPointsSum(input.specialIds);
  if (spec.izravno) {
    warnings.push(
      "Označeno je posebno pravo — postupak i dokazi idu drugačije nego za običan bodovni natječaj. Provjeri s centrom.",
    );
  }
  const specPts = w(dorm.scoring_rules.special_points, spec.sum);

  const breakdown: BreakdownLine[] = [
    {
      key: "grade",
      label: `Prosjek ocjena u odnosu na referentni prosjek ${dorm.scoring_rules.reference_cohort_grade.toFixed(2)} (procjena; stvarno se uspoređuješ s prosjekom s istog učilišta i razine)`,
      points: Math.round(gradePts * 10) / 10,
    },
    {
      key: "income",
      label: "Prihod po članu kućanstva (prethodna godina)",
      points: Math.round(incPts * 10) / 10,
    },
    {
      key: "distance_info",
      label: "Prebivalište — kilometri se ne boduju (0 bod.)",
      points: 0,
    },
    {
      key: "study",
      label: "Godina studija i ostvareni ECTS",
      points: studyPts,
    },
    ...spec.lines.map((l) => ({
      ...l,
      points: Math.round(w(dorm.scoring_rules.special_points, l.points) * 10) / 10,
    })),
  ];

  let total = gradePts + incPts + studyPts + specPts;
  total = safeRound1(total);
  if (!Number.isFinite(total) || total < 0) {
    total = 0;
    warnings.push("Izračun je doveo do nevaljanog rezultata — provjerite unesene brojeve.");
  }
  if (total > MAX_SCORE_ROUGH) {
    warnings.push("Neobično visok zbroj — provjerite jesu li označene međusobno isključive opcije.");
  }

  return {
    total,
    breakdown,
    warnings,
    competitiveInvalid,
  };
}

export type ChanceLevel = "high" | "medium" | "low";

export function chanceFromCutoff(total: number, cutoff: number | null): ChanceLevel {
  if (cutoff == null) return "medium";
  const d = total - cutoff;
  if (d >= 120) return "high";
  if (d >= -80) return "medium";
  return "low";
}

/**
 * Kad nema službenog praga u bazi: gruba procjena „koliko si jak“ prema ukupnom zbroju
 * (ne predviđa stvarni upis — ovisi o konkurenciji i godini).
 */
export function estimateChanceWithoutCutoff(total: number): ChanceLevel {
  if (!Number.isFinite(total) || total < 0) return "low";
  if (total >= 2600) return "high";
  if (total >= 1750) return "medium";
  return "low";
}

/** Procjena šanse za prikaz: prag ako postoji, inače heuristika po ukupnim bodovima. */
export function displayChance(
  total: number,
  cutoff: number | null,
  competitiveInvalid: boolean,
): ChanceLevel {
  if (competitiveInvalid) return "low";
  if (cutoff != null) return chanceFromCutoff(total, cutoff);
  return estimateChanceWithoutCutoff(total);
}

/** Službeno objavljeni prag (ako postoji u bazi), inače null. */
export function latestCutoff(dorm: Dorm): number | null {
  const p = dorm.published_cutoff?.points;
  if (p != null && Number.isFinite(p)) return p;
  const legacy = dorm.last_year_cutoff;
  if (!legacy || typeof legacy !== "object") return null;
  const nums = Object.values(legacy).filter((v): v is number => typeof v === "number");
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

export type DormRecommendation = {
  dorm: Dorm;
  total: number;
  cutoff: number | null;
  delta: number | null;
  chance: ChanceLevel;
};

export function rankDormsByFit(input: DormCalculatorInput): DormRecommendation[] {
  const list: DormRecommendation[] = dorms.map((dorm) => {
    const { total, competitiveInvalid } = calculateDormScore(dorm, input);
    const cutoff = latestCutoff(dorm);
    const delta = cutoff != null ? total - cutoff : null;
    const chance = displayChance(total, cutoff, competitiveInvalid);
    return { dorm, total, cutoff, delta, chance };
  });
  list.sort((a, b) => {
    if (a.delta != null && b.delta != null) return b.delta - a.delta;
    if (a.delta != null) return -1;
    if (b.delta != null) return 1;
    return b.total - a.total;
  });
  return list;
}

const STORAGE_KEY = "mojput-dorm-calc";

export type SavedDormResult = {
  at: string;
  dormId: string;
  total: number;
  input: DormCalculatorInput;
};

export function saveResult(entry: SavedDormResult): void {
  try {
    const prev = loadHistory();
    prev.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

export function loadHistory(): SavedDormResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedDormResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function statsFromHistory(history: SavedDormResult[]): { count: number; lastTotal: number | null } {
  if (history.length === 0) return { count: 0, lastTotal: null };
  return { count: history.length, lastTotal: history[0].total };
}
