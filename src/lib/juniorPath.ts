/**
 * Junior put: spaja kviz, pragove, kartu, bodove i kratku listu škola.
 * Sprema se lokalno — radi i bez prijave.
 */

import { highSchools } from "@/data/highSchools";
import { juniorEvents, nextUpcomingEvent, type CalendarEvent } from "@/data/calendarEvents";
import {
  kalkulatorSchools,
  type KalkulatorPrag,
  type KalkulatorProgram,
  type KalkulatorSchool,
} from "@/data/srednjaKalkulator";
import type { NearbySchool } from "@/lib/juniorGeo";
import type {
  HighSchoolProgram,
  HighSchoolProgramType,
  JuniorQuizAnalysis,
} from "@/lib/juniorQuizEngine";

export const MAX_SHORTLIST_SCHOOLS = 5;
export const MAX_SHORTLIST_PROGRAMS = 3;

export type SrednjaProgramType = "gimnazija4" | "trogodisnji" | "kraci";

export type SevenEightGrades = {
  prosjek: string;
  matematika: string;
  hrvatski: string;
  strani: string;
  predmet1: string;
  predmet2: string;
  predmet3: string;
};

export type JuniorGradeDraft = {
  program: SrednjaProgramType;
  prosjek5: string;
  prosjek6: string;
  razred7: SevenEightGrades;
  razred8: SevenEightGrades;
  dodatniBodovi: string;
};

export type JuniorCutoff = {
  schoolId: number;
  programId: number;
  programName: string;
  min: number | null;
  avg: number | null;
  year: string | null;
  kvota: number | null;
};

export type EnrichedNearbySchool = NearbySchool & {
  mapSchoolId: string | null;
  cutoff: JuniorCutoff | null;
};

export type Chance = {
  label: string;
  desc: string;
  tone: "emerald" | "lime" | "amber" | "rose";
};

export type JuniorShortlistItem = {
  key: string;
  schoolName: string;
  city: string;
  distanceKm: number | null;
  programId: number;
  programName: string;
  programType: HighSchoolProgramType;
  duration: number;
  afterSchool: string;
  entryBar: HighSchoolProgram["entryBar"];
  matchPercentage: number | null;
  mapSchoolId: string | null;
  kalkulatorSchoolId: number | null;
  kalkulatorProgramId: number | null;
  pragMin: number | null;
  pragAvg: number | null;
  pragYear: string | null;
  savedAt: string;
};

export type JuniorQuizSnapshot = {
  savedAt: string;
  city: string | null;
  confidence: JuniorQuizAnalysis["confidence"];
  pathway: JuniorQuizAnalysis["pathway"];
  topInterests: JuniorQuizAnalysis["topInterests"];
  topSubjects: JuniorQuizAnalysis["topSubjects"];
  recommendations: Array<{
    id: number;
    name: string;
    type: HighSchoolProgramType;
    duration: number;
    matchPercentage: number;
    afterSchool: string;
    entryBar: HighSchoolProgram["entryBar"];
  }>;
};

export type AddShortlistResult =
  | { ok: true; item: JuniorShortlistItem }
  | { ok: false; reason: "exists" | "schools" | "programs" };

const GRADES_KEY = "junior-grades-v1";
const QUICK_KEY = "junior-quick-points-v1";
const SHORTLIST_KEY = "junior-shortlist-v1";
const SNAPSHOT_KEY = "junior-quiz-snapshot-v1";
const SHORTLIST_EVENT = "junior-shortlist-changed";
const SNAPSHOT_EVENT = "junior-snapshot-changed";
const POINTS_EVENT = "junior-points-changed";

export const MAX_BY_PROGRAM: Record<SrednjaProgramType, number> = {
  gimnazija4: 80,
  trogodisnji: 50,
  kraci: 20,
};

export function emptySevenEight(): SevenEightGrades {
  return {
    prosjek: "",
    matematika: "",
    hrvatski: "",
    strani: "",
    predmet1: "",
    predmet2: "",
    predmet3: "",
  };
}

export function emptyGradeDraft(): JuniorGradeDraft {
  return {
    program: "gimnazija4",
    prosjek5: "",
    prosjek6: "",
    razred7: emptySevenEight(),
    razred8: emptySevenEight(),
    dodatniBodovi: "",
  };
}

export const normalizeJuniorText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const nameCityKey = (name: string, city: string): string =>
  `${normalizeJuniorText(name)}|${normalizeJuniorText(city)}`;

export function shortlistItemKey(schoolName: string, city: string, programId: number): string {
  return `${nameCityKey(schoolName, city)}|${programId}`;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown, eventName?: string): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (eventName) window.dispatchEvent(new CustomEvent(eventName));
  } catch {
    /* privatni način / kvota */
  }
}

function subscribe(eventName: string, callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === eventName || e.key?.startsWith("junior-")) callback();
  };
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function toNum(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function programTypeFromPrag(prag: KalkulatorPrag | null): SrednjaProgramType | null {
  const reference = prag?.max ?? prag?.min ?? null;
  if (reference == null) return null;
  if (reference > 50) return "gimnazija4";
  if (reference > 20) return "trogodisnji";
  return "kraci";
}

export function computeSrednjaPoints(draft: JuniorGradeDraft): {
  opciUspjeh: number;
  kljucniPredmeti: number;
  posebniPredmeti: number;
  dodatni: number;
  zajednicki: number;
  ukupno: number;
  max: number;
} {
  const { program, razred7, razred8 } = draft;
  const opciUspjeh = clamp(
    clamp(toNum(draft.prosjek5), 0, 5) +
      clamp(toNum(draft.prosjek6), 0, 5) +
      clamp(toNum(razred7.prosjek), 0, 5) +
      clamp(toNum(razred8.prosjek), 0, 5),
    0,
    20,
  );
  const kljucniPredmeti = clamp(
    clamp(toNum(razred7.matematika), 0, 5) +
      clamp(toNum(razred8.matematika), 0, 5) +
      clamp(toNum(razred7.hrvatski), 0, 5) +
      clamp(toNum(razred8.hrvatski), 0, 5) +
      clamp(toNum(razred7.strani), 0, 5) +
      clamp(toNum(razred8.strani), 0, 5),
    0,
    30,
  );
  const posebniPredmeti = clamp(
    clamp(toNum(razred7.predmet1), 0, 5) +
      clamp(toNum(razred8.predmet1), 0, 5) +
      clamp(toNum(razred7.predmet2), 0, 5) +
      clamp(toNum(razred8.predmet2), 0, 5) +
      clamp(toNum(razred7.predmet3), 0, 5) +
      clamp(toNum(razred8.predmet3), 0, 5),
    0,
    30,
  );
  let zajednicki = opciUspjeh;
  if (program === "gimnazija4" || program === "trogodisnji") zajednicki += kljucniPredmeti;
  if (program === "gimnazija4") zajednicki += posebniPredmeti;
  const dodatni = Math.max(0, toNum(draft.dodatniBodovi));
  const max = MAX_BY_PROGRAM[program];
  return {
    opciUspjeh,
    kljucniPredmeti,
    posebniPredmeti,
    dodatni,
    zajednicki,
    ukupno: zajednicki + dodatni,
    max,
  };
}

export function gradeDraftIsUsable(draft: JuniorGradeDraft): boolean {
  const filled = [draft.prosjek5, draft.prosjek6, draft.razred7.prosjek, draft.razred8.prosjek].filter(
    (s) => s.trim() !== "",
  ).length;
  return filled >= 2;
}

export function chanceFor(points: number, pragMin: number): Chance {
  const diff = points - pragMin;
  if (diff >= 5) {
    return {
      label: "Velike šanse",
      desc: `Imaš ${diff.toFixed(1)} boda više od lanjskog praga.`,
      tone: "emerald",
    };
  }
  if (diff >= 0) {
    return {
      label: "Dobre šanse",
      desc: `Iznad si praga za ${diff.toFixed(1)} boda. Prag se mijenja — imaj i rezervu.`,
      tone: "lime",
    };
  }
  if (diff >= -3) {
    return {
      label: "Granične šanse",
      desc: `Nedostaje ti ${Math.abs(diff).toFixed(1)} boda do lanjskog praga.`,
      tone: "amber",
    };
  }
  return {
    label: "Male šanse",
    desc: `Nedostaje ti ${Math.abs(diff).toFixed(1)} boda. Pogledaj sličan program s nižim pragom.`,
    tone: "rose",
  };
}

export const CHANCE_TONE: Record<Chance["tone"], { box: string; badge: string }> = {
  emerald: { box: "border-emerald-500/40 bg-emerald-500/5", badge: "bg-emerald-500 text-white" },
  lime: { box: "border-lime-500/40 bg-lime-500/5", badge: "bg-lime-600 text-white" },
  amber: { box: "border-amber-500/40 bg-amber-500/5", badge: "bg-amber-500 text-white" },
  rose: { box: "border-rose-500/40 bg-rose-500/5", badge: "bg-rose-500 text-white" },
};

// ---------------------------------------------------------------------------
// Prag: uparivanje škole i programa
// ---------------------------------------------------------------------------

type SchoolIndex = {
  byNameCity: Map<string, KalkulatorSchool>;
  byName: Map<string, KalkulatorSchool[]>;
};

let schoolIndexCache: SchoolIndex | null = null;
let mapIndexCache: Map<string, string> | null = null;

const buildSchoolIndex = (): SchoolIndex => {
  if (schoolIndexCache) return schoolIndexCache;
  const byNameCity = new Map<string, KalkulatorSchool>();
  const byName = new Map<string, KalkulatorSchool[]>();
  for (const school of kalkulatorSchools) {
    byNameCity.set(nameCityKey(school.name, school.city), school);
    const nk = normalizeJuniorText(school.name);
    const list = byName.get(nk) ?? [];
    list.push(school);
    byName.set(nk, list);
  }
  schoolIndexCache = { byNameCity, byName };
  return schoolIndexCache;
};

const buildMapIndex = (): Map<string, string> => {
  if (mapIndexCache) return mapIndexCache;
  mapIndexCache = new Map(highSchools.map((s) => [nameCityKey(s.name, s.city), s.id]));
  return mapIndexCache;
};

export function findMapSchoolId(name: string, city: string): string | null {
  const idx = buildMapIndex();
  const exact = idx.get(nameCityKey(name, city));
  if (exact) return exact;
  const wantName = normalizeJuniorText(name);
  const wantCity = normalizeJuniorText(city);
  const loose = highSchools.find((s) => {
    const sn = normalizeJuniorText(s.name);
    const sc = normalizeJuniorText(s.city);
    return sc === wantCity && (sn.includes(wantName) || wantName.includes(sn));
  });
  return loose?.id ?? null;
}

export function findKalkulatorSchool(name: string, city: string): KalkulatorSchool | null {
  const { byNameCity, byName } = buildSchoolIndex();
  const exact = byNameCity.get(nameCityKey(name, city));
  if (exact) return exact;

  const wantName = normalizeJuniorText(name);
  const wantCity = normalizeJuniorText(city);
  const sameName = byName.get(wantName);
  if (sameName?.length === 1) return sameName[0];
  if (sameName && wantCity) {
    const cityHit = sameName.find((s) => normalizeJuniorText(s.city) === wantCity);
    if (cityHit) return cityHit;
  }

  let best: { school: KalkulatorSchool; score: number } | null = null;
  for (const school of kalkulatorSchools) {
    const sn = normalizeJuniorText(school.name);
    const sc = normalizeJuniorText(school.city);
    if (wantCity && sc && sc !== wantCity) continue;
    if (!(sn.includes(wantName) || wantName.includes(sn))) continue;
    const score = Math.min(sn.length, wantName.length);
    if (!best || score > best.score) best = { school, score };
  }
  return best?.school ?? null;
}

export function findKalkulatorProgram(
  school: KalkulatorSchool,
  program: HighSchoolProgram,
): KalkulatorProgram | null {
  const keywords = program.matchKeywords.map(normalizeJuniorText).filter(Boolean);
  let best: { prog: KalkulatorProgram; score: number } | null = null;
  for (const prog of school.programs) {
    const pn = normalizeJuniorText(prog.name);
    let score = 0;
    for (const kw of keywords) {
      if (pn === kw) score += kw.length + 12;
      else if (pn.includes(kw)) score += kw.length + 4;
      else if (kw.includes(pn) && pn.length >= 8) score += pn.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { prog, score };
  }
  return best?.prog ?? null;
}

export function findCutoff(name: string, city: string, program: HighSchoolProgram): JuniorCutoff | null {
  const school = findKalkulatorSchool(name, city);
  if (!school) return null;
  const prog = findKalkulatorProgram(school, program);
  if (!prog) return null;
  return {
    schoolId: school.id,
    programId: prog.id,
    programName: prog.name,
    min: prog.prag?.min ?? null,
    avg: prog.prag?.avg ?? null,
    year: prog.prag?.year ?? null,
    kvota: prog.prag?.kvota ?? null,
  };
}

export function enrichNearbySchool(
  school: NearbySchool,
  program: HighSchoolProgram,
): EnrichedNearbySchool {
  return {
    ...school,
    mapSchoolId: findMapSchoolId(school.name, school.city),
    cutoff: findCutoff(school.name, school.city, program),
  };
}

export function mapSchoolHref(mapSchoolId?: string | null, name?: string, city?: string): string {
  if (mapSchoolId) return `/srednje-skole?skola=${encodeURIComponent(mapSchoolId)}`;
  const q = [name, city].filter(Boolean).join(" ");
  return q ? `/srednje-skole?q=${encodeURIComponent(q)}` : "/srednje-skole";
}

export function calculatorHref(schoolId?: number | null, programId?: number | null): string {
  if (schoolId && programId) return `/kalkulator?skola=${schoolId}&program=${programId}`;
  if (schoolId) return `/kalkulator?skola=${schoolId}`;
  return "/kalkulator";
}

// ---------------------------------------------------------------------------
// Bodovi
// ---------------------------------------------------------------------------

export function loadJuniorGrades(): JuniorGradeDraft | null {
  const raw = readJson<JuniorGradeDraft>(GRADES_KEY);
  if (!raw || typeof raw !== "object") return null;
  return raw;
}

export function saveJuniorGrades(draft: JuniorGradeDraft): void {
  writeJson(GRADES_KEY, draft, POINTS_EVENT);
}

export function loadQuickPoints(): number | null {
  const raw = readJson<number>(QUICK_KEY);
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
}

export function saveQuickPoints(points: number | null): void {
  if (points == null) {
    try {
      window.localStorage.removeItem(QUICK_KEY);
      window.dispatchEvent(new CustomEvent(POINTS_EVENT));
    } catch {
      /* ignore */
    }
    return;
  }
  writeJson(QUICK_KEY, points, POINTS_EVENT);
}

export function effectiveJuniorPoints(): number | null {
  const quick = loadQuickPoints();
  if (quick != null) return quick;
  const draft = loadJuniorGrades();
  if (!draft || !gradeDraftIsUsable(draft)) return null;
  return Math.round(computeSrednjaPoints(draft).ukupno * 10) / 10;
}

export function onJuniorPointsChange(callback: () => void): () => void {
  return subscribe(POINTS_EVENT, callback);
}

// ---------------------------------------------------------------------------
// Kratka lista
// ---------------------------------------------------------------------------

export function loadShortlist(): JuniorShortlistItem[] {
  const raw = readJson<JuniorShortlistItem[]>(SHORTLIST_KEY);
  if (!Array.isArray(raw)) return [];
  return raw.filter((item) => item && typeof item.key === "string");
}

export function isOnShortlist(key: string): boolean {
  return loadShortlist().some((item) => item.key === key);
}

export function addToShortlist(item: JuniorShortlistItem): AddShortlistResult {
  const list = loadShortlist();
  if (list.some((x) => x.key === item.key)) return { ok: false, reason: "exists" };
  if (list.length >= MAX_SHORTLIST_SCHOOLS) return { ok: false, reason: "schools" };
  const programs = new Set(list.map((x) => x.programId));
  if (!programs.has(item.programId) && programs.size >= MAX_SHORTLIST_PROGRAMS) {
    return { ok: false, reason: "programs" };
  }
  const next = [...list, item];
  writeJson(SHORTLIST_KEY, next, SHORTLIST_EVENT);
  return { ok: true, item };
}

export function removeFromShortlist(key: string): void {
  writeJson(
    SHORTLIST_KEY,
    loadShortlist().filter((item) => item.key !== key),
    SHORTLIST_EVENT,
  );
}

export function onShortlistChange(callback: () => void): () => void {
  return subscribe(SHORTLIST_EVENT, callback);
}

export function shortlistFromNearby(
  school: EnrichedNearbySchool,
  program: HighSchoolProgram,
  matchPercentage: number | null,
): JuniorShortlistItem {
  return {
    key: shortlistItemKey(school.name, school.city, program.id),
    schoolName: school.name,
    city: school.city,
    distanceKm: school.distanceKm,
    programId: program.id,
    programName: program.name,
    programType: program.type,
    duration: program.duration,
    afterSchool: program.afterSchool,
    entryBar: program.entryBar,
    matchPercentage,
    mapSchoolId: school.mapSchoolId,
    kalkulatorSchoolId: school.cutoff?.schoolId ?? null,
    kalkulatorProgramId: school.cutoff?.programId ?? null,
    pragMin: school.cutoff?.min ?? null,
    pragAvg: school.cutoff?.avg ?? null,
    pragYear: school.cutoff?.year ?? null,
    savedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Snapshot kviza
// ---------------------------------------------------------------------------

export function loadJuniorSnapshot(): JuniorQuizSnapshot | null {
  const raw = readJson<JuniorQuizSnapshot>(SNAPSHOT_KEY);
  if (!raw || !raw.recommendations) return null;
  return raw;
}

export function saveJuniorSnapshot(analysis: JuniorQuizAnalysis, city: string | null): JuniorQuizSnapshot {
  const snap: JuniorQuizSnapshot = {
    savedAt: new Date().toISOString(),
    city,
    confidence: analysis.confidence,
    pathway: analysis.pathway,
    topInterests: analysis.topInterests,
    topSubjects: analysis.topSubjects,
    recommendations: analysis.recommendations.slice(0, 6).map((rec) => ({
      id: rec.program.id,
      name: rec.program.name,
      type: rec.program.type,
      duration: rec.program.duration,
      matchPercentage: rec.matchPercentage,
      afterSchool: rec.program.afterSchool,
      entryBar: rec.program.entryBar,
    })),
  };
  writeJson(SNAPSHOT_KEY, snap, SNAPSHOT_EVENT);
  return snap;
}

export function onJuniorSnapshotChange(callback: () => void): () => void {
  return subscribe(SNAPSHOT_EVENT, callback);
}

export function nextJuniorDeadline(from: Date = new Date()): CalendarEvent | null {
  return nextUpcomingEvent(juniorEvents, from);
}
