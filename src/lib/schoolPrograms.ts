// Povezivanje škola iz našeg popisa (highSchools) s upisnim programima
// iz srednja.hr kalkulatora (srednjaPrograms). Imena škola se u dva izvora
// mogu malo razlikovati, pa se podudaranje radi preko normaliziranih imena
// uz nekoliko razina fallbacka.

import { srednjaProgramCounties } from "@/data/srednjaPrograms";

function norm(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/š/g, "s")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stripCitySuffix(nName: string, nCity: string): string | null {
  if (nCity && nName.endsWith(" " + nCity)) {
    return nName.slice(0, -(nCity.length + 1)).trim();
  }
  return null;
}

type IndexedSchool = { nName: string; nCity: string; programs: string[] };

let indexCache: {
  byNameCity: Map<string, string[]>;
  byName: Map<string, string[][]>;
  byCity: Map<string, IndexedSchool[]>;
} | null = null;

function buildIndex() {
  if (indexCache) return indexCache;
  const byNameCity = new Map<string, string[]>();
  const byName = new Map<string, string[][]>();
  const byCity = new Map<string, IndexedSchool[]>();

  for (const county of srednjaProgramCounties) {
    for (const school of county.schools) {
      const nName = norm(school.name);
      const nCity = norm(school.city);
      const variants = new Set([nName]);
      const stripped = stripCitySuffix(nName, nCity);
      if (stripped) variants.add(stripped);
      for (const v of variants) {
        if (!byNameCity.has(`${v}|${nCity}`)) {
          byNameCity.set(`${v}|${nCity}`, school.programs);
        }
        const arr = byName.get(v) || [];
        arr.push(school.programs);
        byName.set(v, arr);
      }
      const cityArr = byCity.get(nCity) || [];
      cityArr.push({ nName, nCity, programs: school.programs });
      byCity.set(nCity, cityArr);
    }
  }

  indexCache = { byNameCity, byName, byCity };
  return indexCache;
}

/**
 * Vrati upisne programe za školu (po imenu i gradu) ili prazan niz
 * ako škola nije pronađena u srednja.hr podacima.
 */
export function getSchoolPrograms(name: string, city: string): string[] {
  const { byNameCity, byName, byCity } = buildIndex();
  const nCity = norm(city);
  const nName = norm(name);

  const variants = [nName];
  const stripped = stripCitySuffix(nName, nCity);
  if (stripped) variants.push(stripped);
  variants.push(`${nName} ${nCity}`);

  // 1) Točno ime + grad
  for (const v of variants) {
    const hit = byNameCity.get(`${v}|${nCity}`);
    if (hit) return hit;
  }

  // 2) Samo ime — ako je jednoznačno
  for (const v of variants) {
    const arr = byName.get(v);
    if (arr && arr.length === 1) return arr[0];
  }

  // 3) Unutar istog grada: jedno ime sadržano u drugom (jednoznačno)
  const cityCandidates = byCity.get(nCity) || [];
  const contains = cityCandidates.filter(
    (c) =>
      c.nName.length >= 8 &&
      nName.length >= 8 &&
      (c.nName.includes(nName) || nName.includes(c.nName)),
  );
  if (contains.length === 1) return contains[0].programs;

  return [];
}
