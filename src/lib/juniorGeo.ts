/**
 * Geografska analiza za junior kviz — "što mogu upisati u blizini?".
 *
 * Spaja stvarnu bazu programa po školama (srednjaPrograms.ts, srednja.hr) s
 * koordinatama škola (highSchools.ts). Škole koje se ne mogu upariti po imenu
 * dobivaju koordinate središta svog grada (prosjek svih škola u tom gradu).
 * Udaljenost se računa haversine formulom, zračna linija.
 */

import { highSchools } from "@/data/highSchools";
import { srednjaProgramCounties } from "@/data/srednjaPrograms";
import type { HighSchoolProgram, JuniorProgramMatch } from "@/lib/juniorQuizEngine";

export type GeoSchool = {
  name: string;
  city: string;
  lat: number;
  lng: number;
  programs: string[];
  /** True kad su koordinate točne (uparena škola), false kad je korišten centar grada. */
  precise: boolean;
};

export type NearbySchool = {
  name: string;
  city: string;
  distanceKm: number;
};

export type NearbyProgramResult = {
  programId: number;
  schools: NearbySchool[];
};

export const NEARBY_MAX_KM = 30;

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const nameKey = (name: string, city: string): string =>
  `${normalizeText(name).replace(/[^a-z0-9]+/g, " ").trim()}|${normalizeText(city)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()}`;

/** Ručne koordinate za mjesta koja nemaju nijednu školu u highSchools bazi. */
const EXTRA_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "zagreb-dubrava": { lat: 45.8319, lng: 16.0544 },
  marcana: { lat: 44.955, lng: 13.965 },
  budinscina: { lat: 46.2056, lng: 16.1833 },
  popovaca: { lat: 45.5703, lng: 16.6258 },
  "kastel novi": { lat: 43.5522, lng: 16.398 },
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

export const haversineKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number => {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

// ---------------------------------------------------------------------------
// Lijena izgradnja spojene geo-baze
// ---------------------------------------------------------------------------

let geoSchoolsCache: GeoSchool[] | null = null;
let cityCentroidsCache: Map<string, { lat: number; lng: number }> | null = null;

const buildCityCentroids = (): Map<string, { lat: number; lng: number }> => {
  if (cityCentroidsCache) return cityCentroidsCache;
  const sums = new Map<string, { lat: number; lng: number; n: number }>();
  for (const school of highSchools) {
    const key = normalizeText(school.city);
    const entry = sums.get(key) ?? { lat: 0, lng: 0, n: 0 };
    entry.lat += school.lat;
    entry.lng += school.lng;
    entry.n += 1;
    sums.set(key, entry);
  }
  cityCentroidsCache = new Map(
    [...sums.entries()].map(([key, { lat, lng, n }]) => [key, { lat: lat / n, lng: lng / n }])
  );
  return cityCentroidsCache;
};

export const getGeoSchools = (): GeoSchool[] => {
  if (geoSchoolsCache) return geoSchoolsCache;

  const byNameCity = new Map(highSchools.map((s) => [nameKey(s.name, s.city), s]));
  const centroids = buildCityCentroids();
  const result: GeoSchool[] = [];

  for (const county of srednjaProgramCounties) {
    for (const school of county.schools) {
      const exact = byNameCity.get(nameKey(school.name, school.city));
      if (exact) {
        result.push({
          name: school.name,
          city: school.city,
          lat: exact.lat,
          lng: exact.lng,
          programs: school.programs,
          precise: true,
        });
        continue;
      }
      const cityKey = normalizeText(school.city);
      const centroid = centroids.get(cityKey) ?? EXTRA_CITY_COORDS[cityKey];
      if (centroid) {
        result.push({
          name: school.name,
          city: school.city,
          lat: centroid.lat,
          lng: centroid.lng,
          programs: school.programs,
          precise: false,
        });
      }
      // Škole bez ikakvih koordinata poštenije je izostaviti nego pogađati.
    }
  }

  geoSchoolsCache = result;
  return result;
};

/** Popis gradova za odabir "gdje živiš" — svi gradovi sa srednjom školom, abecedno. */
export const listQuizCities = (): string[] => {
  const cities = new Set<string>();
  for (const school of highSchools) cities.add(school.city);
  return [...cities].sort((a, b) => a.localeCompare(b, "hr"));
};

export const getCityCenter = (city: string): { lat: number; lng: number } | null => {
  const centroids = buildCityCentroids();
  return centroids.get(normalizeText(city)) ?? EXTRA_CITY_COORDS[normalizeText(city)] ?? null;
};

// ---------------------------------------------------------------------------
// Analiza blizine za preporučene programe
// ---------------------------------------------------------------------------

const schoolOffersProgram = (school: GeoSchool, program: HighSchoolProgram): boolean => {
  const keywords = program.matchKeywords.map(normalizeText);
  return school.programs.some((p) => {
    const normalized = normalizeText(p);
    return keywords.some((kw) => normalized.includes(kw));
  });
};

/** Škole koje nude program unutar maxKm od odabranog grada, sortirane po udaljenosti. */
export const nearbySchoolsForProgram = (
  program: HighSchoolProgram,
  city: string,
  maxKm: number = NEARBY_MAX_KM,
  limit = 4
): NearbySchool[] => {
  const center = getCityCenter(city);
  if (!center) return [];
  const matches: NearbySchool[] = [];
  for (const school of getGeoSchools()) {
    if (!schoolOffersProgram(school, program)) continue;
    const distanceKm = haversineKm(center, school);
    if (distanceKm <= maxKm) {
      matches.push({
        name: school.name,
        city: school.city,
        distanceKm: Math.round(distanceKm * 10) / 10,
      });
    }
  }
  return matches.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
};

export type NearbyAnalysis = {
  city: string;
  maxKm: number;
  /** programId -> škole u blizini. */
  byProgram: Map<number, NearbySchool[]>;
  /** Koliko od preporučenih programa ima barem jednu školu u blizini. */
  availableCount: number;
  totalCount: number;
};

export const analyzeNearby = (
  recommendations: JuniorProgramMatch[],
  city: string,
  maxKm: number = NEARBY_MAX_KM
): NearbyAnalysis => {
  const byProgram = new Map<number, NearbySchool[]>();
  let availableCount = 0;
  for (const rec of recommendations) {
    const schools = nearbySchoolsForProgram(rec.program, city, maxKm);
    byProgram.set(rec.program.id, schools);
    if (schools.length > 0) availableCount += 1;
  }
  return { city, maxKm, byProgram, availableCount, totalCount: recommendations.length };
};
