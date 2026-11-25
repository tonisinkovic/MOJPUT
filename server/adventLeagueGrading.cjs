"use strict";

const { computeAdventDayScore, loadScoringConfig, resolveTimeLimitSec } = require("./adventLeagueScoring.cjs");

const FILLER_WORDS = new Set([
  "godina",
  "godine",
  "godinu",
  "macka",
  "macke",
  "macki",
  "dana",
  "dan",
  "mjesec",
  "mjeseci",
  "mjeseca",
  "the",
  "red",
  "nosed",
  "reindeer",
]);

function questionTypeOf(question) {
  const raw = String(question?.type || "choice").toLowerCase();
  if (raw === "text" || raw === "open") return "text";
  if (raw === "distance" || raw === "estimate") return "distance";
  return "choice";
}

function foldAnswer(value) {
  return String(value || "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function textMatches(given, acceptedList) {
  const folded = foldAnswer(given);
  if (!folded || folded.length > 80) return false;
  const accepted = (Array.isArray(acceptedList) ? acceptedList : []).map(foldAnswer).filter(Boolean);
  if (accepted.includes(folded)) return true;
  for (const item of accepted) {
    if (!folded.startsWith(`${item} `)) continue;
    const rest = folded.slice(item.length + 1).split(" ").filter(Boolean);
    if (rest.length > 0 && rest.every((word) => FILLER_WORDS.has(word))) return true;
  }
  return false;
}

function parseKm(raw) {
  let s = String(raw || "")
    .toLowerCase()
    .replace(/kilometara|kilometra|kilometri|km/g, "")
    .trim()
    .replace(/\s+/g, "");
  if (!s) return NaN;
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && hasDot) {
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (hasComma || hasDot) {
    const sep = hasComma ? "," : ".";
    const parts = s.split(sep);
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length >= 1 && parts[0].length <= 3) {
      s = parts.join("");
    } else if (sep === ",") {
      s = s.replace(",", ".");
    }
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function scoreDistanceKm(guessRaw, correctKm, question) {
  const config = loadScoringConfig();
  const correct = Number(correctKm);
  const guess = parseKm(guessRaw);
  if (!Number.isFinite(correct) || correct <= 0 || !Number.isFinite(guess) || guess < 0) {
    return { score: 0, errorKm: null, correctKm: correct };
  }
  const error = Math.abs(guess - correct);
  const full = Number(question?.distanceFullPointsWithinKm ?? config.distance.fullPointsWithinKm);
  const percent = Number(question?.distanceZeroBeyondPercent ?? config.distance.zeroBeyondPercent);
  const zero = Math.max(full + 1, Math.round((correct * percent) / 100));
  if (error <= full) return { score: 100, errorKm: Math.round(error), correctKm: correct };
  if (error >= zero) return { score: 0, errorKm: Math.round(error), correctKm: correct };
  const ratio = (error - full) / (zero - full);
  const score = Math.max(0, Math.min(100, Math.round(100 * (1 - ratio))));
  return { score, errorKm: Math.round(error), correctKm: correct };
}

function gradeAdventAnswer(question, rawAnswer, durationMs, { expired = false } = {}) {
  const limitSec = resolveTimeLimitSec(question);
  if (expired || durationMs > limitSec * 1000) {
    return {
      correct: false,
      score: 0,
      breakdown: { baseScore: 0, timeBonus: 0, totalScore: 0 },
      timedOut: true,
      detail: null,
    };
  }

  const type = questionTypeOf(question);
  if (type === "distance") {
    const scored = scoreDistanceKm(rawAnswer, question?.distanceKm, question);
    const correct = scored.score === 100;
    const detail =
      scored.score > 0
        ? `Zračna udaljenost je ${Math.round(scored.correctKm)} km. Odstupanje: ${scored.errorKm} km.`
        : "Odgovor je izvan prihvatljive granice.";
    return {
      correct,
      score: scored.score,
      breakdown: { baseScore: scored.score, timeBonus: 0, totalScore: scored.score },
      timedOut: false,
      detail,
    };
  }

  const correct =
    type === "text"
      ? textMatches(rawAnswer, question?.acceptedAnswers)
      : foldAnswer(rawAnswer) === foldAnswer(question?.correctAnswer);
  const breakdown = computeAdventDayScore({ correct, durationMs, timeLimitSec: limitSec });
  return { correct, score: breakdown.totalScore, breakdown, timedOut: false, detail: null };
}

module.exports = {
  questionTypeOf,
  foldAnswer,
  textMatches,
  parseKm,
  scoreDistanceKm,
  gradeAdventAnswer,
};
