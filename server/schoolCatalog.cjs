/**
 * Čita postojeći katalog srednjih škola iz src/data/highSchools.ts.
 * Ne duplicira listu — parsa generirani JSON niz.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { buildSchoolSlugMap } = require("./schoolSlug.cjs");

let cache = null;

function highSchoolsTsPath() {
  return path.join(__dirname, "..", "src", "data", "highSchools.ts");
}

function loadHighSchools() {
  if (cache) return cache;
  const fp = highSchoolsTsPath();
  const text = fs.readFileSync(fp, "utf8");
  const m = text.match(/export const highSchools: HighSchool\[\] = (\[[\s\S]*\]);\s*$/);
  if (!m) {
    throw new Error("Ne mogu parsirati src/data/highSchools.ts — očekujem export const highSchools.");
  }
  const schools = JSON.parse(m[1]);
  const slugById = buildSchoolSlugMap(schools);
  const byId = new Map();
  const bySlug = new Map();
  for (const school of schools) {
    const slug = slugById.get(school.id);
    school.slug = slug;
    byId.set(school.id, school);
    if (slug) bySlug.set(slug, school.id);
  }
  cache = { schools, slugById, byId, bySlug };
  return cache;
}

function getSchoolById(id) {
  return loadHighSchools().byId.get(id) || null;
}

function getSchoolBySlug(slug) {
  const clean = String(slug || "")
    .trim()
    .toLowerCase();
  const id = loadHighSchools().bySlug.get(clean);
  if (!id) return null;
  return getSchoolById(id);
}

function publicCatalogFields(school) {
  if (!school) return null;
  return {
    id: school.id,
    slug: school.slug,
    name: school.name,
    city: school.city,
    county: school.county,
    address: school.address,
    postalCode: school.postalCode,
    category: school.category,
    alsoElementary: Boolean(school.alsoElementary),
    website: school.website || null,
    emails: Array.isArray(school.emails) ? school.emails : [],
    phones: Array.isArray(school.phones) ? school.phones : [],
    principal: school.principal || null,
    founder: school.founder || null,
    lat: school.lat,
    lng: school.lng,
  };
}

function idsInCity(city) {
  const want = String(city || "")
    .trim()
    .toLowerCase();
  if (!want) return [];
  return loadHighSchools()
    .schools.filter((s) => String(s.city || "").toLowerCase() === want)
    .map((s) => s.id);
}

function idsInCounty(county) {
  const want = String(county || "")
    .trim()
    .toLowerCase();
  if (!want) return [];
  return loadHighSchools()
    .schools.filter((s) => String(s.county || "").toLowerCase() === want)
    .map((s) => s.id);
}

module.exports = {
  loadHighSchools,
  getSchoolById,
  getSchoolBySlug,
  publicCatalogFields,
  idsInCity,
  idsInCounty,
};
