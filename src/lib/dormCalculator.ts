/**
 * Kalkulator bodova za subvencionirano stanovanje prema Pravilniku MZOM-a (NN 68/2023, 77/2024).
 * Udaljenost u km se ne boduje; bitno je imaš li pravo prijave (prebivalište ≠ mjesto studija).
 */

import rawDorms from "@/data/dorms.json";
import { validateDormsArray } from "./dormValidation";
import { resolveCohortReference, type StudyLevel } from "./dormCohortAverages";

/** Proračunska osnovica (natječaji 2025./2026. i 2026./2027.) */
export const PRORACUNSKA_OSNOVICA_EUR = 441.44;
/** 60 % proračunske osnovice */
export const PCT_60_PO_EUR = 264.86;
/** @deprecated koristi PRORACUNSKA_OSNOVICA_EUR */
export const PRORACUNSKA_OSNOVICA_EUR_2025 = PRORACUNSKA_OSNOVICA_EUR;
/** @deprecated koristi PCT_60_PO_EUR */
export const PCT_60_PO_EUR_2025 = PCT_60_PO_EUR;

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

const fmtEur = (n: number) => n.toFixed(2).replace(".", ",");

/** Mjesečni prihod po članu kućanstva (EUR), prethodna kalendarska godina — čl. 15. st. 11. */
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
    label: `400,01 – ${fmtEur(PRORACUNSKA_OSNOVICA_EUR)} EUR (do 100 % proračunske osnovice)`,
    maxEur: PRORACUNSKA_OSNOVICA_EUR,
    points: 75,
  },
  {
    id: "iznad_po",
    label: `više od ${fmtEur(PRORACUNSKA_OSNOVICA_EUR)} EUR (iznad proračunske osnovice)`,
    maxEur: null,
    points: 0,
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

/** Čl. 12. st. 1.–5.: bodovi prema godini studija uz prosječno barem 55 ECTS u prethodnim godinama. */
const STUDY_YEAR_POINTS: Partial<Record<StudyYearOption, number>> = {
  g2: 100,
  g3: 150,
  g4: 200,
  g5: 250,
  g6: 300,
};

const isHigherYear = (y: StudyYearOption) => y !== "maturant" && y !== "g1";

export type SpecialOptionId =
  | "invaliditet2"
  | "branitelj_child_1"
  | "branitelj_child_2"
  | "minimalna_naknada"
  | "medjunarodna_zastita"
  | "jedan_roditelj"
  | "razvedeni_roditelji"
  | "oba_roditelja_izravno"
  | "skrbnistvo_izravno"
  | "deficitarni_studij"
  /** @deprecated zamijenjeno brojem u `parentsDisabled100` */
  | "civil_invalid_parent"
  /** @deprecated zamijenjeno brojem u `children` */
  | "roditelj_dijete";

export const SPECIAL_OPTIONS: {
  id: SpecialOptionId;
  label: string;
  points: number;
  izravnoPravo?: boolean;
}[] = [
  { id: "invaliditet2", label: "Invaliditet 2. grupe", points: 400 },
  { id: "branitelj_child_1", label: "Dijete branitelja / HVO — jedan roditelj (200 bod.)", points: 200 },
  { id: "branitelj_child_2", label: "Dijete branitelja / HVO — oba roditelja (400 bod.)", points: 400 },
  {
    id: "minimalna_naknada",
    label: "Zajamčena minimalna naknada ili slične novčane potpore (zamjenjuje bodove za prihod)",
    points: 750,
  },
  { id: "medjunarodna_zastita", label: "Međunarodna ili privremena zaštita", points: 750 },
  { id: "jedan_roditelj", label: "Jedan roditelj umro, nestao ili nepoznat (600 bod.)", points: 600 },
  {
    id: "razvedeni_roditelji",
    label: "Razvedeni roditelji — živim samo s jednim roditeljem (150 bod.)",
    points: 150,
  },
  {
    id: "oba_roditelja_izravno",
    label: "Oba roditelja umrla, nestala ili nepoznata",
    points: 0,
    izravnoPravo: true,
  },
  {
    id: "skrbnistvo_izravno",
    label: "Pod skrbništvom sam ili sam bio kao dijete / socijalna usluga smještaja",
    points: 0,
    izravnoPravo: true,
  },
  { id: "deficitarni_studij", label: "Deficitarni studij — među prvih 10 na listi HZZ-a", points: 200 },
];

export type MaturaResult = "none" | "80_90" | "gt90";
export type CompetitionAward = "none" | "drzavna" | "medjunarodna";
export type StudentAward = "none" | "rektor" | "dekan" | "procelnik";

export const MATURA_OPTIONS: { id: MaturaResult; label: string; points: number }[] = [
  { id: "none", label: "Ništa od navedenog", points: 0 },
  { id: "80_90", label: "Obvezni dio mature na višoj razini, 80–90 %", points: 200 },
  { id: "gt90", label: "Obvezni dio mature na višoj razini, više od 90 %", points: 300 },
];

export const COMPETITION_OPTIONS: { id: CompetitionAward; label: string; points: number }[] = [
  { id: "none", label: "Bez nagrade", points: 0 },
  { id: "drzavna", label: "Državna nagrada (1.–3. mjesto) u srednjoj školi", points: 300 },
  { id: "medjunarodna", label: "Međunarodna nagrada (1.–3. mjesto) u srednjoj školi", points: 400 },
];

export const STUDENT_AWARD_OPTIONS: { id: StudentAward; label: string; points: number }[] = [
  { id: "none", label: "Bez nagrade", points: 0 },
  { id: "rektor", label: "Rektorova nagrada", points: 300 },
  { id: "dekan", label: "Dekanova nagrada", points: 200 },
  { id: "procelnik", label: "Pročelnikova nagrada", points: 200 },
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
  /** Ručno upisan prosjek skupine; ima prednost pred službenim podacima iz baze. */
  referenceAverage?: number | null;
  /** Visoko učilište iz `dormCohortAverages.json`; šifre vrijede samo unutar svog centra. */
  institution?: { dormId: string; code: string } | null;
  studyLevel?: StudyLevel | null;
  /** Braća/sestre u sustavu obrazovanja ili predškolske dobi (150 bod. svaki). */
  siblings?: number;
  /** Braća/sestre s doplatkom za pomoć i njegu ili osobnom invalidninom (200 bod. svaki). */
  siblingsWithCare?: number;
  /** Roditelji sa 100 % tjelesnim oštećenjem (200 bod. po roditelju). */
  parentsDisabled100?: number;
  /** Student roditelj — broj djece (500 bod. po djetetu). */
  children?: number;
  maturaResult?: MaturaResult;
  competitionAward?: CompetitionAward;
  studentAward?: StudentAward;
  /** Čl. 12. st. 9.: 58+ ECTS u tekućoj godini uz prosječno 55 u prethodnim (100 bod.). */
  ects58CurrentYear?: boolean;
  /** Čl. 18. st. 1.: opomena pred gubitak prava (−200 bod.). */
  opomena?: boolean;
};

export type BreakdownLine = { key: string; label: string; points: number; article?: string };

export type DormScoreResult = {
  total: number;
  breakdown: BreakdownLine[];
  warnings: string[];
  /** Nema smisla uspoređivati s natječajem (npr. prebivalište u mjestu studija, premalo ECTS-a). */
  competitiveInvalid: boolean;
  /** Razlozi za izravno pravo (čl. 7.–9.) — tada se ne natječeš bodovima. */
  izravnoPravo: string[];
};

const w = (rule: number, value: number) => {
  const r = Number.isFinite(rule) ? rule : 100;
  const v = Number.isFinite(value) ? value : 0;
  return (r / 100) * v;
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const count = (n: number | undefined, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(0, Math.floor(n as number))) : 0;

export function safeRound1(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return round1(n);
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
    else if (row.key === "study" || row.key.startsWith("study_")) z.study += p;
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
    study_ects58: "58 i više ECTS u tekućoj godini",
    awards_matura: "Državna matura",
    awards_competition: "Nagrada na natjecanju",
    awards_student: "Nagrada na studiju",
    opomena: "Opomena pred gubitak prava",
  };
  return res.breakdown.map((b) => ({
    id: b.key,
    title_hr: titles[b.key] ?? "Posebni uvjeti",
    detail_hr: b.article ? `${b.label} (${b.article})` : b.label,
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

export type ReferenceSource = "manual" | "brucosi" | "institution" | "center_level" | "estimate";

/** Prosjek skupine: ručni unos → službeni prosjek (brucoši / učilište / razina) → procjena iz dorms.json. */
export function effectiveReference(
  dorm: Dorm,
  input: DormCalculatorInput,
): { value: number; source: ReferenceSource; label_hr: string } {
  const own = input.referenceAverage;
  if (own != null && Number.isFinite(own) && own >= 2 && own <= 5) {
    return { value: own, source: "manual", label_hr: `tvoj unos ${own.toFixed(3).replace(".", ",")}` };
  }
  const official = resolveCohortReference(dorm.id, input);
  if (official) {
    return {
      value: official.value,
      source: official.source,
      label_hr: `${official.value.toFixed(3).replace(".", ",")} — ${official.label_hr}`,
    };
  }
  const est = dorm.scoring_rules.reference_cohort_grade;
  return { value: est, source: "estimate", label_hr: `procjena ${est.toFixed(2).replace(".", ",")}` };
}

/** Čl. 11.: osobni prosjek / prosjek skupine × 1000, bez gornje granice; umanjenja prema ECTS-u. */
function computeGradeBlock(
  input: DormCalculatorInput,
  refAvg: number,
  rules: DormScoringRules,
): { points: number; warnings: string[] } {
  const warnings: string[] = [];
  const g = round3(Math.min(5, Math.max(2, input.gradeAverage)));
  const ref = round3(Math.max(2, refAvg));
  const base = (g / ref) * 1000;

  let factor = 1;
  const prev = input.avgEctsPreviousYears;
  if (isHigherYear(input.studyYear) && prev != null && Number.isFinite(prev)) {
    if (prev >= 49.01 && prev <= 54) factor *= 0.9;
    else if (prev >= 44.01 && prev <= 49) factor *= 0.8;
    else if (prev >= 40 && prev <= 44) factor *= 0.7;
  }
  const cur = input.ectsCurrentYear;
  if (input.studyYear !== "maturant" && cur != null && Number.isFinite(cur) && cur >= 18 && cur <= 30) {
    factor *= 0.9;
  }

  const points = w(rules.grade_weight, base * factor);
  if (factor < 1) {
    warnings.push(
      `Zbog unesenih ECTS-a bodovi za prosjek umanjeni su za ${Math.round((1 - factor) * 100)} % (čl. 11. st. 9. i 10.).`,
    );
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

function specialLines(input: DormCalculatorInput): { lines: BreakdownLine[]; izravno: string[] } {
  const lines: BreakdownLine[] = [];
  const izravno: string[] = [];
  const ids = new Set(input.specialIds);

  for (const opt of SPECIAL_OPTIONS) {
    if (!ids.has(opt.id)) continue;
    if (opt.izravnoPravo) {
      izravno.push(opt.label);
      continue;
    }
    if (opt.id === "razvedeni_roditelji" && ids.has("jedan_roditelj")) continue;
    if (opt.id === "branitelj_child_1" && ids.has("branitelj_child_2")) continue;
    lines.push({ key: opt.id, label: opt.label, points: opt.points });
  }

  const siblingsPts = count(input.siblings, 10) * 150;
  const carePts = count(input.siblingsWithCare, 10) * 200;
  if (siblingsPts > 0 || carePts > 0) {
    const care = carePts >= siblingsPts;
    lines.push({
      key: care ? "siblings_care" : "siblings",
      label: care
        ? `Braća/sestre s doplatkom za pomoć i njegu ili invalidninom (${count(input.siblingsWithCare, 10)} × 200)`
        : `Braća/sestre u sustavu obrazovanja (${count(input.siblings, 10)} × 150)`,
      points: care ? carePts : siblingsPts,
      article: "čl. 15. st. 3.–5., boduje se samo jedna osnova",
    });
  }

  const parents = count(input.parentsDisabled100, 2);
  if (parents > 0) {
    lines.push({
      key: "parents_disabled",
      label: `Roditelj sa 100 % tjelesnim oštećenjem (${parents} × 200)`,
      points: parents * 200,
      article: "čl. 15. st. 6.",
    });
  }

  let kids = count(input.children, 10);
  if (kids === 0 && ids.has("roditelj_dijete")) kids = 1;
  if (kids > 0) {
    lines.push({
      key: "children",
      label: `Student roditelj (${kids} × 500)`,
      points: kids * 500,
      article: "čl. 15. st. 10.",
    });
  }
  if (parents === 0 && ids.has("civil_invalid_parent")) {
    lines.push({ key: "parents_disabled", label: "Roditelj sa 100 % tjelesnim oštećenjem", points: 200 });
  }

  return { lines, izravno };
}

function awardLines(input: DormCalculatorInput): BreakdownLine[] {
  const lines: BreakdownLine[] = [];
  const firstYear = input.studyYear === "maturant";
  if (firstYear) {
    const m = MATURA_OPTIONS.find((o) => o.id === input.maturaResult);
    if (m && m.points > 0) lines.push({ key: "awards_matura", label: m.label, points: m.points, article: "čl. 13. st. 1." });
    const c = COMPETITION_OPTIONS.find((o) => o.id === input.competitionAward);
    if (c && c.points > 0) {
      lines.push({ key: "awards_competition", label: c.label, points: c.points, article: "čl. 13. st. 2.–3." });
    }
  } else {
    const s = STUDENT_AWARD_OPTIONS.find((o) => o.id === input.studentAward);
    if (s && s.points > 0) lines.push({ key: "awards_student", label: s.label, points: s.points, article: "čl. 13. st. 4.–6." });
  }
  return lines;
}

/** Čl. 7.: izravno pravo prema izvrsnosti (uz prihod do 100 % proračunske osnovice). */
function excellenceReason(input: DormCalculatorInput): string | null {
  if (input.incomeBandId === "iznad_po") return null;
  const avg = input.gradeAverage;
  const cur = input.ectsCurrentYear ?? 0;
  if (input.studyYear === "maturant") {
    return avg >= 5 ? "Opći uspjeh 5,0 u svim razredima srednje škole (čl. 7. st. 1.)" : null;
  }
  if (avg < 4.5 || cur < 55) return null;
  if (input.studyYear === "g1") return "Prosjek najmanje 4,5 i 55 ECTS na prvoj godini (čl. 7. st. 2.)";
  if (input.meetsEcts55Average) {
    return "Prosjek najmanje 4,5, 55 ECTS u tekućoj i prosječno 55 ECTS u prethodnim godinama (čl. 7. st. 3.)";
  }
  return null;
}

export function calculateDormScore(dorm: Dorm, input: DormCalculatorInput): DormScoreResult {
  const warnings: string[] = [];
  let competitiveInvalid = false;
  const ids = new Set(input.specialIds);
  const specialStatus = input.invaliditet1 || ids.has("oba_roditelja_izravno") || ids.has("skrbnistvo_izravno");

  if (input.distance === "ineligible_same_city") {
    competitiveInvalid = true;
    warnings.push(
      "Ako stanuješ u mjestu gdje studiraš, obično nemaš pravo na ovaj natječaj — broj bodova ispod je informativan.",
    );
  }

  const cur = input.ectsCurrentYear;
  if (input.studyYear !== "maturant" && cur != null && Number.isFinite(cur) && cur < 18 && !specialStatus) {
    competitiveInvalid = true;
    warnings.push("S manje od 18 ECTS u tekućoj godini nemaš pravo na subvencionirano stanovanje (čl. 6. st. 2.).");
  }
  const prev = input.avgEctsPreviousYears;
  if (isHigherYear(input.studyYear) && prev != null && Number.isFinite(prev) && prev < 40 && !specialStatus) {
    competitiveInvalid = true;
    warnings.push(
      "S prosječno manje od 40 ECTS u prethodnim godinama nemaš pravo na subvencionirano stanovanje (čl. 6. st. 3.).",
    );
  }

  const izravnoPravo: string[] = [];
  if (input.invaliditet1) izravnoPravo.push("Invaliditet 1. grupe (čl. 9. st. 4.)");

  const reference = effectiveReference(dorm, input);
  const { points: gradePts, warnings: gw } = computeGradeBlock(input, reference.value, dorm.scoring_rules);
  warnings.push(...gw);

  const zmn = ids.has("minimalna_naknada");
  const incRaw = zmn ? 0 : incomePointsForBand(input.incomeBandId);
  const incPts = w(dorm.scoring_rules.income_weight, incRaw);

  const studyPts = studyYearPoints(input.studyYear, input.meetsEcts55Average);
  const ects58 =
    Boolean(input.ects58CurrentYear) && isHigherYear(input.studyYear) && input.meetsEcts55Average ? 100 : 0;

  const spec = specialLines(input);
  izravnoPravo.push(...spec.izravno);
  const excellence = excellenceReason(input);
  if (excellence) izravnoPravo.push(excellence);

  if (izravnoPravo.length > 0) {
    warnings.push(
      "Ispunjavaš uvjete za izravno pravo na smještaj — ne natječeš se bodovima, ali moraš priložiti dokaze. Provjeri s centrom.",
    );
  }

  const awards = awardLines(input);
  const opomena = input.opomena ? -200 : 0;

  const sourceRef = reference.label_hr;
  if (reference.source === "estimate" || reference.source === "center_level") {
    warnings.push(
      "Bodovi za prosjek su približni jer nije odabrano tvoje visoko učilište. Odaberi ga ili upiši prosjek skupine iz PDF-a centra.",
    );
  }

  const breakdown: BreakdownLine[] = [
    {
      key: "grade",
      label: `Prosjek ${Math.min(5, Math.max(2, input.gradeAverage)).toFixed(2)} podijeljen s prosjekom skupine — ${sourceRef} — × 1000`,
      points: round1(gradePts),
      article: "čl. 11.",
    },
    {
      key: "income",
      label: zmn
        ? "Zajamčena minimalna naknada zamjenjuje bodove za prihod (0 bod.)"
        : "Prihod po članu kućanstva (prethodna godina)",
      points: round1(incPts),
      article: "čl. 15. st. 11.",
    },
    {
      key: "distance_info",
      label: "Prebivalište — kilometri se ne boduju (0 bod.)",
      points: 0,
    },
    {
      key: "study",
      label: "Godina studija uz prosječno 55 ECTS u prethodnim godinama",
      points: studyPts,
      article: "čl. 12. st. 1.–5.",
    },
  ];
  if (ects58 > 0) {
    breakdown.push({ key: "study_ects58", label: "58 i više ECTS u tekućoj godini", points: ects58, article: "čl. 12. st. 9." });
  }
  breakdown.push(
    ...spec.lines.map((l) => ({ ...l, points: round1(w(dorm.scoring_rules.special_points, l.points)) })),
    ...awards,
  );
  if (opomena) {
    breakdown.push({ key: "opomena", label: "Opomena pred gubitak prava", points: opomena, article: "čl. 18. st. 1." });
  }

  const rest = breakdown.filter((l) => l.key !== "grade").reduce((sum, l) => sum + l.points, 0);
  let total = gradePts + rest;
  if (!Number.isFinite(total)) {
    total = 0;
    warnings.push("Izračun je doveo do nevaljanog rezultata — provjerite unesene brojeve.");
  }
  total = Math.max(0, safeRound1(total));
  if (total > MAX_SCORE_ROUGH) {
    warnings.push("Neobično visok zbroj — provjerite jesu li označene međusobno isključive opcije.");
  }

  return {
    total,
    breakdown,
    warnings,
    competitiveInvalid,
    izravnoPravo,
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
 * Kad nema službenog praga u bazi: gruba procjena prema ukupnom zbroju.
 * Granice prate objavljene pragove 2026./2027. (Zagreb 1335, Split oko 1630) — ne predviđaju upis.
 */
export function estimateChanceWithoutCutoff(total: number): ChanceLevel {
  if (!Number.isFinite(total) || total < 0) return "low";
  if (total >= 1900) return "high";
  if (total >= 1400) return "medium";
  return "low";
}

/** Procjena šanse za prikaz: prag ako postoji, inače heuristika po ukupnim bodovima. */
export function displayChance(
  total: number,
  cutoff: number | null,
  competitiveInvalid: boolean,
  izravnoPravo = false,
): ChanceLevel {
  if (competitiveInvalid) return "low";
  if (izravnoPravo) return "high";
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
    const { total, competitiveInvalid, izravnoPravo } = calculateDormScore(dorm, input);
    const cutoff = latestCutoff(dorm);
    const delta = cutoff != null ? total - cutoff : null;
    const chance = displayChance(total, cutoff, competitiveInvalid, izravnoPravo.length > 0);
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
