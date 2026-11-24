const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  computeAdventDayScore,
  validateAdventSubmitTiming,
  validateAdventClientQuestionStart,
  capAdventDurationMs,
  ADVENT_MIN_DURATION_MS,
  ADVENT_MAX_START_AGE_MS,
  ADVENT_DURATION_CAP_MS,
} = require("./adventLeagueScoring.cjs");

describe("adventLeagueScoring", () => {
  describe("computeAdventDayScore", () => {
    it("netočan odgovor → 0 bodova bez obzira na vrijeme", () => {
      assert.deepStrictEqual(computeAdventDayScore({ correct: false, durationMs: 1000 }), {
        baseScore: 0,
        timeBonus: 0,
        totalScore: 0,
      });
      assert.deepStrictEqual(computeAdventDayScore({ correct: false, durationMs: 100000 }), {
        baseScore: 0,
        timeBonus: 0,
        totalScore: 0,
      });
    });

    it("točan odgovor ≤ 5s → 100 bodova", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: 3000 });
      assert.strictEqual(res.totalScore, 100);
      assert.strictEqual(res.baseScore, 100);
    });

    it("točan odgovor ≤ 15s → 95-100 bodova", () => {
      const res10s = computeAdventDayScore({ correct: true, durationMs: 10000 });
      assert.ok(res10s.totalScore >= 95 && res10s.totalScore <= 100);

      const res15s = computeAdventDayScore({ correct: true, durationMs: 15000 });
      assert.strictEqual(res15s.totalScore, 95);
    });

    it("točan odgovor ≤ 30s → 85-95 bodova", () => {
      const res20s = computeAdventDayScore({ correct: true, durationMs: 20000 });
      assert.ok(res20s.totalScore >= 85 && res20s.totalScore <= 95);

      const res30s = computeAdventDayScore({ correct: true, durationMs: 30000 });
      assert.strictEqual(res30s.totalScore, 85);
    });

    it("točan odgovor ≤ 60s → 75-85 bodova", () => {
      const res45s = computeAdventDayScore({ correct: true, durationMs: 45000 });
      assert.ok(res45s.totalScore >= 75 && res45s.totalScore <= 85);

      const res60s = computeAdventDayScore({ correct: true, durationMs: 60000 });
      assert.strictEqual(res60s.totalScore, 75);
    });

    it("točan odgovor > 60s → 70 bodova (minimum)", () => {
      const res90s = computeAdventDayScore({ correct: true, durationMs: 90000 });
      assert.strictEqual(res90s.totalScore, 70);

      const res120s = computeAdventDayScore({ correct: true, durationMs: 120000 });
      assert.strictEqual(res120s.totalScore, 70);
    });

    it("edge case: 0ms odgovor (instant) → 100", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: 0 });
      assert.strictEqual(res.totalScore, 100);
    });

    it("edge case: negativno vrijeme → tretira kao 0", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: -1000 });
      assert.strictEqual(res.totalScore, 100);
    });

    it("cap: vrijeme iznad 120s se tretira kao 120s", () => {
      const res = computeAdventDayScore({ correct: true, durationMs: 200000 });
      // 120s je > 60s, dakle 70 bodova
      assert.strictEqual(res.totalScore, 70);
    });
  });

  describe("validateAdventSubmitTiming", () => {
    const now = Date.now();

    it("validan timing → null (nema greške)", () => {
      const startedAt = now - 5000; // prije 5s
      assert.strictEqual(validateAdventSubmitTiming(startedAt, now), null);
    });

    it("vrijeme početka u budućnosti → greška", () => {
      const future = now + 10000;
      const err = validateAdventSubmitTiming(future, now);
      assert.ok(err);
      assert.match(err, /nevaljano vrijeme početka/i);
    });

    it("prebrz odgovor (< 500ms) → greška", () => {
      const startedAt = now - 300;
      const err = validateAdventSubmitTiming(startedAt, now);
      assert.ok(err);
      assert.match(err, /prebrz/i);
    });

    it("granični slučaj: 500ms → validan", () => {
      const startedAt = now - ADVENT_MIN_DURATION_MS;
      assert.strictEqual(validateAdventSubmitTiming(startedAt, now), null);
    });

    it("isteklo pitanje (> 15 min) → greška", () => {
      const startedAt = now - (ADVENT_MAX_START_AGE_MS + 1000);
      const err = validateAdventSubmitTiming(startedAt, now);
      assert.ok(err);
      assert.match(err, /isteklo/i);
    });

    it("granični slučaj: 15 min → validan", () => {
      const startedAt = now - ADVENT_MAX_START_AGE_MS;
      assert.strictEqual(validateAdventSubmitTiming(startedAt, now), null);
    });
  });

  describe("validateAdventClientQuestionStart", () => {
    it("odbija početak prije server sidra", () => {
      const submit = Date.now();
      const anchor = submit - 4000;
      const ok = validateAdventClientQuestionStart(anchor, anchor, submit);
      assert.equal(ok, null);
      const bad = validateAdventClientQuestionStart(anchor - 20_000, anchor, submit);
      assert.ok(bad);
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