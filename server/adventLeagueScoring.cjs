"use strict";

const fs = require("fs");
const path = require("path");

const ADVENT_DURATION_CAP_MS = 120_000;
const ADVENT_MIN_DURATION_MS = 500;
const ADVENT_MAX_START_AGE_MS = 15 * 60 * 1000;
const ADVENT_CLIENT_CLOCK_SKEW_MS = 5_000;
const SCORING_PATH = path.join(__dirname, "..", "src", "data", "advent-league", "scoring.json");

const DEFAULT_CONFIG = {
  version: 2,
  timeBands: [
    { maxSeconds: 5, points: 100 },
    { maxSeconds: 10, points: 90 },
    { maxSeconds: 15, points: 80 },
    { maxSeconds: 20, points: 70 },
    { maxSeconds: 25, points: 60 },
    { maxSeconds: 30, points: 50 },
  ],
  defaultTimeLimitSec: 30,
  easyQuestionIndex: 5,
  easyTimeLimitSec: 10,
  submitGraceMs: 1500,
  minDurationMs: 500,
  distance: { fullPointsWithinKm: 15, zeroBeyondPercent: 40 },
};

let cachedConfig = null;

function loadScoringConfig() {
  if (cachedConfig) return cachedConfig;
  try {
    const parsed = JSON.parse(fs.readFileSync(SCORING_PATH, "utf8"));
    cachedConfig = { ...DEFAULT_CONFIG, ...parsed, distance: { ...DEFAULT_CONFIG.distance, ...(parsed.distance || {}) } };
  } catch {
    cachedConfig = DEFAULT_CONFIG;
  }
  return cachedConfig;
}

function reloadScoringConfig() {
  cachedConfig = null;
  return loadScoringConfig();
}

function capAdventDurationMs(durationMs) {
  if (!Number.isFinite(durationMs)) return ADVENT_DURATION_CAP_MS;
  if (durationMs < 0) return 0;
  return Math.min(durationMs, ADVENT_DURATION_CAP_MS);
}

function zeroScore() {
  return { baseScore: 0, timeBonus: 0, totalScore: 0 };
}

/**
 * Bodovanje točnog odgovora po vremenskim pojasevima.
 * 0–5 s → 100, 6–10 → 90, 11–15 → 80, 16–20 → 70, 21–25 → 60, 26–30 → 50.
 * Nakon timeLimitSec (ili nakon zadnjeg pojasa) točan odgovor više ne donosi bodove.
 */
function computeAdventDayScore({ correct, durationMs, timeLimitSec }) {
  if (!correct) return zeroScore();

  const config = loadScoringConfig();
  const capped = capAdventDurationMs(durationMs);
  const durationSec = capped / 1000;
  const limit = Number(timeLimitSec);
  if (Number.isFinite(limit) && limit > 0 && durationSec > limit) return zeroScore();

  const bands = Array.isArray(config.timeBands) && config.timeBands.length ? config.timeBands : DEFAULT_CONFIG.timeBands;
  for (const band of bands) {
    if (durationSec <= Number(band.maxSeconds)) {
      const points = Number(band.points) || 0;
      return { baseScore: points, timeBonus: 0, totalScore: points };
    }
  }
  return zeroScore();
}

function resolveTimeLimitSec(question) {
  const config = loadScoringConfig();
  const explicit = Number(question?.timeLimitSec);
  if (Number.isFinite(explicit) && explicit >= 5) return explicit;
  if (Number(question?.index) === Number(config.easyQuestionIndex)) return Number(config.easyTimeLimitSec) || 10;
  return Number(config.defaultTimeLimitSec) || 30;
}

function validateAdventSubmitTiming(startedAtMs, submittedAtMs) {
  const durationMs = submittedAtMs - startedAtMs;
  if (startedAtMs > submittedAtMs) return "Nevaljano vrijeme početka.";
  if (durationMs < ADVENT_MIN_DURATION_MS) return "Odgovor je prebrz (sumnja na automatizirani unos).";
  if (durationMs > ADVENT_MAX_START_AGE_MS) return "Pitanje je isteklo — otvori ponovo.";
  return null;
}

function validateAdventClientQuestionStart(clientStartedMs, serverAnchorMs, submittedAtMs) {
  if (!Number.isFinite(clientStartedMs)) return null;
  if (!Number.isFinite(serverAnchorMs)) return "Nedostaje referentno vrijeme pitanja.";
  if (clientStartedMs < serverAnchorMs - ADVENT_CLIENT_CLOCK_SKEW_MS) {
    return "Nevaljano vrijeme početka pitanja.";
  }
  if (clientStartedMs > submittedAtMs + ADVENT_CLIENT_CLOCK_SKEW_MS) {
    return "Nevaljano vrijeme početka pitanja.";
  }
  return null;
}

function getPublicScoring() {
  const config = loadScoringConfig();
  return {
    version: config.version,
    timeBands: config.timeBands,
    defaultTimeLimitSec: config.defaultTimeLimitSec,
    easyQuestionIndex: config.easyQuestionIndex,
    easyTimeLimitSec: config.easyTimeLimitSec,
    distance: {
      fullPointsWithinKm: config.distance.fullPointsWithinKm,
      zeroBeyondPercent: config.distance.zeroBeyondPercent,
    },
  };
}

module.exports = {
  ADVENT_DURATION_CAP_MS,
  ADVENT_MIN_DURATION_MS,
  ADVENT_MAX_START_AGE_MS,
  ADVENT_CLIENT_CLOCK_SKEW_MS,
  ADVENT_QUESTIONS_PER_DAY: 10,
  capAdventDurationMs,
  computeAdventDayScore,
  validateAdventSubmitTiming,
  validateAdventClientQuestionStart,
  loadScoringConfig,
  reloadScoringConfig,
  resolveTimeLimitSec,
  getPublicScoring,
};
