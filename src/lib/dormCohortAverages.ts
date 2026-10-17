/**
 * Službeni prosjeci ocjena skupina (čl. 11. Pravilnika) po studentskom centru i visokom učilištu.
 * Izvor: PDF-ovi „Prosjek ocjena po učilištima” uz natječaj 2026./2027.
 */

import raw from "@/data/dormCohortAverages.json";
import type { StudyYearOption } from "./dormCalculator";

/** Razina za prosjek skupine: prijediplomski/integrirani/stručni, upis 1. god. diplomskog, viša god. diplomskog. */
export type StudyLevel = "prijediplomski" | "diplomskiUpis" | "diplomski";

export type CohortInstitution = {
  code: string;
  name: string;
  prijediplomski: number | null;
  diplomskiUpis: number | null;
  diplomski: number | null;
};

export type CohortCenter = {
  academic_year: string;
  source_url: string;
  brucosi: number | null;
  ukupno?: Partial<Record<StudyLevel, number | null>>;
  institutions: CohortInstitution[];
};

export const STUDY_LEVEL_OPTIONS: { id: StudyLevel; label: string }[] = [
  { id: "prijediplomski", label: "Prijediplomski, stručni ili integrirani studij" },
  { id: "diplomskiUpis", label: "Upisujem 1. godinu diplomskog studija" },
  { id: "diplomski", label: "Diplomski studij — viša godina" },
];

const centers = (raw as { centers: Record<string, CohortCenter> }).centers;

export function getCohortCenter(dormId: string): CohortCenter | undefined {
  return centers[dormId];
}

export function listCohortInstitutions(dormId: string): CohortInstitution[] {
  return centers[dormId]?.institutions ?? [];
}

const valid = (n: number | null | undefined): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= 2 && n <= 5;

export type ResolvedReference = {
  value: number;
  /** Odakle je prosjek skupine — za objašnjenje u izračunu. */
  source: "brucosi" | "institution" | "center_level";
  label_hr: string;
  academic_year: string;
};

/**
 * Prosjek skupine prema čl. 11.: brucoši se uspoređuju sa svim brucošima natječaja,
 * ostali sa studentima istog učilišta na istoj razini. Vraća null kad nema službenog podatka.
 */
export function resolveCohortReference(
  dormId: string,
  opts: {
    studyYear: StudyYearOption;
    studyLevel?: StudyLevel | null;
    institution?: { dormId: string; code: string } | null;
  },
): ResolvedReference | null {
  const c = centers[dormId];
  if (!c) return null;
  const year = c.academic_year;

  if (opts.studyYear === "maturant") {
    return valid(c.brucosi)
      ? { value: c.brucosi, source: "brucosi", label_hr: `prosjek svih brucoša ${year}`, academic_year: year }
      : null;
  }

  const level: StudyLevel = opts.studyLevel ?? "prijediplomski";
  const code = opts.institution?.dormId === dormId ? opts.institution.code : null;
  const inst = code ? c.institutions.find((i) => i.code === code) : undefined;
  if (inst) {
    const sibling = level === "diplomski" ? inst.diplomskiUpis : level === "diplomskiUpis" ? inst.diplomski : null;
    const v = valid(inst[level]) ? inst[level] : valid(sibling) ? sibling : null;
    if (v != null) {
      return { value: v, source: "institution", label_hr: `${inst.name}, ${year}`, academic_year: year };
    }
  }

  const total = c.ukupno?.[level];
  if (valid(total)) {
    return {
      value: total,
      source: "center_level",
      label_hr: `prosjek svih studenata te razine u centru, ${year}`,
      academic_year: year,
    };
  }
  return null;
}
