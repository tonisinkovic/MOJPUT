/**
 * Logika bodovanja za kalkulator upisa (matura + opcionalno prijemni).
 * Razine A/B na predmetima su informativne (iz podataka programa); boduje se uneseni postotak prema max bodova komponente.
 */

import type { ProgramScoring, ScoringComponent } from "@/data/scoringFormulas";

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Studij traži prijemni ponder ako su obje težine zadane i pozitivne. */
export function usesWeightedPrijemni(formula: ProgramScoring): boolean {
  const wM = formula.weightMatura;
  const wP = formula.weightPrijemni;
  return (
    wM != null &&
    wP != null &&
    Number.isFinite(wM) &&
    Number.isFinite(wP) &&
    wM > 0 &&
    wP > 0
  );
}

function pointsForComponent(comp: ScoringComponent, raw: number): number {
  if (comp.type === "ocjena") {
    const clamped = Math.min(5, Math.max(1, raw));
    return round1((clamped / 5) * comp.max);
  }
  if (comp.type === "matura" || comp.type === "matura_izborni") {
    const clamped = Math.min(100, Math.max(0, raw));
    return round1((clamped / 100) * comp.max);
  }
  return round1(Math.min(comp.max, Math.max(0, raw)));
}

export type ComponentBreakdownLine = {
  id: string;
  label: string;
  points: number;
  max: number;
};

/**
 * Bodovi iz „matura dijela” formule: samo matura i izborni predmeti (postoci).
 */
export function calculateMaturaPoints(
  formula: ProgramScoring,
  inputs: Record<string, number>,
): { total: number; maxSum: number; breakdown: ComponentBreakdownLine[] } {
  const breakdown: ComponentBreakdownLine[] = [];
  let total = 0;
  let maxSum = 0;

  for (const comp of formula.komponente) {
    if (comp.type !== "matura" && comp.type !== "matura_izborni") continue;
    maxSum += comp.max;
    const raw = inputs[comp.id] ?? 0;
    const points = pointsForComponent(comp, raw);
    breakdown.push({ id: comp.id, label: comp.label, points, max: comp.max });
    total += points;
  }

  total = round1(Math.min(maxSum, total));
  return { total, maxSum, breakdown };
}

/**
 * Bodovi iz prijemnog: postotak 0–100 ili apsolutni bodovi unutar pondera.
 */
export function calculatePrijemniPoints(
  raw: number,
  formula: ProgramScoring,
  mode: "percent" | "points" | undefined,
): { points: number; max: number } {
  const maxBod = formula.maxBodovi;
  const wP = formula.weightPrijemni ?? 0;
  const max = maxBod * wP;
  if (mode === "points") {
    const p = Math.min(max, Math.max(0, raw));
    return { points: round1(p), max: round1(max) };
  }
  const clamped = Math.min(100, Math.max(0, raw));
  return { points: round1((clamped / 100) * max), max: round1(max) };
}

export type AdmissionCalculationResult = {
  total: number;
  maturaBlockPoints: number;
  maturaSubjectPoints: number;
  prijemniPoints: number;
  prijemniMax: number;
  breakdown: ComponentBreakdownLine[];
  warnings: string[];
  blocked: boolean;
  blockReason?: string;
};

function sumBucket(
  formula: ProgramScoring,
  inputs: Record<string, number>,
  predicate: (c: ScoringComponent) => boolean,
): { total: number; maxSum: number; lines: ComponentBreakdownLine[] } {
  const lines: ComponentBreakdownLine[] = [];
  let total = 0;
  let maxSum = 0;
  for (const comp of formula.komponente) {
    if (!predicate(comp)) continue;
    maxSum += comp.max;
    const raw = inputs[comp.id] ?? 0;
    const points = pointsForComponent(comp, raw);
    lines.push({ id: comp.id, label: comp.label, points, max: comp.max });
    total += points;
  }
  return { total: round1(total), maxSum, lines };
}

/**
 * Cjeloviti izračun: ponderirani prijemni ili klasičan zbroj komponenti + dodatni bodovi iz UI-ja.
 */
export function calculateTotal(
  formula: ProgramScoring,
  inputs: Record<string, number>,
  options: {
    /** null = korisnik još nije unio (blokada ako je potreban prijemni) */
    prijemniInput: number | null;
    additionalPointsFromUi?: number;
  },
): AdmissionCalculationResult {
  const warnings: string[] = [];
  const additional = options.additionalPointsFromUi ?? 0;

  const maturaSubjects = calculateMaturaPoints(formula, inputs);

  if (usesWeightedPrijemni(formula)) {
    if (options.prijemniInput === null) {
      return {
        total: 0,
        maturaBlockPoints: 0,
        maturaSubjectPoints: maturaSubjects.total,
        prijemniPoints: 0,
        prijemniMax: round1(formula.maxBodovi * (formula.weightPrijemni ?? 0)),
        breakdown: [],
        warnings,
        blocked: true,
        blockReason: "Unesi rezultat prijemnog ispita da bi se mogao izračunati ukupni rezultat.",
      };
    }

    const bucket = sumBucket(
      formula,
      inputs,
      (c) =>
        c.type === "ocjena" ||
        c.type === "matura" ||
        c.type === "matura_izborni" ||
        c.type === "dodatno",
    );

    const maxBod = formula.maxBodovi;
    const wM = formula.weightMatura!;
    const wP = formula.weightPrijemni!;
    const maturaPortion =
      bucket.maxSum > 0 ? (bucket.total / bucket.maxSum) * (maxBod * wM) : 0;
    const mode = formula.prijemniInputMode;
    const pri = calculatePrijemniPoints(options.prijemniInput, formula, mode);
    const formulaSubtotal = round1(Math.min(maxBod, maturaPortion + pri.points));

    const breakdown: ComponentBreakdownLine[] = [
      ...bucket.lines,
      {
        id: "__prijemni__",
        label: "Prijemni ispit (ponder)",
        points: pri.points,
        max: pri.max,
      },
    ];

    const total = round1(Math.min(maxBod, formulaSubtotal + additional));

    return {
      total,
      maturaBlockPoints: round1(maturaPortion),
      maturaSubjectPoints: maturaSubjects.total,
      prijemniPoints: pri.points,
      prijemniMax: pri.max,
      breakdown,
      warnings,
      blocked: false,
    };
  }

  const full = sumBucket(formula, inputs, () => true);
  const formulaSubtotal = round1(Math.min(formula.maxBodovi, full.total));
  const total = round1(Math.min(formula.maxBodovi, formulaSubtotal + additional));

  return {
    total,
    maturaBlockPoints: full.total,
    maturaSubjectPoints: maturaSubjects.total,
    prijemniPoints: 0,
    prijemniMax: 0,
    breakdown: full.lines,
    warnings,
    blocked: false,
  };
}

export function calculateProgramPointsLegacy(
  formula: ProgramScoring,
  inputs: Record<string, number>,
): { total: number; breakdown: ComponentBreakdownLine[] } {
  const full = sumBucket(formula, inputs, () => true);
  const total = round1(Math.min(formula.maxBodovi, full.total));
  return { total, breakdown: full.lines };
}
