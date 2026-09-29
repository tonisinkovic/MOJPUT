import { describe, expect, it } from "vitest";
import { highSchools } from "@/data/highSchools";
import {
  RESERVED_SCHOOL_SLUGS,
  buildSchoolSlugMap,
  schoolIdFromSlug,
  slugForSchool,
} from "@/lib/schoolSlug";

describe("school slugs", () => {
  it("generira jedinstven slug za svaku školu u katalogu", () => {
    const map = buildSchoolSlugMap(highSchools);
    expect(map.size).toBe(highSchools.length);
    expect(new Set(map.values()).size).toBe(highSchools.length);
  });

  it("ne koristi rezervirane rute kao slug", () => {
    const map = buildSchoolSlugMap(highSchools);
    for (const slug of map.values()) {
      expect(RESERVED_SCHOOL_SLUGS.has(slug)).toBe(false);
    }
  });

  it("round-trip id <-> slug", () => {
    const school = highSchools[0];
    const slug = slugForSchool(school, highSchools);
    expect(schoolIdFromSlug(slug, highSchools)).toBe(school.id);
    expect(schoolIdFromSlug("prijava", highSchools)).toBeNull();
    expect(schoolIdFromSlug("profili", highSchools)).toBeNull();
    expect(schoolIdFromSlug("nepostoji-xyz", highSchools)).toBeNull();
  });

  it("Jure Kaštelan Omiš ima predvidiv slug", () => {
    const school = highSchools.find((item) => item.id === "ss-304");
    expect(school).toBeTruthy();
    expect(slugForSchool(school!, highSchools)).toBe("srednja-skola-jure-kastelan-omis");
  });
});
