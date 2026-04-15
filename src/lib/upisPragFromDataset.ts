/**
 * Bodovni prag za upis (2025.) iz istog izvora kao i karta fakulteta:
 * {@link facultyInstitutions} / universities_data.json (npr. MZO tablica).
 *
 * Kalkulator koristi ovo kao primarni prag za usporedbu; scoringFormulas.json
 * ostaje rezerva kad nema pouzdanog uparivanja.
 */

import {
  facultyInstitutions,
  getCutoffForYear,
  type FacultyInstitution,
} from "@/data/faculties";
import type { ProgramScoring } from "@/data/scoringFormulas";

function normalizeKeyPart(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Ime učilišta iz scoring zapisa (često „nositelj – izvođač”) uskladiti s universities_data.name */
export function extractScoringInstitutionName(fakultet: string): string {
  const parts = fakultet
    .split(" - ")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 4 && parts[0] === parts[2] && parts[1] === parts[3]) {
    return `${parts[0]} - ${parts[1]}`;
  }
  if (parts.length >= 2 && parts[0] === parts[parts.length - 1]) {
    return parts[0];
  }
  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }
  return fakultet.trim();
}

type CutoffRow = {
  city: string;
  institution: string;
  program: string;
  cutoff: number;
};

function buildRows(institutions: FacultyInstitution[]): CutoffRow[] {
  const rows: CutoffRow[] = [];
  for (const inst of institutions) {
    for (const p of inst.programs) {
      const raw = getCutoffForYear(p.cutoffByYear, "2025");
      if (raw === null) continue;
      rows.push({
        city: inst.city,
        institution: inst.name,
        program: p.name,
        cutoff: Math.round(raw * 10) / 10,
      });
    }
  }
  return rows;
}

function buildIndex(rows: CutoffRow[]) {
  const tripleMap = new Map<string, number>();
  const byCityProgram = new Map<string, CutoffRow[]>();

  for (const r of rows) {
    const t = `${normalizeKeyPart(r.city)}|${normalizeKeyPart(r.institution)}|${normalizeKeyPart(r.program)}`;
    tripleMap.set(t, r.cutoff);

    const cp = `${normalizeKeyPart(r.city)}|${normalizeKeyPart(r.program)}`;
    if (!byCityProgram.has(cp)) byCityProgram.set(cp, []);
    byCityProgram.get(cp)!.push(r);
  }

  return { tripleMap, byCityProgram };
}

const { tripleMap, byCityProgram } = buildIndex(buildRows(facultyInstitutions));

/**
 * Vraća prag2025. iz universities_data ako se program pouzdano upari s formulom.
 */
export function cutoffFromUniversitiesDataset(f: ProgramScoring): number | null {
  const city = normalizeKeyPart(f.grad);
  const inst = normalizeKeyPart(extractScoringInstitutionName(f.fakultet));
  const prog = normalizeKeyPart(f.program);

  const triple = `${city}|${inst}|${prog}`;
  const direct = tripleMap.get(triple);
  if (direct !== undefined) return direct;

  const cp = `${city}|${prog}`;
  const list = byCityProgram.get(cp);
  if (!list?.length) return null;
  if (list.length === 1) return list[0].cutoff;

  const narrowed = list.filter((r) => {
    const ni = normalizeKeyPart(r.institution);
    return ni === inst || ni.includes(inst) || inst.includes(ni);
  });
  if (narrowed.length === 1) return narrowed[0].cutoff;

  return null;
}
