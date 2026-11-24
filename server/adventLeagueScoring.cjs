"use strict";

const ADVENT_DURATION_CAP_MS = 120_000;
const ADVENT_MIN_DURATION_MS = 500;
const ADVENT_MAX_START_AGE_MS = 15 * 60 * 1000;
const ADVENT_CLIENT_CLOCK_SKEW_MS = 5_000;

function capAdventDurationMs(durationMs) {
  if (!Number.isFinite(durationMs)) return ADVENT_DURATION_CAP_MS;
  if (durationMs < 0) return 0;
  return Math.min(durationMs, ADVENT_DURATION_CAP_MS);
}

/**
 * Bodovanje za jedno pitanje advent kviza.
 * 
 * PRAVILA (deterministička):
 * - Netočan odgovor: 0 bodova (brzina ne utječe)
 * - Točan odgovor: 70-100 bodova ovisno o brzini
 * 
 * ZNANJE je primarno (garantiranih 70 bodova za točan odgovor),
 * BRZINA je sekundarna (do +30 bodova za vrlo brz odgovor).
 * 
 * Vremenska ljestvica (linearna interpolacija između točaka):
 *   ≤ 5s   → 100 bodova (instant recall)
 *   ≤ 15s  → 95 bodova  (vrlo brzo)
 *   ≤ 30s  → 85 bodova  (prosječno)
 *   ≤ 60s  → 75 bodova  (sporije, ali znanje je tu)
 *   > 60s  → 70 bodova  (bazni minimum za točan odgovor)
 * 
 * @returns {Object} { baseScore: 70-100 za točan ili 0, timeBonus: uvijek 0 (uračunato u base), totalScore }
 */
function computeAdventDayScore({ correct, durationMs }) {
  if (!correct) {
    return { baseScore: 0, timeBonus: 0, totalScore: 0 };
  }

  const capped = capAdventDurationMs(durationMs);
  const durationSec = capped / 1000;

  let score;
  if (durationSec <= 5) {
    score = 100;
  } else if (durationSec <= 15) {
    // Linearna interpolacija 100 → 95 za 5s → 15s
    score = 100 - ((durationSec - 5) / 10) * 5;
  } else if (durationSec <= 30) {
    // Linearna interpolacija 95 → 85 za 15s → 30s
    score = 95 - ((durationSec - 15) / 15) * 10;
  } else if (durationSec <= 60) {
    // Linearna interpolacija 85 → 75 za 30s → 60s
    score = 85 - ((durationSec - 30) / 30) * 10;
  } else {
    // > 60s → bazni minimum
    score = 70;
  }

  // Zaokruži na cijeli broj
  score = Math.round(score);

  return {
    baseScore: score,
    timeBonus: 0, // Već uračunato u baseScore
    totalScore: score,
  };
}

function validateAdventSubmitTiming(startedAtMs, submittedAtMs) {
  const durationMs = submittedAtMs - startedAtMs;
  if (startedAtMs > submittedAtMs) return "Nevaljano vrijeme početka.";
  if (durationMs < ADVENT_MIN_DURATION_MS) return "Odgovor je prebrz (sumnja na automatizirani unos).";
  if (durationMs > ADVENT_MAX_START_AGE_MS) return "Pitanje je isteklo — otvori ponovo.";
  return null;
}

/** Odbija očito lažno klijentsko questionStartedAt (bonus manipulacija). */
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
};