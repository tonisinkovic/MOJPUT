/**
 * Stvarni studijski programi jednog učilišta: popis i pragovi iz universities_data.json,
 * a programId iz scoringFormulas.json (za link na kalkulator s odabranim programom).
 */

import { facultyInstitutions, getCutoffForYear } from "@/data/faculties";
import { scoringFormulas, type ProgramScoring } from "@/data/scoringFormulas";
import { extractScoringInstitutionName, normalizeKeyPart } from "@/lib/upisPragFromDataset";

export type FacultyProgramRow = {
  name: string;
  /** Oznake iz naziva: izvanredni, stručni, Hrvati izvan RH… (zaseban natječaj, bez formule). */
  tags: string[];
  /** Mjesto izvođenja ako se razlikuje od sjedišta (dislocirani studiji). */
  city: string;
  cutoff2025: number | null;
  /** Postoji formula bodovanja → link na kalkulator. */
  programId: string | null;
  maxBodovi: number | null;
};

export type FacultyProgramSummary = {
  programs: FacultyProgramRow[];
  withCutoff: number;
  minCutoff: number | null;
  maxCutoff: number | null;
  cities: string[];
};

const formulasByInstitution = new Map<string, ProgramScoring[]>();
for (const f of scoringFormulas) {
  const key = normalizeKeyPart(extractScoringInstitutionName(f.fakultet));
  const list = formulasByInstitution.get(key);
  if (list) list.push(f);
  else formulasByInstitution.set(key, [f]);
}

const round1 = (n: number) => Math.round(n * 10) / 10;

const VARIANT_TAG =
  /^(izvanredni|stručni|hrvati izvan rh|završili prije 2010\.|on-?line|online studij|izvanredni, stručni)$/i;

/** „Ekonomija (izvanredni, stručni)” → tagovi ["izvanredni", "stručni"]. */
export function programVariantTags(name: string): string[] {
  const tags: string[] = [];
  for (const m of name.matchAll(/\(([^)]+)\)/g)) {
    if (VARIANT_TAG.test(m[1].trim())) tags.push(...m[1].split(",").map((t) => t.trim()));
  }
  return tags;
}

export function getFacultyPrograms(faculty: { name: string; city: string }): FacultyProgramSummary {
  const instKey = normalizeKeyPart(faculty.name);
  const cityKey = normalizeKeyPart(faculty.city);
  const rows = new Map<string, FacultyProgramRow>();
  const rowKey = (name: string, city: string) => `${normalizeKeyPart(city)}|${normalizeKeyPart(name)}`;

  const inst = facultyInstitutions.find(
    (i) => normalizeKeyPart(i.name) === instKey && normalizeKeyPart(i.city) === cityKey,
  );
  for (const p of inst?.programs ?? []) {
    const raw = getCutoffForYear(p.cutoffByYear, "2025");
    rows.set(rowKey(p.name, faculty.city), {
      name: p.name,
      tags: programVariantTags(p.name),
      city: faculty.city,
      cutoff2025: raw === null ? null : round1(raw),
      programId: null,
      maxBodovi: null,
    });
  }

  for (const f of formulasByInstitution.get(instKey) ?? []) {
    const key = rowKey(f.program, f.grad);
    const existing = rows.get(key);
    if (existing) {
      existing.programId ??= f.programId;
      existing.maxBodovi ??= f.maxBodovi;
      existing.cutoff2025 ??= f.pragovi["2025"] ?? null;
      continue;
    }
    rows.set(key, {
      name: f.program,
      tags: programVariantTags(f.program),
      city: f.grad,
      cutoff2025: f.pragovi["2025"] ?? null,
      programId: f.programId,
      maxBodovi: f.maxBodovi,
    });
  }

  const programs = [...rows.values()].sort(
    (a, b) =>
      Number(a.tags.length > 0) - Number(b.tags.length > 0) ||
      Number(a.city !== faculty.city) - Number(b.city !== faculty.city) ||
      a.city.localeCompare(b.city, "hr") ||
      a.name.localeCompare(b.name, "hr"),
  );
  const cutoffs = programs.map((p) => p.cutoff2025).filter((c): c is number => c !== null);
  return {
    programs,
    withCutoff: cutoffs.length,
    minCutoff: cutoffs.length ? Math.min(...cutoffs) : null,
    maxCutoff: cutoffs.length ? Math.max(...cutoffs) : null,
    cities: [...new Set(programs.map((p) => p.city))],
  };
}

/** Kratki sažetak iz podataka umjesto generičkog „X u gradu Y”. */
export function facultySummaryText(
  faculty: { name: string; city: string; university: string },
  summary: FacultyProgramSummary,
): string {
  const n = summary.programs.length;
  const parts = [
    faculty.university && faculty.university !== faculty.name
      ? `Sastavnica: ${faculty.university}, ${faculty.city}.`
      : `Sjedište: ${faculty.city}.`,
  ];
  if (n === 0) {
    parts.push("Za ovo učilište još nemamo popis programa iz sustava postani-student.hr.");
    return parts.join(" ");
  }
  const regular = summary.programs.filter((p) => p.tags.length === 0).length;
  const variants = n - regular;
  const programWord = (k: number) =>
    k % 10 === 1 && k % 100 !== 11
      ? "studijski program"
      : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100)
        ? "studijska programa"
        : "studijskih programa";
  parts.push(
    `U MojPut bazi: ${regular} ${programWord(regular)}${
      variants ? ` i ${variants} izvanrednih, stručnih ili posebnih natječaja` : ""
    }.`,
  );
  if (summary.minCutoff !== null && summary.maxCutoff !== null) {
    parts.push(
      summary.minCutoff === summary.maxCutoff
        ? `Prag za upis 2025.: ${summary.minCutoff} bodova.`
        : `Pragovi za upis 2025.: od ${summary.minCutoff} do ${summary.maxCutoff} bodova.`,
    );
  }
  const elsewhere = summary.cities.filter((c) => c !== faculty.city);
  if (elsewhere.length) parts.push(`Dio programa izvodi se i u: ${elsewhere.join(", ")}.`);
  return parts.join(" ");
}
