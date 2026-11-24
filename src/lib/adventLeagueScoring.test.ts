import { describe, expect, it } from "vitest";
import {
  ADVENT_DURATION_CAP_MS,
  ADVENT_MIN_DURATION_MS,
  ADVENT_MAX_START_AGE_MS,
  capAdventDurationMs,
  computeAdventDayScore,
  validateAdventSubmitTiming,
} from "@/lib/adventLeagueScoring";

describe("adventLeagueScoring", () => {
  describe("computeAdventDayScore", () => {
    it("netočan odgovor donosi 0 bodova bez obzira na vrijeme", () => {
      const res1 = computeAdventDayScore({ correct: false, durationMs: 1000 });
      expect(res1.totalScore).toBe(0);
      expect(res1.baseScore).toBe(0);
      expect(res1.timeBonus).toBe(0);

      const res2 = computeAdventDayScore({ correct: false, durationMs: 100_000 });
      expect(res2.totalScore).toBe(0);
    });

    it("točan odgovor ≤ 5s donosi 100 bodova", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: 3000 });
      expect(res.totalScore).toBe(100);
      expect(res.baseScore).toBe(100);
      expect(res.timeBonus).toBe(0);
    });

    it("točan odgovor ≤ 15s donosi 95-100 bodova", () => {
      const res10s = computeAdventDayScore({ correct: true, durationMs: 10_000 });
      expect(res10s.totalScore).toBeGreaterThanOrEqual(95);
      expect(res10s.totalScore).toBeLessThanOrEqual(100);

      const res15s = computeAdventDayScore({ correct: true, durationMs: 15_000 });
      expect(res15s.totalScore).toBe(95);
    });

    it("točan odgovor ≤ 30s donosi 85-95 bodova", () => {
      const res20s = computeAdventDayScore({ correct: true, durationMs: 20_000 });
      expect(res20s.totalScore).toBeGreaterThanOrEqual(85);
      expect(res20s.totalScore).toBeLessThanOrEqual(95);

      const res30s = computeAdventDayScore({ correct: true, durationMs: 30_000 });
      expect(res30s.totalScore).toBe(85);
    });

    it("točan odgovor ≤ 60s donosi 75-85 bodova", () => {
      const res45s = computeAdventDayScore({ correct: true, durationMs: 45_000 });
      expect(res45s.totalScore).toBeGreaterThanOrEqual(75);
      expect(res45s.totalScore).toBeLessThanOrEqual(85);

      const res60s = computeAdventDayScore({ correct: true, durationMs: 60_000 });
      expect(res60s.totalScore).toBe(75);
    });

    it("točan odgovor > 60s donosi 70 bodova (minimum)", () => {
      const res90s = computeAdventDayScore({ correct: true, durationMs: 90_000 });
      expect(res90s.totalScore).toBe(70);

      const res120s = computeAdventDayScore({ correct: true, durationMs: 120_000 });
      expect(res120s.totalScore).toBe(70);
    });

    it("edge case: 0ms instant odgovor → 100", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: 0 });
      expect(res.totalScore).toBe(100);
    });

    it("edge case: negativno vrijeme → tretira kao 0", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: -1000 });
      expect(res.totalScore).toBe(100);
    });

    it("cap: vrijeme iznad 120s se tretira kao 120s", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: 200_000 });
      expect(res.totalScore).toBe(70); // 120s je > 60s
    });
  });

  describe("validateAdventSubmitTiming", () => {
    const now = Date.now();

    it("validan timing → null", () => {
      const startedAt = now - 5000;
      expect(validateAdventSubmitTiming(startedAt, now)).toBeNull();
    });

    it("vrijeme početka u budućnosti → greška", () => {
      const future = now + 10_000;
      const err = validateAdventSubmitTiming(future, now);
      expect(err).toBeTruthy();
      // Budućnost rezultira negativnim durationom, pa će biti "prebrz"
      expect(err).toBeTruthy();
    });

    it("prebrz odgovor (< 500ms) → greška", () => {
      const startedAt = now - 300;
      const err = validateAdventSubmitTiming(startedAt, now);
      expect(err).toBeTruthy();
      expect(err?.toLowerCase()).toMatch(/prebrz/);
    });

    it("granični slučaj: 500ms → validan", () => {
      const startedAt = now - ADVENT_MIN_DURATION_MS;
      expect(validateAdventSubmitTiming(startedAt, now)).toBeNull();
    });

    it("isteklo pitanje (> 15 min) → greška", () => {
      const startedAt = now - (ADVENT_MAX_START_AGE_MS + 1000);
      const err = validateAdventSubmitTiming(startedAt, now);
      expect(err).toBeTruthy();
      expect(err?.toLowerCase()).toMatch(/isteklo/);
    });

    it("granični slučaj: 15 min → validan", () => {
      const startedAt = now - ADVENT_MAX_START_AGE_MS;
      expect(validateAdventSubmitTiming(startedAt, now)).toBeNull();
    });
  });

  describe("capAdventDurationMs", () => {
    it("vrijeme < cap → vraća isto", () => {
      expect(capAdventDurationMs(10_000)).toBe(10_000);
    });

    it("vrijeme > cap → vraća cap", () => {
      expect(capAdventDurationMs(200_000)).toBe(ADVENT_DURATION_CAP_MS);
    });

    it("negativno vrijeme → vraća 0", () => {
      expect(capAdventDurationMs(-5000)).toBe(0);
    });

    it("NaN → vraća cap (safe default)", () => {
      expect(capAdventDurationMs(NaN)).toBe(ADVENT_DURATION_CAP_MS);
    });

    it("Infinity → vraća cap", () => {
      expect(capAdventDurationMs(Infinity)).toBe(ADVENT_DURATION_CAP_MS);
    });
  });
});