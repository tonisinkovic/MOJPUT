/**
 * Usporedba 2–3 studija s jednim unosom (prosjek + rezultati mature po predmetu).
 */

import {
  findScoringFormula,
  type MaturaRazina,
  type ProgramScoring,
} from "@/data/scoringFormulas";
import {
  calculateTotal,
  componentInputKey,
  usesWeightedPrijemni,
  type AdmissionCalculationResult,
} from "./admissionCalculator";
import { cutoffFromUniversitiesDataset } from "./upisPragFromDataset";

export const MAX_COMPARE = 3;
const STORAGE_KEY = "mojput-compare-programs";

export function loadCompareIds(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string").slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

export function saveCompareIds(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_COMPARE)));
  } catch {
    // localStorage nedostupan — usporedba radi i preko URL-a
  }
}

export function parseCompareParam(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter((id) => findScoringFormula(id) != null)
    .slice(0, MAX_COMPARE);
}

export type SubjectResult = { pct: number; level: MaturaRazina };

export type CompareProfile = {
  gradeAverage: number | null;
  /** Ključ = normalizirani naziv predmeta (`subjectKey`). */
  subjects: Record<string, SubjectResult>;
};

export const subjectKey = (name: string) =>
  name
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** „Kemija ili Biologija ili Fizika” → ["kemija", "biologija", "fizika"]. */
export function subjectCandidates(label: string): string[] {
  return label
    .split(/\s+ili\s+/i)
    .map(subjectKey)
    .filter(Boolean);
}

/** Svi predmeti mature koje odabrani programi boduju (za polja unosa). */
export function subjectsForPrograms(formulas: ProgramScoring[]): { key: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const f of formulas) {
    for (const c of f.komponente) {
      if (c.type !== "matura" && c.type !== "matura_izborni") continue;
      for (const part of c.label.split(/\s+ili\s+/i)) {
        const key = subjectKey(part);
        if (key && !seen.has(key)) seen.set(key, part.replace(/\*/g, "").trim());
      }
    }
  }
  const order = ["hrvatski jezik", "matematika", "strani jezik"];
  return [...seen]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => {
      const ia = order.indexOf(a.key);
      const ib = order.indexOf(b.key);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return a.label.localeCompare(b.label, "hr");
    });
}

export function programCutoff(f: ProgramScoring): number | null {
  return cutoffFromUniversitiesDataset(f) ?? f.pragovi["2025"] ?? null;
}

export type CompareRow = {
  formula: ProgramScoring;
  result: AdmissionCalculationResult;
  cutoff: number | null;
  /** Razlika prema pragu (pozitivno = iznad). */
  diff: number | null;
  /** Što je u ovom izračunu procijenjeno. */
  approximations: string[];
};

export function scoreWithProfile(formula: ProgramScoring, profile: CompareProfile): CompareRow {
  const inputs: Record<string, number> = {};
  const levels: Record<string, MaturaRazina> = {};
  const approximations: string[] = [];

  formula.komponente.forEach((c, i) => {
    const key = componentInputKey(i);
    if (c.type === "ocjena") {
      inputs[key] = profile.gradeAverage ?? 0;
      if (/predmet/i.test(c.label) && profile.gradeAverage != null) {
        approximations.push(`${c.label}: korišten ukupni prosjek`);
      }
    } else if (c.type === "matura" || c.type === "matura_izborni") {
      let best: SubjectResult | null = null;
      for (const cand of subjectCandidates(c.label)) {
        const r = profile.subjects[cand];
        if (r && (!best || r.pct > best.pct)) best = r;
      }
      inputs[key] = best?.pct ?? 0;
      if (best) levels[key] = best.level;
    } else {
      inputs[key] = 0;
      if (c.max > 0) approximations.push(`${c.label}: nije uneseno (0 bodova)`);
    }
  });

  const weighted = usesWeightedPrijemni(formula);
  if (weighted) approximations.push("Prijemni ispit nije unesen (0 bodova)");
  const result = calculateTotal(formula, inputs, { prijemniInput: 0, levels });
  const cutoff = programCutoff(formula);
  const diff = !result.blocked && cutoff != null ? Math.round(result.total - cutoff) : null;
  return { formula, result, cutoff, diff, approximations };
}
