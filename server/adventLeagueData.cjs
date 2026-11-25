"use strict";

const fs = require("fs");
const path = require("path");
const { questionTypeOf } = require("./adventLeagueGrading.cjs");
const { resolveTimeLimitSec } = require("./adventLeagueScoring.cjs");

const DATA_DIR = path.join(__dirname, "..", "src", "data", "advent-league");
const SEASON_PATH = path.join(DATA_DIR, "season.json");
const DAYS_PATH = path.join(DATA_DIR, "advent-days.json");

let cachedSeason = null;
let cachedDaysByKey = null;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadAdventSeason() {
  if (!cachedSeason) cachedSeason = readJson(SEASON_PATH);
  return cachedSeason;
}

function loadAdventDaysByKey() {
  if (!cachedDaysByKey) {
    const raw = readJson(DAYS_PATH);
    const map = new Map();
    for (const day of raw.days || []) {
      map.set(day.dayKey, day);
    }
    cachedDaysByKey = map;
  }
  return cachedDaysByKey;
}

function reloadAdventLeagueData() {
  cachedSeason = null;
  cachedDaysByKey = null;
  return { season: loadAdventSeason(), days: loadAdventDaysByKey() };
}

const {
  isDayKeyQuizDay,
  isDayKeyInCalendar,
  listQuizDayKeys,
  countQuizDays,
  getQuizEndDate,
  getCalendarEndDate,
} = require("./adventSeason.cjs");

/** Kviz se može igrati samo na danima s pitanjima (ne uključuje npr. 25.12.). */
function isDayKeyInSeason(dayKey) {
  return isDayKeyQuizDay(dayKey);
}

function resolveTodayDayKey(getChatDayKey) {
  const dev = String(process.env.ADVENT_DEV_TODAY_KEY || "").trim();
  if (dev && process.env.NODE_ENV === "production") {
    console.warn("[advent] ADVENT_DEV_TODAY_KEY je ignoriran u produkciji.");
  }
  if (dev && process.env.NODE_ENV !== "production") return dev;
  return getChatDayKey();
}

function getDayPackage(dayKey) {
  const days = loadAdventDaysByKey();
  return days.get(dayKey) || null;
}

function mapQuestionClientShape(q) {
  const type = questionTypeOf(q);
  return {
    index: q.index,
    questionText: q.text,
    type,
    timeLimitSec: resolveTimeLimitSec(q),
    category: q.category || null,
    options: type === "choice" && Array.isArray(q.options) ? q.options : [],
    unit: type === "distance" ? "km" : null,
  };
}

function getSanitizedDayQuestions(dayKey) {
  const day = getDayPackage(dayKey);
  if (!day) return null;
  return day.questions.map(mapQuestionClientShape);
}

function getFullQuestion(dayKey, questionIndex) {
  const day = getDayPackage(dayKey);
  if (!day) return null;
  return day.questions.find((q) => q.index === questionIndex) || null;
}

module.exports = {
  DATA_DIR,
  ADVENT_QUESTIONS_PER_DAY: 10,
  loadAdventSeason,
  loadAdventDaysByKey,
  reloadAdventLeagueData,
  isDayKeyInSeason,
  isDayKeyInCalendar,
  listQuizDayKeys,
  countQuizDays,
  getQuizEndDate,
  getCalendarEndDate,
  resolveTodayDayKey,
  getDayPackage,
  getSanitizedDayQuestions,
  getFullQuestion,
  mapQuestionClientShape,
};