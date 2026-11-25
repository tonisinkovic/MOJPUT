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
    it("netočan odgovor donosi 0 bodova", () => {
      expect(computeAdventDayScore({ correct: false, durationMs: 1000 }).totalScore).toBe(0);
      expect(computeAdventDayScore({ correct: false, durationMs: 100_000 }).totalScore).toBe(0);
    });

    it("0–5 s donosi 100, a sljedeći pojasevi padaju po 10", () => {
      expect(computeAdventDayScore({ correct: true, durationMs: 0 }).totalScore).toBe(100);
      expect(computeAdventDayScore({ correct: true, durationMs: 5_000 }).totalScore).toBe(100);
      expect(computeAdventDayScore({ correct: true, durationMs: 5_001 }).totalScore).toBe(90);
      expect(computeAdventDayScore({ correct: true, durationMs: 10_000 }).totalScore).toBe(90);
      expect(computeAdventDayScore({ correct: true, durationMs: 15_000 }).totalScore).toBe(80);
      expect(computeAdventDayScore({ correct: true, durationMs: 20_000 }).totalScore).toBe(70);
      expect(computeAdventDayScore({ correct: true, durationMs: 25_000 }).totalScore).toBe(60);
      expect(computeAdventDayScore({ correct: true, durationMs: 30_000 }).totalScore).toBe(50);
    });

    it("nakon 30 s ili nakon limita pitanja bodovi su 0", () => {
      expect(computeAdventDayScore({ correct: true, durationMs: 31_000 }).totalScore).toBe(0);
      expect(computeAdventDayScore({ correct: true, durationMs: 8_000, timeLimitSec: 10 }).totalScore).toBe(90);
      expect(computeAdventDayScore({ correct: true, durationMs: 12_000, timeLimitSec: 10 }).totalScore).toBe(0);
    });

    it("negativno vrijeme tretira kao 0 s", () => {
      expect(computeAdventDayScore({ correct: true, durationMs: -1000 }).totalScore).toBe(100);
    });

    it("cap iznad 120 s i dalje je izvan pojasa", () => {
      expect(capAdventDurationMs(200_000)).toBe(ADVENT_DURATION_CAP_MS);
      expect(computeAdventDayScore({ correct: true, durationMs: 200_000 }).totalScore).toBe(0);
    });
  });

  describe("validateAdventSubmitTiming", () => {
    const now = Date.now();

    it("validan timing → null", () => {
      expect(validateAdventSubmitTiming(now - 5000, now)).toBeNull();
    });

    it("prebrz odgovor (< 500ms) → greška", () => {
      expect(validateAdventSubmitTiming(now - 300, now)?.toLowerCase()).toMatch(/prebrz/);
    });

    it("granični slučaj: 500ms → validan", () => {
      expect(validateAdventSubmitTiming(now - ADVENT_MIN_DURATION_MS, now)).toBeNull();
    });

    it("isteklo pitanje (> 15 min) → greška", () => {
      expect(validateAdventSubmitTiming(now - (ADVENT_MAX_START_AGE_MS + 1000), now)?.toLowerCase()).toMatch(/isteklo/);
    });

    it("granični slučaj: 15 min → validan", () => {
      expect(validateAdventSubmitTiming(now - ADVENT_MAX_START_AGE_MS, now)).toBeNull();
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
