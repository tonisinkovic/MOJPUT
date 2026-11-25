"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  computeAdventDayScore,
  capAdventDurationMs,
  validateAdventSubmitTiming,
  validateAdventClientQuestionStart,
  ADVENT_DURATION_CAP_MS,
  ADVENT_MIN_DURATION_MS,
  ADVENT_MAX_START_AGE_MS,
} = require("./adventLeagueScoring.cjs");

describe("adventLeagueScoring", () => {
  describe("computeAdventDayScore", () => {
    it("netočan odgovor → 0", () => {
      assert.equal(computeAdventDayScore({ correct: false, durationMs: 1000 }).totalScore, 0);
      assert.equal(computeAdventDayScore({ correct: false, durationMs: 100000 }).totalScore, 0);
    });

    it("pojasevi 100/90/80/70/60/50", () => {
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 3000 }).totalScore, 100);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 5000 }).totalScore, 100);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 10000 }).totalScore, 90);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 15000 }).totalScore, 80);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 20000 }).totalScore, 70);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 25000 }).totalScore, 60);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 30000 }).totalScore, 50);
    });

    it("nakon 30 s ili limita → 0", () => {
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 45000 }).totalScore, 0);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 120000 }).totalScore, 0);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 8000, timeLimitSec: 10 }).totalScore, 90);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 11000, timeLimitSec: 10 }).totalScore, 0);
    });

    it("0 ms i negativno vrijeme → 100", () => {
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 0 }).totalScore, 100);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: -1000 }).totalScore, 100);
    });

    it("cap 120 s", () => {
      assert.equal(capAdventDurationMs(200000), ADVENT_DURATION_CAP_MS);
      assert.equal(computeAdventDayScore({ correct: true, durationMs: 200000 }).totalScore, 0);
    });
  });

  describe("validateAdventSubmitTiming", () => {
    const now = Date.now();

    it("validan timing → null (nema greške)", () => {
      assert.strictEqual(validateAdventSubmitTiming(now - 5000, now), null);
    });

    it("vrijeme početka u budućnosti → greška", () => {
      const err = validateAdventSubmitTiming(now + 10000, now);
      assert.ok(err);
      assert.match(err, /nevaljano vrijeme početka/i);
    });

    it("prebrz odgovor (< 500ms) → greška", () => {
      const err = validateAdventSubmitTiming(now - 300, now);
      assert.ok(err);
      assert.match(err, /prebrz/i);
    });

    it("granični slučaj: 500ms → validan", () => {
      assert.strictEqual(validateAdventSubmitTiming(now - ADVENT_MIN_DURATION_MS, now), null);
    });

    it("isteklo pitanje (> 15 min) → greška", () => {
      const err = validateAdventSubmitTiming(now - (ADVENT_MAX_START_AGE_MS + 1000), now);
      assert.ok(err);
      assert.match(err, /isteklo/i);
    });

    it("granični slučaj: 15 min → validan", () => {
      assert.strictEqual(validateAdventSubmitTiming(now - ADVENT_MAX_START_AGE_MS, now), null);
    });
  });

  describe("validateAdventClientQuestionStart", () => {
    it("odbija početak prije server sidra", () => {
      const submit = Date.now();
      const anchor = submit - 4000;
      assert.equal(validateAdventClientQuestionStart(anchor, anchor, submit), null);
      assert.ok(validateAdventClientQuestionStart(anchor - 20_000, anchor, submit));
    });
  });

  describe("capAdventDurationMs", () => {
    it("vrijeme < cap → vraća isto", () => {
      assert.strictEqual(capAdventDurationMs(10000), 10000);
    });

    it("vrijeme > cap → vraća cap", () => {
      assert.strictEqual(capAdventDurationMs(200000), ADVENT_DURATION_CAP_MS);
    });

    it("negativno vrijeme → vraća 0", () => {
      assert.strictEqual(capAdventDurationMs(-5000), 0);
    });

    it("NaN → vraća cap (safe default)", () => {
      assert.strictEqual(capAdventDurationMs(NaN), ADVENT_DURATION_CAP_MS);
    });

    it("Infinity → vraća cap", () => {
      assert.strictEqual(capAdventDurationMs(Infinity), ADVENT_DURATION_CAP_MS);
    });
  });
});
