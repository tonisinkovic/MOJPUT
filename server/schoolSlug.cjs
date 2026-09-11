/**
 * Jedinstveni SEO slug za srednje škole (katalog highSchools).
 * Mora ostati usklađen s src/lib/schoolSlug.ts.
 */
"use strict";

const RESERVED_SCHOOL_SLUGS = new Set([
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

function slugifyPart(raw) {
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

function schoolIdSuffix(id) {
  return String(id || "")
    .toLowerCase()
    .replace(/^ss-/, "")
    .replace(/[^a-z0-9]+/g, "");
}

function baseSlugForSchool(school) {
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
function buildSchoolSlugMap(schools) {
  const ordered = [...schools].sort((a, b) => {
    const na = Number(String(a.id || "").replace(/^ss-/i, "")) || 0;
    const nb = Number(String(b.id || "").replace(/^ss-/i, "")) || 0;
    if (na !== nb) return na - nb;
    return String(a.id).localeCompare(String(b.id));
  });
  const used = new Set();
  const byId = new Map();
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

function slugifyPostTitle(title) {
  return slugifyPart(title) || "objava";
}

module.exports = {
  RESERVED_SCHOOL_SLUGS,
  slugifyPart,
  baseSlugForSchool,
  buildSchoolSlugMap,
  slugifyPostTitle,
};
