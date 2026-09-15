import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { generateSchoolPassword } = require("../../server/schoolPasswords.cjs");
const { loadHighSchools } = require("../../server/schoolCatalog.cjs");

describe("school password generator", () => {
  it("generira jedinstvene lozinke u očekivanom formatu", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 40; i += 1) {
      const pw = generateSchoolPassword();
      expect(pw.startsWith("MojPut-")).toBe(true);
      expect(pw.length).toBeGreaterThan(12);
      expect(seen.has(pw)).toBe(false);
      seen.add(pw);
    }
  });
});

describe("school catalog parser", () => {
  it("učitava postojeći highSchools.ts bez dupliciranja liste", () => {
    const { schools, slugById } = loadHighSchools();
    expect(schools.length).toBeGreaterThan(400);
    expect(slugById.size).toBe(schools.length);
    expect(schools[0].id).toBe("ss-1");
    expect(String(schools[0].slug || slugById.get(schools[0].id)).length).toBeGreaterThan(3);
  });
});
