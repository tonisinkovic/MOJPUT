/**
 * Junior put: spaja kviz, pragove, kartu, bodove i kratku listu škola.
 * Sprema se lokalno — radi i bez prijave. Prijavljeni račun sinkronizira isti JSON.
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
  JuniorProgramMatch,
  JuniorQuizAnalysis,
} from "@/lib/juniorQuizEngine";

export const JUNIOR_CLOUD_PUSH_EVENT = "junior-cloud-push";

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
const LOCAL_UPDATED_KEY = "junior-local-updated-at";
const SHORTLIST_EVENT = "junior-shortlist-changed";
const SNAPSHOT_EVENT = "junior-snapshot-changed";
const POINTS_EVENT = "junior-points-changed";

let applyingRemoteState = false;

function notifyCloudPush(): void {
  if (applyingRemoteState || typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(JUNIOR_CLOUD_PUSH_EVENT));
  } catch {
    /* ignore */
  }
}

export function loadJuniorLocalUpdatedAt(): string | null {
  const raw = readJson<string>(LOCAL_UPDATED_KEY);
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

function touchLocalUpdated(): void {
  writeJson(LOCAL_UPDATED_KEY, new Date().toISOString());
  notifyCloudPush();
}

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

export type ScoringProfileId =
  | "standard"
  | "glazba"
  | "glazba-pripremno"
  | "glazba-paralelno"
  | "likovna"
  | "ples"
  | "ples-pripremno"
  | "sport"
  | "provjera";

export type ScoringExtra = {
  id: string;
  label: string;
  hint: string;
  max: number;
  /** Eliminacijski prag. Ispod njega nema upisa. */
  floor?: number;
  /** Prazno polje blokira usporedbu s pragom. */
  required?: boolean;
};

export type ScoringProfile = {
  id: ScoringProfileId;
  /** null = zadrži tip koji je učenik sam odabrao */
  schoolProgram: SrednjaProgramType | null;
  includeSchool: boolean;
  extras: ScoringExtra[];
  scaleMax: number;
  note: string;
};

export type ExtraInputs = Record<string, string>;

export type ProgramPointsExtra = {
  id: string;
  label: string;
  points: number;
  max: number;
  entered: boolean;
  floor?: number;
};

export type ProgramPoints = {
  opciUspjeh: number;
  kljucniPredmeti: number;
  posebniPredmeti: number;
  dodatni: number;
  zajednicki: number;
  schoolMax: number;
  includeSchool: boolean;
  schoolProgram: SrednjaProgramType | null;
  extras: ProgramPointsExtra[];
  ukupno: number;
  scaleMax: number;
  examPending: boolean;
  examFailed: boolean;
  failedFloor: number | null;
  /** Standardni program, a objavljeni min/max nisu na školskoj skali. */
  scaleMismatch: boolean;
  profileId: ScoringProfileId;
};

const STANDARD_PROFILE: ScoringProfile = {
  id: "standard",
  schoolProgram: null,
  includeSchool: true,
  extras: [],
  scaleMax: 0,
  note: "",
};

function pragScale(prag: KalkulatorPrag | null | undefined): number {
  return Math.max(prag?.min ?? 0, prag?.max ?? 0);
}

export function scoringProfileFor(
  program:
    | { name: string; sector?: string | null; schoolName?: string | null; prag?: KalkulatorPrag | null }
    | null
    | undefined,
): ScoringProfile {
  if (!program) return STANDARD_PROFILE;
  const name = normalizeJuniorText(program.name);
  const schoolName = normalizeJuniorText(program.schoolName ?? "");
  const scale = pragScale(program.prag);

  if (/pripremno/.test(name) && /glazb/.test(name)) {
    return {
      id: "glazba-pripremno",
      schoolProgram: null,
      includeSchool: false,
      scaleMax: 180,
      note: "Pripremno glazbeno obrazovanje boduje se samo prijemnim. Ocjene osnovne škole ne ulaze u zbroj. Maksimum je 180, a ispod 100 prijemni nije položen.",
      extras: [
        {
          id: "prijemni",
          label: "Prijemni ispit (sluh, pamćenje, ritam)",
          hint: "Najviše 180 bodova. Ispod 100 nema upisa.",
          max: 180,
          floor: 100,
          required: true,
        },
      ],
    };
  }

  if (/pripremno/.test(name) && /ples|balet/.test(name)) {
    return {
      id: "ples-pripremno",
      schoolProgram: null,
      includeSchool: false,
      scaleMax: 120,
      note: "Pripremni plesni razred boduje se samo prijemnim. Maksimum je 120, a ispod 70 prijemni nije položen.",
      extras: [
        {
          id: "prijemni",
          label: "Prijemni ispit plesne darovitosti",
          hint: "Najviše 120 bodova. Ispod 70 nema upisa.",
          max: 120,
          floor: 70,
          required: true,
        },
      ],
    };
  }

  if (/glazbenik|restaurator glazbala/.test(name)) {
    const parallel = /program srednje skole/.test(name) && scale <= 180;
    if (parallel) {
      return {
        id: "glazba-paralelno",
        schoolProgram: null,
        includeSchool: false,
        scaleMax: 180,
        note: "Paralelni upis uz drugi program broji uspjeh u glazbenoj školi i prijemni, ne ocjene osnovne. Maksimum je 180.",
        extras: [
          {
            id: "strucniUspjeh",
            label: "Uspjeh u glazbenoj školi (5. i 6. razred)",
            hint: "Zbroj prosjeka petog i šestog razreda. Svaki je najviše 5, ukupno 10.",
            max: 10,
          },
          {
            id: "prijemni",
            label: "Prijemni ispit glazbene darovitosti",
            hint: "Najviše 170 bodova. Ispod 70 prijemni nije položen.",
            max: 170,
            floor: 70,
            required: true,
          },
        ],
      };
    }
    return {
      id: "glazba",
      schoolProgram: "gimnazija4",
      includeSchool: true,
      scaleMax: 260,
      note: "Lanjski prag već uključuje školske bodove, uspjeh u glazbenoj školi i prijemni. Školskih 80 nije cijela skala — maksimum je 260.",
      extras: [
        {
          id: "strucniUspjeh",
          label: "Uspjeh u glazbenoj školi (5. i 6. razred)",
          hint: "Zbroj prosjeka petog i šestog razreda glazbene škole ili pripremnog obrazovanja. Svaki je najviše 5, ukupno 10.",
          max: 10,
        },
        {
          id: "prijemni",
          label: "Prijemni ispit glazbene darovitosti",
          hint: "Najviše 170 bodova. Ispod 70 prijemni nije položen.",
          max: 170,
          floor: 70,
          required: true,
        },
      ],
    };
  }

  if (/plesac|balet|plesn/.test(name)) {
    return {
      id: "ples",
      schoolProgram: "gimnazija4",
      includeSchool: true,
      scaleMax: 200,
      note: "Lanjski prag uključuje školske bodove, uspjeh plesne škole i prijemni. Maksimum je 200, a prijemni ispod 70 nije položen.",
      extras: [
        {
          id: "plesniUspjeh",
          label: "Opći uspjeh 4. razreda plesne škole",
          hint: "Prosjek četvrtog razreda plesne ili baletne škole, najviše 5.",
          max: 5,
        },
        {
          id: "prijemni",
          label: "Prijemni ispit plesne darovitosti",
          hint: "Najviše 115 bodova. Ispod 70 prijemni nije položen.",
          max: 115,
          floor: 70,
          required: true,
        },
      ],
    };
  }

  if (/odjel za sporta|sportska gimnazija/.test(`${name} ${schoolName}`)) {
    return {
      id: "sport",
      schoolProgram: "gimnazija4",
      includeSchool: true,
      scaleMax: 160,
      note: "Odjel za sportaše zbraja školske bodove (do 80) i sportsku uspješnost (do 80). Lanjski prag je na toj skali do 160.",
      extras: [
        {
          id: "sport",
          label: "Sportska uspješnost",
          hint: "Bodovi s rang-liste nacionalnog saveza, najviše 80.",
          max: 80,
          required: true,
        },
      ],
    };
  }

  const artTalent =
    /likovn|slikar|kipar|dizajner odjece|grafickih proizvoda|graficki urednik|unutrasnje arhitekture/.test(name);
  const artSector = /umjetnost/.test(normalizeJuniorText(program.sector ?? ""));
  if ((artTalent && (scale > 100 || scale === 0)) || (artSector && scale > 100 && scale <= 210)) {
    return {
      id: "likovna",
      schoolProgram: "gimnazija4",
      includeSchool: true,
      scaleMax: 200,
      note: "Lanjski prag uključuje školske bodove i provjeru darovitosti. Školskih 80 nije cijela skala — maksimum je 200, a provjera ispod 70 nije položena.",
      extras: [
        {
          id: "provjera",
          label: "Provjera darovitosti",
          hint: "Crtanje i slikanje, najviše 120 bodova. Ispod 70 provjera nije položena.",
          max: 120,
          floor: 70,
          required: true,
        },
      ],
    };
  }

  if (scale > 210) {
    const examMax = Math.max(1, Math.ceil(scale - 80));
    return {
      id: "provjera",
      schoolProgram: "gimnazija4",
      includeSchool: true,
      scaleMax: 80 + examMax,
      note: "Ovaj program ima prag iznad školskih 80 bodova. Upiši bodove provjere da usporedba bude na istoj skali.",
      extras: [
        {
          id: "provjera",
          label: "Bodovi provjere posebnih sklonosti",
          hint: `Upiši bodove provjere, najviše ${examMax}.`,
          max: examMax,
          required: true,
        },
      ],
    };
  }

  return STANDARD_PROFILE;
}

export function computeProgramPoints(
  draft: JuniorGradeDraft,
  profile: ScoringProfile,
  extraInputs: ExtraInputs = {},
  prag?: KalkulatorPrag | null,
): ProgramPoints {
  const schoolProgram = profile.includeSchool ? (profile.schoolProgram ?? draft.program) : null;
  const school = schoolProgram
    ? computeSrednjaPoints({ ...draft, program: schoolProgram })
    : {
        opciUspjeh: 0,
        kljucniPredmeti: 0,
        posebniPredmeti: 0,
        dodatni: Math.max(0, toNum(draft.dodatniBodovi)),
        zajednicki: 0,
        ukupno: Math.max(0, toNum(draft.dodatniBodovi)),
        max: 0,
      };

  const extras: ProgramPointsExtra[] = profile.extras.map((extra) => {
    const raw = extraInputs[extra.id];
    const entered = raw != null && raw.trim() !== "";
    const points = entered ? clamp(toNum(raw), 0, extra.max) : 0;
    return {
      id: extra.id,
      label: extra.label,
      points,
      max: extra.max,
      entered,
      floor: extra.floor,
    };
  });

  const extraSum = extras.reduce((sum, extra) => sum + extra.points, 0);
  const ukupno = (schoolProgram ? school.zajednicki + school.dodatni : school.dodatni) + extraSum;
  const scaleMismatch = profile.id === "standard" && pragScale(prag) > 100;
  const nominal = profile.scaleMax > 0 ? profile.scaleMax : school.max;
  const publishedMax = scaleMismatch ? 0 : (prag?.max ?? 0);
  const failed = extras.find((extra) => extra.entered && extra.floor != null && extra.points < extra.floor);

  return {
    opciUspjeh: school.opciUspjeh,
    kljucniPredmeti: school.kljucniPredmeti,
    posebniPredmeti: school.posebniPredmeti,
    dodatni: school.dodatni,
    zajednicki: school.zajednicki,
    schoolMax: school.max,
    includeSchool: profile.includeSchool,
    schoolProgram,
    extras,
    ukupno,
    scaleMax: Math.max(nominal, publishedMax, ukupno),
    examPending: profile.extras.some((extra, index) => extra.required && !extras[index]?.entered),
    examFailed: Boolean(failed),
    failedFloor: failed?.floor ?? null,
    scaleMismatch,
    profileId: profile.id,
  };
}

export function chanceForProgram(
  points: number,
  pragMin: number,
  gate: { pending: boolean; failed: boolean; floor: number | null },
): Chance | null {
  if (gate.pending) return null;
  if (gate.failed) {
    const floor = gate.floor ?? 0;
    return {
      label: "Ne prolazi prijemni",
      desc: `Prijemni je ispod eliminacijskog praga od ${floor} bodova. Bez položenog prijemnog nema upisa, čak i ako je ostali zbroj visok.`,
      tone: "rose",
    };
  }
  return chanceFor(points, pragMin);
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

export type OfficialProgramExample = {
  name: string;
  schoolId: number;
  programId: number;
};

const officialExampleCache = new Map<number, OfficialProgramExample | null>();

export function officialProgramExample(program: HighSchoolProgram): OfficialProgramExample | null {
  if (officialExampleCache.has(program.id)) return officialExampleCache.get(program.id) ?? null;

  let best: { hit: OfficialProgramExample; score: number } | null = null;
  for (const school of kalkulatorSchools) {
    const prog = findKalkulatorProgram(school, program);
    if (!prog) continue;
    const pn = normalizeJuniorText(prog.name);
    let score = 0;
    for (const kw of program.matchKeywords.map(normalizeJuniorText).filter(Boolean)) {
      if (pn === kw) score += kw.length + 12;
      else if (pn.includes(kw)) score += kw.length + 4;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { hit: { name: prog.name, schoolId: school.id, programId: prog.id }, score };
    }
  }
  const value = best?.hit ?? null;
  officialExampleCache.set(program.id, value);
  return value;
}

export type QuizResultSchool = {
  school: EnrichedNearbySchool;
  program: HighSchoolProgram;
  matchPercentage: number;
};

export function pickQuizResultSchools(
  recs: JuniorProgramMatch[],
  nearbyByProgram: Map<number, NearbySchool[]> | null,
  limit = 3,
): QuizResultSchool[] {
  const out: QuizResultSchool[] = [];
  const seen = new Set<string>();

  const push = (raw: NearbySchool, rec: JuniorProgramMatch) => {
    const key = nameCityKey(raw.name, raw.city);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      school: enrichNearbySchool(raw, rec.program),
      program: rec.program,
      matchPercentage: rec.matchPercentage,
    });
  };

  if (nearbyByProgram) {
    for (const rec of recs) {
      for (const s of nearbyByProgram.get(rec.program.id) ?? []) {
        push(s, rec);
        if (out.length >= limit) return out;
      }
    }
  }

  for (const rec of recs) {
    for (const s of rec.availability.exampleSchools) {
      push({ name: s.name, city: s.city, distanceKm: 0 }, rec);
      if (out.length >= limit) return out;
    }
  }

  return out;
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
  touchLocalUpdated();
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
    touchLocalUpdated();
    return;
  }
  writeJson(QUICK_KEY, points, POINTS_EVENT);
  touchLocalUpdated();
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
  touchLocalUpdated();
  return { ok: true, item };
}

export function removeFromShortlist(key: string): void {
  writeJson(
    SHORTLIST_KEY,
    loadShortlist().filter((item) => item.key !== key),
    SHORTLIST_EVENT,
  );
  touchLocalUpdated();
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
  touchLocalUpdated();
  return snap;
}

export type JuniorCloudState = {
  updatedAt: string;
  snapshot: JuniorQuizSnapshot | null;
  shortlist: JuniorShortlistItem[];
  grades: JuniorGradeDraft | null;
  quickPoints: number | null;
};

export function collectJuniorLocalState(): JuniorCloudState {
  return {
    updatedAt: loadJuniorLocalUpdatedAt() || "1970-01-01T00:00:00.000Z",
    snapshot: loadJuniorSnapshot(),
    shortlist: loadShortlist(),
    grades: loadJuniorGrades(),
    quickPoints: loadQuickPoints(),
  };
}

function writeOrClear(key: string, value: unknown, eventName: string): void {
  if (value == null) {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent(eventName));
    } catch {
      /* ignore */
    }
    return;
  }
  writeJson(key, value, eventName);
}

export function applyJuniorRemoteState(state: JuniorCloudState): void {
  applyingRemoteState = true;
  try {
    writeOrClear(SNAPSHOT_KEY, state.snapshot, SNAPSHOT_EVENT);
    writeJson(SHORTLIST_KEY, Array.isArray(state.shortlist) ? state.shortlist : [], SHORTLIST_EVENT);
    writeOrClear(GRADES_KEY, state.grades, POINTS_EVENT);
    if (state.quickPoints == null) {
      try {
        window.localStorage.removeItem(QUICK_KEY);
        window.dispatchEvent(new CustomEvent(POINTS_EVENT));
      } catch {
        /* ignore */
      }
    } else {
      writeJson(QUICK_KEY, state.quickPoints, POINTS_EVENT);
    }
    writeJson(LOCAL_UPDATED_KEY, state.updatedAt);
  } finally {
    applyingRemoteState = false;
  }
}

export function juniorLocalHasData(state: JuniorCloudState = collectJuniorLocalState()): boolean {
  return Boolean(state.snapshot || state.shortlist.length || state.grades || state.quickPoints != null);
}

export function onJuniorSnapshotChange(callback: () => void): () => void {
  return subscribe(SNAPSHOT_EVENT, callback);
}

export function nextJuniorDeadline(from: Date = new Date()): CalendarEvent | null {
  return nextUpcomingEvent(juniorEvents, from);
}
