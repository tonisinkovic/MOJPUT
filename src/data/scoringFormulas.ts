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

export type RequiredSubjectSpec = { name: string; level: MaturaRazina };

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
  /** Postotak ukupnog bodovnog fonda za maturu/ocjene (0–1); koristi se zajedno s weightPrijemni */
  weightMatura?: number;
  /** Postotak ukupnog bodovnog fonda za prijemni (0–1) */
  weightPrijemni?: number;
  /** Eksplicitni uvjeti razine po predmetu (opcionalno; inače se koristi razina na komponenti u JSON-u) */
  requiredSubjects?: RequiredSubjectSpec[];
  /** Način unosa prijemnog kad su zadane težine */
  prijemniInputMode?: "percent" | "points";
  /** Posebni uvjeti za upis (zdravstveni pregledi, prijemni ispiti, eliminacijski kriteriji) */
  preduvjeti?: string[];
  /** Natjecanja koja donose bodove ili izravan upis */
  natjecanja?: Natjecanje[];
  /** Napomene uz program */
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

export {
  calculateProgramPointsLegacy as calculateProgramPoints,
  calculateTotal,
  calculateMaturaPoints,
  calculatePrijemniPoints,
  usesWeightedPrijemni,
} from "@/lib/admissionCalculator";
