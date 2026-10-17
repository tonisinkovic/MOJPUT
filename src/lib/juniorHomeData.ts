/**
 * Podaci za Junior početnu: sve što se prikazuje kao broj dolazi iz baze (karta, kalkulator, kalendar).
 * Primjeri (kviz, karta, razredna ploča) su na stranici jasno označeni kao "Primjer".
 */

import { kalkulatorSchools, type KalkulatorProgram, type KalkulatorSchool } from "@/data/srednjaKalkulator";
import { computeSrednjaPoints, normalizeJuniorText, type JuniorGradeDraft } from "@/lib/juniorPath";

/** Godina u kojoj se upisuje današnji osmaš: od rujna idućih 12 mjeseci. */
export function enrollmentYear(now: Date = new Date()): number {
  return now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear();
}

/** "2026./2027." — školska godina osmaša. */
export function schoolYearLabel(now: Date = new Date()): string {
  const end = enrollmentYear(now);
  return `${end - 1}./${end}.`;
}

export type YearStop = {
  id: "sad" | "otvorena" | "lipanj" | "srpanj";
  title: string;
  hint: string;
  icon: "star" | "school" | "calc" | "check";
};

export const YEAR_STOPS: YearStop[] = [
  { id: "sad", title: "Rujan – veljača", hint: "riješi kviz, upoznaj se", icon: "star" },
  { id: "otvorena", title: "Ožujak – svibanj", hint: "dani otvorenih vrata", icon: "school" },
  { id: "lipanj", title: "Lipanj", hint: "prijava programa", icon: "calc" },
  { id: "srpanj", title: "Srpanj", hint: "konačne ljestvice", icon: "check" },
];

/** Gdje je osmaš u godini (0–3), prema mjesecu. */
export function currentYearStop(now: Date = new Date()): number {
  const m = now.getMonth();
  if (m >= 8 || m <= 1) return 0;
  if (m <= 4) return 1;
  if (m === 5) return 2;
  return 3;
}

export type DemoGrades = {
  prosjek: number;
  matematika: number;
  hrvatski: number;
  strani: number;
  posebni: number;
  dodatni: number;
};

export const DEFAULT_DEMO_GRADES: DemoGrades = {
  prosjek: 4.5,
  matematika: 4,
  hrvatski: 4,
  strani: 5,
  posebni: 5,
  dodatni: 0,
};

/** Pojednostavljeno: ista ocjena u 7. i 8. razredu. Točan izračun je u kalkulatoru. */
export function demoDraft(g: DemoGrades): JuniorGradeDraft {
  const p = String(g.prosjek);
  const year = {
    prosjek: p,
    matematika: String(g.matematika),
    hrvatski: String(g.hrvatski),
    strani: String(g.strani),
    predmet1: String(g.posebni),
    predmet2: String(g.posebni),
    predmet3: String(g.posebni),
  };
  return {
    program: "gimnazija4",
    prosjek5: p,
    prosjek6: p,
    razred7: { ...year },
    razred8: { ...year },
    dodatniBodovi: String(g.dodatni),
  };
}

export function demoPoints(g: DemoGrades): { ukupno: number; max: number } {
  const r = computeSrednjaPoints(demoDraft(g));
  return { ukupno: Math.round(r.ukupno * 10) / 10, max: r.max };
}

export type DemoTarget = {
  schoolId: number;
  schoolName: string;
  city: string;
  programName: string;
  min: number;
  year: string;
};

function isComputing(program: KalkulatorProgram): boolean {
  return /^tehnicar za racun(al|ar)/.test(normalizeJuniorText(program.name));
}

function toTarget(school: KalkulatorSchool, program: KalkulatorProgram): DemoTarget | null {
  const min = program.prag?.min;
  if (min == null || !Number.isFinite(min)) return null;
  return {
    schoolId: school.id,
    schoolName: school.name,
    city: school.city,
    programName: program.name.split("/")[0].trim(),
    min,
    year: program.prag?.year ?? "",
  };
}

/**
 * Plan A i Plan B iz stvarnih lanjskih pragova: isti smjer (tehničar za računarstvo) u Zagrebu,
 * Plan B je škola s nižim pragom. Ako podatak nestane iz baze, vraća se `null` pa se dio ne prikazuje.
 */
export function findDemoTargets(): { a: DemoTarget | null; b: DemoTarget | null } {
  const candidates: DemoTarget[] = [];
  for (const school of kalkulatorSchools) {
    if (normalizeJuniorText(school.city) !== "zagreb") continue;
    for (const program of school.programs) {
      if (!isComputing(program)) continue;
      const t = toTarget(school, program);
      if (t) candidates.push(t);
    }
  }
  if (candidates.length === 0) return { a: null, b: null };

  const byMinDesc = [...candidates].sort((x, y) => y.min - x.min);
  const a =
    candidates.find((c) => c.schoolId === 28) ??
    byMinDesc.find((c) => c.min >= 65 && c.min <= 76) ??
    byMinDesc[0];
  const b =
    candidates.find((c) => c.schoolId === 1363 && c.min < a.min - 3) ??
    byMinDesc.find((c) => c.min < a.min - 5) ??
    null;
  return { a, b };
}

export function formatPoints(value: number): string {
  return value.toLocaleString("hr-HR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
