"use strict";

const { loadAdventSeason } = require("./adventLeagueData.cjs");
const { listQuizDayKeys, isDayKeyQuizDay, isSeasonActiveDay } = require("./adventSeason.cjs");

async function qGet(db, sql, ...params) {
  return db.prepare(sql).get(...params);
}

async function qAll(db, sql, ...params) {
  return db.prepare(sql).all(...params);
}

function toZagrebDayKey(isoLike) {
  const t = Date.parse(String(isoLike || ""));
  if (!Number.isFinite(t)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(t));
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) return null;
  return `${y}-${m}-${d}`;
}

/** Prvi dan u ligi za korisnika (referral claim ili kreiranje računa). */
async function getUserLeagueJoinDayKey(db, userId) {
  const ref = await qGet(
    db,
    "SELECT created_at FROM advent_referral_signups WHERE referred_user_id = ?",
    userId,
  );
  const user = await qGet(db, "SELECT created_at FROM users WHERE id = ?", userId);
  const keys = [ref?.created_at, user?.created_at]
    .map(toZagrebDayKey)
    .filter(Boolean);
  if (!keys.length) return null;
  keys.sort();
  const season = loadAdventSeason();
  const start = String(season.startDate || "");
  const earliest = keys[0];
  return earliest < start ? start : earliest;
}

async function userHasReferralSignup(db, userId) {
  const row = await qGet(db, "SELECT id FROM advent_referral_signups WHERE referred_user_id = ?", userId);
  return Boolean(row);
}

async function getCompletedDayKeys(db, userId) {
  const rows = await qAll(
    db,
    "SELECT day_key FROM advent_day_attempts WHERE user_id = ? AND completed = 1",
    userId,
  );
  return new Set(rows.map((r) => String(r.day_key)));
}

/**
 * Jedan nadoknadni dan za korisnike došle preko referala — najraniji propušteni dan nakon prijave u ligu.
 */
async function getReferralCatchUpDayKey(db, userId, todayKey) {
  const referred = await userHasReferralSignup(db, userId);
  if (!referred) return null;
  if (!isSeasonActiveDay(todayKey)) return null;

  const joinDay = await getUserLeagueJoinDayKey(db, userId);
  if (!joinDay) return null;

  const completed = await getCompletedDayKeys(db, userId);
  const quizDays = listQuizDayKeys();

  for (const dayKey of quizDays) {
    if (dayKey >= todayKey) break;
    if (dayKey < joinDay) continue;
    if (!completed.has(dayKey)) return dayKey;
  }
  return null;
}

async function isDayKeyPlayableForUser(db, userId, dayKey, todayKey) {
  if (!isDayKeyQuizDay(dayKey)) return false;
  if (dayKey === todayKey && isDayKeyQuizDay(todayKey)) return true;
  const catchUp = await getReferralCatchUpDayKey(db, userId, todayKey);
  return catchUp === dayKey;
}

module.exports = {
  getUserLeagueJoinDayKey,
  userHasReferralSignup,
  getReferralCatchUpDayKey,
  isDayKeyPlayableForUser,
};