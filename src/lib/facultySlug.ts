import { slugifyPart } from "./schoolSlug";

export const RESERVED_FACULTY_SLUGS = new Set([
  "prijava",
  "dashboard",
  "objave",
  "profili",
  "karta",
  "popis",
  "admin",
  "novosti",
  "fakultet",
  "fakulteti",
]);

export function baseFacultySlug(name: string, city: string): string {
  let base = slugifyPart(name);
  const citySlug = slugifyPart(city);
  if (citySlug && base && !base.includes(citySlug)) base = `${base}-${citySlug}`;
  if (!base) base = citySlug ? `fakultet-${citySlug}` : "fakultet";
  if (RESERVED_FACULTY_SLUGS.has(base)) base = `${base}-ustanova`;
  return base;
}

export function uniqueFacultySlug(base: string, used: Set<string>): string {
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

/** Stari demo ID-evi da postojeći bookmarkovi i preporuke ostanu valjani. */
export function legacyFacultyId(university: string, facultyName: string): string | null {
  const uni = university.toLowerCase();
  const name = facultyName.toLowerCase();
  if (
    (uni.includes("zagrebu") || name.includes("sveučilišta u zagrebu")) &&
    name.includes("elektrotehnike i računarstva") &&
    !name.includes(",")
  ) {
    return "fer-zg";
  }
  if ((uni.includes("splitu") || name.includes("sveučilišta u splitu")) && /^ekonomski fakultet/.test(name.trim())) {
    return "efst-split";
  }
  if ((uni.includes("rijeci") || name.includes("sveučilišta u rijeci")) && /^medicinski fakultet/.test(name.trim())) {
    return "medri-ri";
  }
  return null;
}
