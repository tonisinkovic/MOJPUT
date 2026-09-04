/**
 * Lokacija nakon senior kviza — ostajem / idem u drugi grad / svejedno.
 *
 * Fakulteti u study-programs.json navedeni su kao „FER (Zagreb)”.
 * Ovdje izvlačimo grad, računamo udaljenost od odabranog mjesta i
 * označavamo koji se studij stvarno može upisati tamo gdje osoba želi ići.
 */

import { getFacultyCityCenter, listFacultyCities } from "@/data/facultyLocations";
import type { StudyProgramMatch } from "@/lib/studyProgramEngine";

export type SeniorLocationPlan = "stay" | "move" | "anywhere";

export type SeniorLocation = {
  homeCity: string;
  plan: SeniorLocationPlan;
  /** Popunjava se samo kad plan === "move". */
  targetCity: string | null;
};

export type FacultyOffer = {
  label: string;
  city: string | null;
  distanceKm: number | null;
  /** True ako fakultet odgovara odabranom planu (ostanak / odlazak / svejedno). */
  matchesPlan: boolean;
};

export type LocatedProgram = StudyProgramMatch & {
  localFaculties: FacultyOffer[];
  remoteFaculties: FacultyOffer[];
  availableLocally: boolean;
};

export const SENIOR_NEARBY_KM = 40;

export { listFacultyCities };

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const toRad = (deg: number) => (deg * Math.PI) / 180;

const haversineKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number => {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const sameCity = (a: string, b: string) => normalize(a) === normalize(b);

/** Gradovi navedeni u zagradi: "FER (Zagreb)", "Veleučilišta (Dubrovnik, Šibenik)". */
export function citiesFromFacultyLabel(label: string): string[] {
  const known = listFacultyCities();
  const found = new Set<string>();
  const matches = label.matchAll(/\(([^)]+)\)/g);
  for (const match of matches) {
    for (const part of match[1].split(/[,/]| i /)) {
      const raw = part.trim();
      if (!raw) continue;
      const hit = known.find((c) => sameCity(c, raw) || normalize(raw).includes(normalize(c)));
      if (hit) found.add(hit);
    }
  }
  if (found.size === 0) {
    const hit = known.find((c) => normalize(label).includes(normalize(c)));
    if (hit) found.add(hit);
  }
  return [...found];
}

function referenceCity(location: SeniorLocation): string {
  return location.plan === "move" && location.targetCity ? location.targetCity : location.homeCity;
}

function offerForLabel(label: string, location: SeniorLocation): FacultyOffer[] {
  const cities = citiesFromFacultyLabel(label);
  const ref = referenceCity(location);
  const refCenter = getFacultyCityCenter(ref);

  if (cities.length === 0) {
    return [
      {
        label,
        city: null,
        distanceKm: null,
        matchesPlan: location.plan === "anywhere",
      },
    ];
  }

  return cities.map((city) => {
    const center = getFacultyCityCenter(city);
    const distanceKm =
      refCenter && center ? Math.round(haversineKm(refCenter, center) * 10) / 10 : null;
    const inSameCity = sameCity(city, ref);
    const nearby = distanceKm !== null && distanceKm <= SENIOR_NEARBY_KM;
    let matchesPlan = true;
    if (location.plan === "stay") matchesPlan = inSameCity || nearby;
    if (location.plan === "move") matchesPlan = inSameCity;
    return { label, city, distanceKm, matchesPlan };
  });
}

export function locateStudyPrograms(
  matches: StudyProgramMatch[],
  location: SeniorLocation | null,
): LocatedProgram[] {
  if (!location) {
    return matches.map((m) => ({
      ...m,
      localFaculties: [],
      remoteFaculties: [],
      availableLocally: false,
    }));
  }

  const located = matches.map((m) => {
    const offers = m.program.faculties.flatMap((label) => offerForLabel(label, location));
    const localFaculties = offers.filter((o) => o.matchesPlan);
    const remoteFaculties = offers.filter((o) => !o.matchesPlan);
    return {
      ...m,
      localFaculties,
      remoteFaculties,
      availableLocally: localFaculties.length > 0,
    };
  });

  if (location.plan === "anywhere") return located;

  return [...located].sort((a, b) => {
    if (a.availableLocally !== b.availableLocally) return a.availableLocally ? -1 : 1;
    return b.matchPercentage - a.matchPercentage;
  });
}

export function locationSummary(location: SeniorLocation): string {
  if (location.plan === "stay") {
    return `Ostaješ u mjestu ${location.homeCity} — prvo pokazujemo studije koje možeš upisati tamo ili u krugu od ${SENIOR_NEARBY_KM} km.`;
  }
  if (location.plan === "move" && location.targetCity) {
    return `Želiš studirati u mjestu ${location.targetCity} — prvo idu programi koji se tamo stvarno upisuju.`;
  }
  return `Živiš u mjestu ${location.homeCity}, a grad studija ti je svejedan — pokazujemo sve fakultete za tvoje preporuke.`;
}
