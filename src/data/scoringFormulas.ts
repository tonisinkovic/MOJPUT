/**
 * Bodovne formule za SVE studijske programe u Hrvatskoj (943 programa).
 *
 * Generirano iz universities_data.json pomoću scripts/generate_scoring.py
 * - 60 programa s točnim formulama (ručno verificirano sa stranica fakulteta)
 * - 883 programa s formulama iz šablona (bazirano na tipu programa)
 *
 * Formula za pretvorbu:
 *   Ocjene:  (prosjek / 5.0) × maxBodovi
 *   Matura:  (postotak / 100) × maxBodovi
 *   Dodatno: korisnik unosi direktno bodove
 */

import rawFormulas from "./scoringFormulas.json";

export type MaturaRazina = "A" | "B";

export type ScoringComponent = {
  id: string;
  label: string;
  max: number;
  type: "ocjena" | "matura" | "matura_izborni" | "dodatno";
  razina?: MaturaRazina;
  obavezno: boolean;
  opis?: string;
};

export type Natjecanje = {
  kategorija: string;
  disciplina: string;
  vrednovanje: string;
};

export type ProgramScoring = {
  programId: string;
  fakultet: string;
  program: string;
  grad: string;
  maxBodovi: number;
  komponente: ScoringComponent[];
  pragovi: Record<string, number | null>;
  napomena?: string;
  kategorija?: string;
  izvor?: string;
  preduvjeti?: string[];
  natjecanja?: Natjecanje[];
  napomene?: string[];
};

// Parse JSON into typed array
export const scoringFormulas: ProgramScoring[] = (rawFormulas as ProgramScoring[]);

/** Pronađi formulu po programId */
export function findScoringFormula(programId: string): ProgramScoring | undefined {
  return scoringFormulas.find((f) => f.programId === programId);
}

/** Pretraži programe po upitu */
export function searchScoringPrograms(query: string): ProgramScoring[] {
  const q = query.toLowerCase().trim();
  if (!q) return scoringFormulas;
  return scoringFormulas.filter(
    (f) =>
      f.fakultet.toLowerCase().includes(q) ||
      f.program.toLowerCase().includes(q) ||
      f.grad.toLowerCase().includes(q)
  );
}

/** Izračunaj bodove za program na temelju unosa korisnika */
export function calculateProgramPoints(
  formula: ProgramScoring,
  inputs: Record<string, number>
): { total: number; breakdown: { id: string; label: string; points: number; max: number }[] } {
  const breakdown: { id: string; label: string; points: number; max: number }[] = [];
  let total = 0;

  for (const comp of formula.komponente) {
    const raw = inputs[comp.id] ?? 0;
    let points: number;

    if (comp.type === "ocjena") {
      // ocjena 1-5 → (ocjena / 5) × max
      const clamped = Math.min(5, Math.max(1, raw));
      points = Math.round(((clamped / 5) * comp.max) * 10) / 10;
    } else if (comp.type === "matura" || comp.type === "matura_izborni") {
      // postotak 0-100 → (postotak / 100) × max
      const clamped = Math.min(100, Math.max(0, raw));
      points = Math.round(((clamped / 100) * comp.max) * 10) / 10;
    } else {
      // dodatno - direktno bodovi
      points = Math.min(comp.max, Math.max(0, raw));
    }

    breakdown.push({ id: comp.id, label: comp.label, points, max: comp.max });
    total += points;
  }

  total = Math.round(Math.min(formula.maxBodovi, total) * 10) / 10;
  return { total, breakdown };
}
