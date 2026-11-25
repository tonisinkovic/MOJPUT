"use strict";

function loadAdventSeason() {
  return require("./adventLeagueData.cjs").loadAdventSeason();
}

function getCalendarStartDate(season = loadAdventSeason()) {
  return String(season.calendarStartDate || season.startDate || "").trim();
}

function getQuizStartDate(season = loadAdventSeason()) {
  return String(season.startDate || "").trim();
}

function getQuizEndDate(season = loadAdventSeason()) {
  return String(season.quizEndDate || season.endDate || "").trim();
}

function getChristmasDate(season = loadAdventSeason()) {
  if (season.christmasDate) return String(season.christmasDate).trim();
  const end = getQuizEndDate(season);
  if (!end) return "";
  const d = new Date(`${end}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getFinalResultsDate(season = loadAdventSeason()) {
  if (season.finalResultsDate) return String(season.finalResultsDate).trim();
  const xmas = getChristmasDate(season);
  if (!xmas) return "";
  const d = new Date(`${xmas}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getCalendarEndDate(season = loadAdventSeason()) {
  return String(season.endDate || "").trim();
}

function calendarDayOfMonth(dayKey) {
  return Number(String(dayKey || "").slice(8, 10)) || 0;
}

function isDayKeyQuizDay(dayKey, season = loadAdventSeason()) {
  const start = getQuizStartDate(season);
  const end = getQuizEndDate(season);
  if (!start || !end || !dayKey) return false;
  return dayKey >= start && dayKey <= end;
}

function isDayKeyInCalendar(dayKey, season = loadAdventSeason()) {
  const start = getCalendarStartDate(season);
  const end = getCalendarEndDate(season);
  if (!start || !end || !dayKey) return false;
  return dayKey >= start && dayKey <= end;
}

function isChristmasCalendarDay(dayKey, season = loadAdventSeason()) {
  return dayKey === getChristmasDate(season);
}

function isBadnjakCalendarDay(dayKey, season = loadAdventSeason()) {
  return dayKey === getQuizEndDate(season);
}

/** @deprecated koristi isChristmasCalendarDay */
function isFinaleCalendarDay(dayKey, season = loadAdventSeason()) {
  return isChristmasCalendarDay(dayKey, season);
}

function isPreSeasonCalendarDay(dayKey, season = loadAdventSeason()) {
  const calStart = getCalendarStartDate(season);
  const quizStart = getQuizStartDate(season);
  return dayKey >= calStart && dayKey < quizStart;
}

function isFinalListCalendarDay(dayKey, season = loadAdventSeason()) {
  return dayKey === getFinalResultsDate(season);
}

/** 27.–31. 12. — nakon objave liste */
function isAfterSeasonCalendarDay(dayKey, season = loadAdventSeason()) {
  const fin = getFinalResultsDate(season);
  const end = getCalendarEndDate(season);
  return dayKey > fin && dayKey <= end;
}

/** @deprecated */
function isPostChristmasCalendarDay(dayKey, season = loadAdventSeason()) {
  return isAfterSeasonCalendarDay(dayKey, season);
}

function listQuizDayKeys(season = loadAdventSeason()) {
  const keys = [];
  const start = getQuizStartDate(season);
  const end = getQuizEndDate(season);
  if (!start || !end || start > end) return keys;
  let cursor = start;
  while (cursor <= end) {
    keys.push(cursor);
    const d = new Date(`${cursor}T12:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return keys;
}

function listCalendarDayKeys(season = loadAdventSeason()) {
  const keys = [];
  const start = getCalendarStartDate(season);
  const end = getCalendarEndDate(season);
  if (!start || !end || start > end) return keys;
  let cursor = start;
  while (cursor <= end) {
    keys.push(cursor);
    const d = new Date(`${cursor}T12:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return keys;
}

function countQuizDays(season = loadAdventSeason()) {
  return listQuizDayKeys(season).length;
}

function isSeasonActiveDay(dayKey, season = loadAdventSeason()) {
  const start = getCalendarStartDate(season);
  const end = getCalendarEndDate(season);
  return dayKey >= start && dayKey <= end;
}

function isQuizOpenDay(dayKey, season = loadAdventSeason()) {
  return isDayKeyQuizDay(dayKey, season);
}

const TZ = () => String(loadAdventSeason().timezone || "Europe/Zagreb");

const FIRST_QUIZ_OPEN_HOUR = 10;

function getZagrebTimeParts(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    dayKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

function getZagrebLocalInstantMs(dayKey, hour = 0, minute = 0, second = 0) {
  const [y, m, d] = String(dayKey).split("-").map(Number);
  const guessUtc = Date.UTC(y, m - 1, d, hour - 1, minute, second);
  for (let delta = -5 * 3600_000; delta <= 5 * 3600_000; delta += 60_000) {
    const candidate = new Date(guessUtc + delta);
    const tp = getZagrebTimeParts(candidate);
    if (tp.dayKey === dayKey && tp.hour === hour && tp.minute === minute && tp.second === second) {
      return candidate.getTime();
    }
  }
  for (let delta = -5 * 3600_000; delta <= 5 * 3600_000; delta += 1000) {
    const candidate = new Date(guessUtc + delta);
    const tp = getZagrebTimeParts(candidate);
    if (tp.dayKey === dayKey && tp.hour === hour && tp.minute === minute && tp.second === second) {
      return candidate.getTime();
    }
  }
  return guessUtc;
}

/** 5. 12. u 10:00, ostali kviz dani u 00:00 (Zagreb). */
function getQuizDayUnlockMs(dayKey, season = loadAdventSeason()) {
  if (dayKey === getQuizStartDate(season)) {
    return getZagrebLocalInstantMs(dayKey, FIRST_QUIZ_OPEN_HOUR, 0, 0);
  }
  return getZagrebLocalInstantMs(dayKey, 0, 0, 0);
}

function isQuizDayUnlockedNow(dayKey, now = new Date(), season = loadAdventSeason()) {
  if (!isDayKeyQuizDay(dayKey, season)) return false;
  return now.getTime() >= getQuizDayUnlockMs(dayKey, season);
}

module.exports = {
  getCalendarStartDate,
  getQuizStartDate,
  getQuizEndDate,
  getChristmasDate,
  getFinalResultsDate,
  getCalendarEndDate,
  calendarDayOfMonth,
  isDayKeyQuizDay,
  isDayKeyInCalendar,
  isChristmasCalendarDay,
  isBadnjakCalendarDay,
  isFinaleCalendarDay,
  isPreSeasonCalendarDay,
  isFinalListCalendarDay,
  isAfterSeasonCalendarDay,
  isPostChristmasCalendarDay,
  listQuizDayKeys,
  listCalendarDayKeys,
  countQuizDays,
  isSeasonActiveDay,
  isQuizOpenDay,
  getQuizDayUnlockMs,
  isQuizDayUnlockedNow,
  getZagrebLocalInstantMs,
};