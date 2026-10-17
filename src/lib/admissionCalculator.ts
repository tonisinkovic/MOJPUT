/**
 * Logika bodovanja za kalkulator upisa (matura + opcionalno prijemni).
 * Razina A ispunjava uvjet B; B ne ispunjava uvjet A (obavezni predmet → nema prava prijave,
 * izborni → 0 bodova). Natjecanja se boduju prema pravilima programa (postotak bodovnog fonda ili izravan upis).
 */

import type { MaturaRazina, Natjecanje, ProgramScoring, ScoringComponent } from "@/data/scoringFormulas";

export type NatjecanjeVrijednost = { kind: "percent"; percent: number } | { kind: "direct" } | null;

/** „10,00 %” → 10 %, „izravan upis” → izravan upis; ostalo null. */
export function parseNatjecanje(n: Natjecanje): NatjecanjeVrijednost {
  const v = String(n.vrednovanje ?? "").toLowerCase();
  if (v.includes("izravan")) return { kind: "direct" };
  const m = v.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (!m) return null;
  const percent = parseFloat(m[1].replace(",", "."));
  return Number.isFinite(percent) && percent > 0 ? { kind: "percent", percent } : null;
}

/** Bodovi za natjecanje: postotak od maksimalnog broja bodova programa. */
export function natjecanjePoints(formula: ProgramScoring, n: Natjecanje): number {
  const parsed = parseNatjecanje(n);
  if (!parsed || parsed.kind !== "percent") return 0;
  return round1((parsed.percent / 100) * formula.maxBodovi);
}

function levelSatisfies(required: MaturaRazina | undefined, chosen: MaturaRazina | undefined): boolean {
  if (required !== "A") return true;
  return chosen !== "B";
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Jedinstveni ključ po poziciji u formuli (rješava duplikatne comp.id u JSON-u, npr. više „ocjena_1”). */
export function componentInputKey(komponenteIndex: number): string {
  return `__k_${komponenteIndex}`;
}

function rawForComponent(
  formula: ProgramScoring,
  komponenteIndex: number,
  inputs: Record<string, number>,
): number {
  const comp = formula.komponente[komponenteIndex];
  const byIdx = inputs[componentInputKey(komponenteIndex)];
  if (byIdx !== undefined) return byIdx;
  return inputs[comp.id] ?? 0;
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
    if (!(raw > 0)) return 0;
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

  for (let i = 0; i < formula.komponente.length; i++) {
    const comp = formula.komponente[i];
    if (comp.type !== "matura" && comp.type !== "matura_izborni") continue;
    maxSum += comp.max;
    const raw = rawForComponent(formula, i, inputs);
    const points = pointsForComponent(comp, raw);
    breakdown.push({ id: componentInputKey(i), label: comp.label, points, max: comp.max });
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
  /** Bodovi od odabranog natjecanja (uključeni u total). */
  natjecanjePoints: number;
  /** Odabrano natjecanje donosi izravan upis. */
  izravanUpis: boolean;
};

function sumBucket(
  formula: ProgramScoring,
  inputs: Record<string, number>,
  predicate: (c: ScoringComponent) => boolean,
): { total: number; maxSum: number; lines: ComponentBreakdownLine[] } {
  const lines: ComponentBreakdownLine[] = [];
  let total = 0;
  let maxSum = 0;
  for (let i = 0; i < formula.komponente.length; i++) {
    const comp = formula.komponente[i];
    if (!predicate(comp)) continue;
    maxSum += comp.max;
    const raw = rawForComponent(formula, i, inputs);
    const points = pointsForComponent(comp, raw);
    lines.push({ id: componentInputKey(i), label: comp.label, points, max: comp.max });
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
    /** Razina koju je kandidat položio, po ključu `componentInputKey(i)`; nedostaje = ispunjava uvjet. */
    levels?: Record<string, MaturaRazina>;
    /** Indeks u `formula.natjecanja` (vrednuje se jedno, najbolje postignuće). */
    natjecanjeIndex?: number | null;
  },
): AdmissionCalculationResult {
  const warnings: string[] = [];
  const natj =
    options.natjecanjeIndex != null ? formula.natjecanja?.[options.natjecanjeIndex] : undefined;
  const natjPts = natj ? natjecanjePoints(formula, natj) : 0;
  const izravanUpis = natj ? parseNatjecanje(natj)?.kind === "direct" : false;
  const additional = (options.additionalPointsFromUi ?? 0) + natjPts;
  const base = { natjecanjePoints: natjPts, izravanUpis };

  const levelInputs = { ...inputs };
  for (let i = 0; i < formula.komponente.length; i++) {
    const comp = formula.komponente[i];
    if (comp.type !== "matura" && comp.type !== "matura_izborni") continue;
    const key = componentInputKey(i);
    if (levelSatisfies(comp.razina, options.levels?.[key])) continue;
    if (comp.type === "matura" && comp.obavezno) {
      return {
        total: 0,
        maturaBlockPoints: 0,
        maturaSubjectPoints: 0,
        prijemniPoints: 0,
        prijemniMax: 0,
        breakdown: [],
        warnings,
        blocked: true,
        blockReason: `Studij traži ${comp.label} na A razini. S B razinom ne ispunjavaš uvjet za prijavu na ovaj studij.`,
        ...base,
      };
    }
    levelInputs[key] = 0;
    delete levelInputs[comp.id];
    warnings.push(`${comp.label}: studij boduje samo A razinu, pa B razina donosi 0 bodova.`);
  }
  inputs = levelInputs;

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
        ...base,
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

    const total = round1(formulaSubtotal + additional);

    return {
      total,
      maturaBlockPoints: round1(maturaPortion),
      maturaSubjectPoints: maturaSubjects.total,
      prijemniPoints: pri.points,
      prijemniMax: pri.max,
      breakdown,
      warnings,
      blocked: false,
      ...base,
    };
  }

  const full = sumBucket(formula, inputs, () => true);
  const formulaSubtotal = round1(Math.min(formula.maxBodovi, full.total));
  const total = round1(formulaSubtotal + additional);

  return {
    total,
    maturaBlockPoints: full.total,
    maturaSubjectPoints: maturaSubjects.total,
    prijemniPoints: 0,
    prijemniMax: 0,
    breakdown: full.lines,
    warnings,
    blocked: false,
    ...base,
  };
}

export type ChanceLevel = "high" | "medium" | "low";

/** Usporedba s prošlogodišnjim pragom; prag se mijenja svake godine pa je ovo samo orijentir. */
export function chanceFromCutoff(total: number, cutoff: number | null): ChanceLevel {
  if (!cutoff) return "medium";
  const diff = total - cutoff;
  if (diff >= 50) return "high";
  if (diff >= 0) return "medium";
  return "low";
}

export function calculateProgramPointsLegacy(
  formula: ProgramScoring,
  inputs: Record<string, number>,
): { total: number; breakdown: ComponentBreakdownLine[] } {
  const full = sumBucket(formula, inputs, () => true);
  const total = round1(Math.min(formula.maxBodovi, full.total));
  return { total, breakdown: full.lines };
}
