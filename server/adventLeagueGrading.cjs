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

function formatKmHr(km) {
  const n = Math.round(Number(km));
  const body = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${n < 0 ? "-" : ""}${body} km`;
}

function distanceWindows(correct, question) {
  const config = loadScoringConfig();
  const minFull = Number(question?.distanceFullPointsWithinKm ?? config.distance.fullPointsWithinKm);
  const fullPercent = Number(question?.distanceFullPointsWithinPercent ?? config.distance.fullPointsWithinPercent ?? 20);
  const zeroPercent = Number(question?.distanceZeroBeyondPercent ?? config.distance.zeroBeyondPercent);
  const full = Math.max(minFull, Math.round((correct * fullPercent) / 100));
  const zero = Math.max(full + 1, Math.round((correct * zeroPercent) / 100));
  return { full, zero };
}

function scoreDistanceKm(guessRaw, correctKm, question) {
  const correct = Number(correctKm);
  const guess = parseKm(guessRaw);
  if (!Number.isFinite(correct) || correct <= 0 || !Number.isFinite(guess) || guess < 0) {
    return { score: 0, errorKm: null, correctKm: correct };
  }
  const error = Math.abs(guess - correct);
  const { full, zero } = distanceWindows(correct, question);
  if (error <= full) return { score: 100, errorKm: Math.round(error), correctKm: correct };
  if (error >= zero) return { score: 0, errorKm: Math.round(error), correctKm: correct };
  const ratio = (error - full) / (zero - full);
  const score = Math.max(0, Math.min(100, Math.round(100 * (1 - ratio))));
  return { score, errorKm: Math.round(error), correctKm: correct };
}

function editDistance(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) prev[j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    const curr = new Array(b.length + 1);
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > 2) return 3;
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j];
  }
  return prev[b.length];
}

function correctAnswerText(question) {
  const type = questionTypeOf(question);
  if (type === "distance") return formatKmHr(question?.distanceKm);
  if (type === "choice") {
    const id = foldAnswer(question?.correctAnswer);
    const opt = (Array.isArray(question?.options) ? question.options : []).find((item) => foldAnswer(item?.id) === id);
    return opt?.text ? String(opt.text) : "";
  }
  const first = Array.isArray(question?.acceptedAnswers) ? question.acceptedAnswers.find((item) => String(item || "").trim()) : "";
  return first ? String(first) : "";
}

function classifyTextNear(given, acceptedList) {
  const folded = foldAnswer(given);
  const originals = (Array.isArray(acceptedList) ? acceptedList : []).map((item) => String(item || "").trim()).filter(Boolean);
  if (!folded || folded.length > 80) return { kind: "wrong", label: originals[0] || "" };
  if (textMatches(given, originals)) return { kind: "exact", label: originals[0] || "" };

  if (folded.length >= 5) {
    for (const original of originals) {
      const item = foldAnswer(original);
      if (item.startsWith(folded) && item.length - folded.length === 1) {
        return { kind: "accept", label: original };
      }
    }
  }

  let best = null;
  if (folded.length >= 4) {
    for (const original of originals) {
      const item = foldAnswer(original);
      const distance = editDistance(folded, item);
      if (distance < 1 || distance > 2) continue;
      if (!best || distance < best.distance) best = { distance, label: original };
    }
  }
  if (best) return { kind: "suggest", label: best.label };
  return { kind: "wrong", label: originals[0] || "" };
}

function gradeAdventAnswer(question, rawAnswer, durationMs, { expired = false } = {}) {
  const limitSec = resolveTimeLimitSec(question);
  const type = questionTypeOf(question);
  const answerText = correctAnswerText(question);
  const timedOut = expired || durationMs > limitSec * 1000;

  if (type === "distance") {
    const scored = scoreDistanceKm(rawAnswer, question?.distanceKm, question);
    const correct = !timedOut && scored.score === 100;
    const score = timedOut ? 0 : scored.score;
    const deviation =
      scored.errorKm == null ? "" : ` Tvoje odstupanje je ${scored.errorKm} km.`;
    return {
      correct,
      score,
      breakdown: { baseScore: score, timeBonus: 0, totalScore: score },
      timedOut,
      detail: answerText ? `Točna zračna udaljenost je ${answerText}.${deviation}` : null,
      suggestion: null,
      correctAnswerLabel: correct ? null : answerText,
    };
  }

  const near = type === "text" ? classifyTextNear(rawAnswer, question?.acceptedAnswers) : null;
  const correct = !timedOut && (type === "text" ? near?.kind === "exact" || near?.kind === "accept" : foldAnswer(rawAnswer) === foldAnswer(question?.correctAnswer));
  const breakdown = correct ? computeAdventDayScore({ correct: true, durationMs, timeLimitSec: limitSec }) : { baseScore: 0, timeBonus: 0, totalScore: 0 };
  const suggestion = !correct && near?.kind === "suggest" && near.label ? `Mislite li ${near.label}?` : null;
  return {
    correct,
    score: breakdown.totalScore,
    breakdown,
    timedOut,
    detail: null,
    suggestion,
    correctAnswerLabel: correct ? null : answerText,
  };
}

module.exports = {
  questionTypeOf,
  foldAnswer,
  textMatches,
  parseKm,
  scoreDistanceKm,
  classifyTextNear,
  correctAnswerText,
  gradeAdventAnswer,
};
