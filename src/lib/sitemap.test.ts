import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { highSchools } from "@/data/highSchools";
import { facultyCatalog } from "./facultyCatalog";
import { slugForSchool } from "./schoolSlug";

const xml = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

describe("public/sitemap.xml (osvježi s `npm run sitemap`)", () => {
  it("nema duplikata", () => {
    expect(new Set(locs).size).toBe(locs.length);
  });

  it("sadrži svaki profil fakulteta", () => {
    const missing = facultyCatalog.filter((f) => !locs.includes(`https://www.mojput.com/fakulteti/${f.id}`));
    expect(missing.map((f) => f.id)).toEqual([]);
  });

  it("sadrži svaku srednju školu", () => {
    const missing = highSchools.filter(
      (s) => !locs.includes(`https://www.mojput.com${encodeURI(`/srednje-skole/${slugForSchool(s, highSchools)}`)}`),
    );
    expect(missing.map((s) => s.name)).toEqual([]);
  });

  it("ne izlaže privatne rute", () => {
    expect(locs.some((l) => /\/(tim|profil|skola|prijava|registracija|mature)(\/|$)/.test(l))).toBe(false);
  });
});
