import type { HighSchool } from "@/data/highSchools";

/** Mora ostati usklađen s server/schoolSlug.cjs. */
export const RESERVED_SCHOOL_SLUGS = new Set([
  "prijava",
  "dashboard",
  "objave",
  "popis",
  "skola",
  "feed",
  "admin",
  "novosti",
  "profili",
]);

export function slugifyPart(raw: string | null | undefined): string {
  return String(raw || "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/ž/g, "z")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function schoolIdSuffix(id: string): string {
  return String(id || "")
    .toLowerCase()
    .replace(/^ss-/, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function baseSlugForSchool(school: Pick<HighSchool, "id" | "name" | "city">): string {
  let base = slugifyPart(school.name);
  const city = slugifyPart(school.city);
  if (city && base && !base.includes(city)) base = `${base}-${city}`;
  if (!base) base = `skola-${schoolIdSuffix(school.id) || "x"}`;
  if (RESERVED_SCHOOL_SLUGS.has(base)) {
    base = `${base}-${schoolIdSuffix(school.id) || "x"}`;
  }
  return base;
}

/** Deterministički: škole obraditi redom polja `id` (ss-1, ss-2, …). */
export function buildSchoolSlugMap(schools: Pick<HighSchool, "id" | "name" | "city">[]): Map<string, string> {
  const ordered = [...schools].sort((a, b) => {
    const na = Number(String(a.id || "").replace(/^ss-/i, "")) || 0;
    const nb = Number(String(b.id || "").replace(/^ss-/i, "")) || 0;
    if (na !== nb) return na - nb;
    return String(a.id).localeCompare(String(b.id));
  });
  const used = new Set<string>();
  const byId = new Map<string, string>();
  for (const school of ordered) {
    const base = baseSlugForSchool(school);
    let slug = base;
    let n = 2;
    while (used.has(slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }
    used.add(slug);
    byId.set(school.id, slug);
  }
  return byId;
}

let cachedMap: Map<string, string> | null = null;
let cachedReverse: Map<string, string> | null = null;
let cachedSourceLen = 0;

function mapsFor(schools: Pick<HighSchool, "id" | "name" | "city">[]) {
  if (!cachedMap || cachedSourceLen !== schools.length) {
    cachedMap = buildSchoolSlugMap(schools);
    cachedReverse = new Map([...cachedMap.entries()].map(([id, slug]) => [slug, id]));
    cachedSourceLen = schools.length;
  }
  return { byId: cachedMap, bySlug: cachedReverse! };
}

export function slugForSchool(
  school: Pick<HighSchool, "id" | "name" | "city">,
  schools: Pick<HighSchool, "id" | "name" | "city">[],
): string {
  return mapsFor(schools).byId.get(school.id) || baseSlugForSchool(school);
}

export function schoolIdFromSlug(
  slug: string,
  schools: Pick<HighSchool, "id" | "name" | "city">[],
): string | null {
  const clean = String(slug || "")
    .trim()
    .toLowerCase();
  if (!clean || RESERVED_SCHOOL_SLUGS.has(clean)) return null;
  return mapsFor(schools).bySlug.get(clean) || null;
}

export function slugifyPostTitle(title: string): string {
  return slugifyPart(title) || "objava";
}
