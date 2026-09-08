import { describe, expect, it } from "vitest";
import { highSchools } from "@/data/highSchools";
import {
  JUNIOR_CALCULATOR_SCHOOL_COUNT,
  JUNIOR_CATALOG_NOTE,
  JUNIOR_MAP_SCHOOL_COUNT,
  JUNIOR_MISSING_NEARBY_NOTE,
  JUNIOR_MISSING_SCHOOL_NOTE,
  JUNIOR_SCHOOL_COUNT_NOTE,
} from "@/lib/juniorHonesty";
import { JUNIOR_PROGRAM_FAMILY_COUNT } from "@/lib/juniorQuizEngine";
import {
  isJuniorEditorialThread,
  isJuniorEditorialUsername,
  juniorThirdYearStudentCount,
  juniorThirdYearThreads,
} from "@/lib/juniorThirdYearForum";

describe("junior honesty copy", () => {
  it("kaže da 33 obitelji nisu cijeli katalog", () => {
    expect(JUNIOR_PROGRAM_FAMILY_COUNT).toBe(33);
    expect(JUNIOR_CATALOG_NOTE).toMatch(/33/);
    expect(JUNIOR_CATALOG_NOTE).toMatch(/nije cijeli službeni katalog/i);
  });

  it("razlikuje broj škola na karti i u kalkulatoru", () => {
    expect(JUNIOR_MAP_SCHOOL_COUNT).toBe(highSchools.length);
    expect(JUNIOR_CALCULATOR_SCHOOL_COUNT).toBeGreaterThan(JUNIOR_MAP_SCHOOL_COUNT);
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(String(JUNIOR_MAP_SCHOOL_COUNT));
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(String(JUNIOR_CALCULATOR_SCHOOL_COUNT));
    expect(JUNIOR_SCHOOL_COUNT_NOTE).toMatch(/nisu isti popisi/i);
  });

  it("jasno kaže kad škole nema u bazi", () => {
    expect(JUNIOR_MISSING_SCHOOL_NOTE).toMatch(/ne izmišljamo/i);
    expect(JUNIOR_MISSING_NEARBY_NOTE).toMatch(/ne znači da škole nema/i);
  });
});

describe("živi 3. razred", () => {
  it("ima 5 istih pitanja i 10+ učenika iz više škola", () => {
    expect(juniorThirdYearThreads).toHaveLength(5);
    expect(juniorThirdYearStudentCount()).toBeGreaterThanOrEqual(10);
    const schools = new Set(
      juniorThirdYearThreads.flatMap((t) => t.replies.map((r) => r.school)),
    );
    expect(schools.size).toBeGreaterThanOrEqual(3);
    expect(juniorThirdYearThreads.every((t) => t.replies.length >= 3)).toBe(true);
  });

  it("uredničke teme se prepoznaju po naslovu", () => {
    expect(isJuniorEditorialThread(juniorThirdYearThreads[0].title)).toBe(true);
    expect(isJuniorEditorialThread("Slučajna tema osmakova")).toBe(false);
  });

  it("Marta3Med i ostali seed nalozi nisu stvarni učenici", () => {
    expect(isJuniorEditorialUsername("Marta3Med")).toBe(true);
    expect(isJuniorEditorialUsername(juniorThirdYearThreads[0].asker)).toBe(true);
    expect(isJuniorEditorialUsername("PravaUcenica")).toBe(false);
  });
});
