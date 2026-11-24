import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  ADVENT_OG_IMAGE_PATH,
  ADVENT_SEO,
  ADVENT_SITEMAP_ROUTES,
  getAdventSeoProps,
} from "./adventLeagueSeo";

describe("adventLeagueSeo", () => {
  it("svaka stranica ima title, description, canonical i OG sliku", () => {
    for (const key of ["landing", "quiz", "leaderboard"] as const) {
      const cfg = getAdventSeoProps(key);
      expect(cfg.title.length).toBeGreaterThan(10);
      expect(cfg.title.length).toBeLessThanOrEqual(70);
      expect(cfg.description.length).toBeGreaterThan(50);
      expect(cfg.description.length).toBeLessThanOrEqual(165);
      expect(cfg.canonical).toMatch(/^https:\/\/mojput\.com\/adventska-liga/);
      expect(cfg.image).toContain("og-advent-liga.png");
    }
  });

  it("landing ima JSON-LD s datumima sezone", () => {
    const ld = ADVENT_SEO.landing.jsonLd;
    expect(ld).toBeTruthy();
    const about = ld?.about as { startDate?: string; endDate?: string };
    expect(about?.startDate).toBe("2026-12-01");
    expect(about?.endDate).toBe("2026-12-24");
  });

  it("sitemap rute su SEO-friendly bez admina", () => {
    expect(ADVENT_SITEMAP_ROUTES.every((r) => r.path.startsWith("/adventska-liga"))).toBe(true);
    expect(ADVENT_SITEMAP_ROUTES.some((r) => r.path.includes("admin"))).toBe(false);
  });

  it("OG slika postoji u public/", () => {
    expect(existsSync(resolve(process.cwd(), "public", ADVENT_OG_IMAGE_PATH.replace(/^\//, "")))).toBe(true);
  });
});