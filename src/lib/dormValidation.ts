/**
 * Validacija i normalizacija podataka o studentskim domovima (JSON).
 */

import type { Dorm, DormScoringRules, PublishedCutoff } from "./dormCalculator";

const DEFAULT_RULES: DormScoringRules = {
  grade_weight: 100,
  income_weight: 100,
  distance_weight: 0,
  special_points: 100,
  reference_cohort_grade: 3.85,
};

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 100;
const REF_GRADE_MIN = 2.5;
const REF_GRADE_MAX = 5;

export type DormValidationIssue = { level: "error" | "warning"; message: string; dormId?: string };

function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function normalizeRules(raw: Partial<DormScoringRules> | undefined): DormScoringRules {
  const g = isFiniteNum(raw?.grade_weight) ? raw!.grade_weight! : DEFAULT_RULES.grade_weight;
  const i = isFiniteNum(raw?.income_weight) ? raw!.income_weight! : DEFAULT_RULES.income_weight;
  const d = isFiniteNum(raw?.distance_weight) ? raw!.distance_weight! : DEFAULT_RULES.distance_weight;
  const s = isFiniteNum(raw?.special_points) ? raw!.special_points! : DEFAULT_RULES.special_points;
  const ref = isFiniteNum(raw?.reference_cohort_grade)
    ? raw!.reference_cohort_grade!
    : DEFAULT_RULES.reference_cohort_grade;

  return {
    grade_weight: clamp(g, WEIGHT_MIN, WEIGHT_MAX),
    income_weight: clamp(i, WEIGHT_MIN, WEIGHT_MAX),
    distance_weight: clamp(d, WEIGHT_MIN, WEIGHT_MAX),
    special_points: clamp(s, WEIGHT_MIN, WEIGHT_MAX),
    reference_cohort_grade: clamp(ref, REF_GRADE_MIN, REF_GRADE_MAX),
    notes_hr: typeof raw?.notes_hr === "string" ? raw.notes_hr : undefined,
  };
}

function normalizePublishedCutoff(raw: unknown): PublishedCutoff | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const academic_year = typeof o.academic_year === "string" ? o.academic_year : "n/a";
  const scope_hr = typeof o.scope_hr === "string" ? o.scope_hr : "";
  let points: number | null = null;
  if (o.points === null) points = null;
  else if (isFiniteNum(o.points)) points = o.points;
  return {
    academic_year,
    scope_hr,
    points,
    source_url: typeof o.source_url === "string" ? o.source_url : undefined,
    source_label_hr: typeof o.source_label_hr === "string" ? o.source_label_hr : undefined,
  };
}

export function validateDormRecord(raw: unknown, index: number): { dorm: Dorm | null; issues: DormValidationIssue[] } {
  const issues: DormValidationIssue[] = [];
  if (!raw || typeof raw !== "object") {
    issues.push({ level: "error", message: `Zapis doma #${index} nije objekt.` });
    return { dorm: null, issues };
  }
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.length > 0 ? o.id : `unknown_${index}`;
  const city = typeof o.city === "string" ? o.city : "Nepoznato";
  const name = typeof o.name === "string" ? o.name : city;
  const shortName = typeof o.shortName === "string" ? o.shortName : city;

  if (!o.scoring_rules || typeof o.scoring_rules !== "object") {
    issues.push({ level: "warning", message: `Dom "${id}": nedostaju scoring_rules — korišteni pretpostavljeni.`, dormId: id });
  }

  const scoring_rules = normalizeRules(o.scoring_rules as Partial<DormScoringRules>);
  const published_cutoff = normalizePublishedCutoff(o.published_cutoff);

  if (!published_cutoff) {
    issues.push({
      level: "warning",
      message: `Dom "${id}": nedostaje published_cutoff — u aplikaciji neće biti službenog praga dok se ne dopuni JSON.`,
      dormId: id,
    });
  }
  // points === null: očekivano za centre bez javnog praga u bazi — UI koristi procjenu šanse

  const last_year_cutoff =
    o.last_year_cutoff && typeof o.last_year_cutoff === "object"
      ? (o.last_year_cutoff as Record<string, number>)
      : {};

  const dorm: Dorm = {
    id,
    city,
    name,
    shortName,
    website: typeof o.website === "string" ? o.website : undefined,
    natječaj_info_url: typeof o.natječaj_info_url === "string" ? o.natječaj_info_url : undefined,
    scoring_rules,
    published_cutoff,
    last_year_cutoff,
    provider_notes_hr: typeof o.provider_notes_hr === "string" ? o.provider_notes_hr : undefined,
  };

  return { dorm, issues };
}

export function validateDormsArray(raw: unknown): { dorms: Dorm[]; issues: DormValidationIssue[] } {
  const issues: DormValidationIssue[] = [];
  if (!Array.isArray(raw) || raw.length === 0) {
    issues.push({ level: "error", message: "dorms.json mora biti ne-prazan niz." });
    return { dorms: [], issues };
  }
  const out: Dorm[] = [];
  raw.forEach((item, i) => {
    const { dorm, issues: one } = validateDormRecord(item, i);
    issues.push(...one);
    if (dorm) out.push(dorm);
  });
  if (out.length === 0) {
    issues.push({ level: "error", message: "Nijedan valjan dom nije učitan." });
  }
  return { dorms: out, issues };
}
