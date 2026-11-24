"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "src", "data", "advent-league");
const SEASON_PATH = path.join(DATA_DIR, "season.json");
const DAYS_PATH = path.join(DATA_DIR, "advent-days.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadAdventSeasonForAdmin() {
  ensureDataDir();
  if (!fs.existsSync(SEASON_PATH)) {
    return { year: new Date().getFullYear(), startDate: "", endDate: "", timezone: "Europe/Zagreb", scoringVersion: 1 };
  }
  return readJson(SEASON_PATH);
}

function loadAdventDaysForAdmin() {
  ensureDataDir();
  if (!fs.existsSync(DAYS_PATH)) {
    return { days: [] };
  }
  return readJson(DAYS_PATH);
}

function saveAdventSeason(season) {
  ensureDataDir();
  writeJson(SEASON_PATH, season);
}

function saveAdventDays(daysData) {
  ensureDataDir();
  writeJson(DAYS_PATH, daysData);
  try {
    const { reloadAdventLeagueData } = require("./adventLeagueData.cjs");
    reloadAdventLeagueData();
  } catch (err) {
    console.warn("[adventLeagueAdmin] reloadAdventLeagueData:", err?.message || err);
  }
}

function validateDayKey(dayKey) {
  if (!dayKey || typeof dayKey !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dayKey);
}

function validateQuestion(q) {
  if (!q || typeof q !== "object") return "Pitanje mora biti objekt.";
  if (typeof q.index !== "number" || q.index < 0 || q.index >= 10) return "Index mora biti 0-9.";
  if (!q.text || typeof q.text !== "string" || q.text.trim().length < 5) return "Tekst pitanja je obavezan (min 5 znakova).";
  if (!Array.isArray(q.options) || q.options.length !== 4) return "Pitanje mora imati točno 4 opcije.";
  for (let i = 0; i < q.options.length; i++) {
    const opt = q.options[i];
    if (!opt || typeof opt !== "object") return `Opcija ${i} mora biti objekt.`;
    if (!opt.id || typeof opt.id !== "string") return `Opcija ${i} mora imati id.`;
    if (!opt.text || typeof opt.text !== "string" || opt.text.trim().length < 1) return `Opcija ${i} mora imati text.`;
  }
  const optIds = q.options.map((o) => o.id);
  if (new Set(optIds).size !== 4) return "ID opcija moraju biti jedinstveni.";
  if (!q.correctAnswer || typeof q.correctAnswer !== "string") return "correctAnswer je obavezan.";
  if (!optIds.includes(q.correctAnswer)) return "correctAnswer mora biti jedan od ID-eva opcija.";
  if (q.category && typeof q.category !== "string") return "category mora biti string.";
  if (q.explanation && typeof q.explanation !== "string") return "explanation mora biti string.";
  if (q.difficulty != null && q.difficulty !== "") {
    const d = Number(q.difficulty);
    if (!Number.isFinite(d) || d < 1 || d > 5) return "difficulty mora biti broj 1–5.";
  }
  return null;
}

function getDayByKey(dayKey) {
  const data = loadAdventDaysForAdmin();
  return data.days.find((d) => d.dayKey === dayKey) || null;
}

function upsertDay(params) {
  const { dayKey, dayNumber, title, active } = params;
  if (!validateDayKey(dayKey)) throw new Error("Neispravan dayKey format (YYYY-MM-DD).");
  if (typeof dayNumber !== "number" || dayNumber < 1 || dayNumber > 24) {
    throw new Error("dayNumber mora biti 1-24.");
  }
  const data = loadAdventDaysForAdmin();
  let day = data.days.find((d) => d.dayKey === dayKey);
  const isNew = !day;
  if (isNew) {
    day = {
      dayKey,
      dayNumber,
      title: String(title || `Adventski dan ${dayNumber}`).trim(),
      active: Boolean(active),
      questions: [],
    };
    data.days.push(day);
  } else {
    day.dayNumber = dayNumber;
    day.title = String(title || day.title).trim();
    if (typeof active === "boolean") day.active = active;
  }
  data.days.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  saveAdventDays(data);
  return { day, created: isNew };
}

function upsertQuestion(dayKey, questionData) {
  const validationError = validateQuestion(questionData);
  if (validationError) throw new Error(validationError);
  const data = loadAdventDaysForAdmin();
  const day = data.days.find((d) => d.dayKey === dayKey);
  if (!day) throw new Error(`Dan ${dayKey} ne postoji — najprije kreiraj dan.`);
  const idx = day.questions.findIndex((q) => q.index === questionData.index);
  const isNew = idx === -1;
  if (isNew) {
    day.questions.push(questionData);
  } else {
    day.questions[idx] = questionData;
  }
  day.questions.sort((a, b) => a.index - b.index);
  saveAdventDays(data);
  return { question: questionData, created: isNew };
}

function deleteQuestion(dayKey, questionIndex) {
  const data = loadAdventDaysForAdmin();
  const day = data.days.find((d) => d.dayKey === dayKey);
  if (!day) throw new Error(`Dan ${dayKey} ne postoji.`);
  const before = day.questions.length;
  day.questions = day.questions.filter((q) => q.index !== questionIndex);
  const after = day.questions.length;
  if (before === after) throw new Error(`Pitanje s indexom ${questionIndex} nije pronađeno.`);
  saveAdventDays(data);
  return { deleted: before - after };
}

function listAllDays() {
  const data = loadAdventDaysForAdmin();
  return data.days.map((d) => ({
    dayKey: d.dayKey,
    dayNumber: d.dayNumber,
    title: d.title,
    active: d.active,
    questionCount: d.questions.length,
  }));
}

function previousDayKey(dayKey) {
  const d = new Date(`${String(dayKey)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function getLeagueStats(db, { todayKey } = {}) {
  const totalParticipantsRow = await db
    .prepare("SELECT COUNT(DISTINCT user_id) as c FROM advent_day_attempts")
    .get();
  const totalParticipants = Number(totalParticipantsRow?.c ?? 0);

  const completedAttemptsRow = await db
    .prepare("SELECT COUNT(*) as c FROM advent_day_attempts WHERE completed = 1")
    .get();
  const completedAttempts = Number(completedAttemptsRow?.c ?? 0);

  const avgCompletedRow = await db
    .prepare(`
      SELECT CAST(AVG(total_score) AS REAL) as avg_score
      FROM advent_day_attempts WHERE completed = 1
    `)
    .get();
  const avgCompletedScore = Math.round(Number(avgCompletedRow?.avg_score) || 0);

  const returningRow = await db
    .prepare(`
      SELECT COUNT(*) as c FROM (
        SELECT user_id FROM advent_day_attempts
        WHERE completed = 1
        GROUP BY user_id
        HAVING COUNT(DISTINCT day_key) >= 2
      )
    `)
    .get();
  const returningPlayers = Number(returningRow?.c ?? 0);

  const dailyStatsRows = await db
    .prepare(`
      SELECT 
        day_key,
        COUNT(DISTINCT user_id) as unique_players,
        COUNT(*) as attempts,
        SUM(completed) as completed,
        CAST(AVG(CASE WHEN completed = 1 THEN total_score END) AS REAL) as avg_score_completed
      FROM advent_day_attempts
      GROUP BY day_key
      ORDER BY day_key ASC
    `)
    .all();

  let todaySnapshot = null;
  if (todayKey) {
    const todayRow = dailyStatsRows.find((r) => r.day_key === todayKey);
    todaySnapshot = {
      dayKey: todayKey,
      uniquePlayers: Number(todayRow?.unique_players ?? 0),
      attempts: Number(todayRow?.attempts ?? 0),
      completed: Number(todayRow?.completed ?? 0),
      avgScoreCompleted: Math.round(Number(todayRow?.avg_score_completed) || 0),
    };
  }

  let nextDayReturn = null;
  const prevKey = todayKey ? previousDayKey(todayKey) : null;
  if (prevKey) {
    const prevCompleters = await db
      .prepare(
        "SELECT COUNT(DISTINCT user_id) as c FROM advent_day_attempts WHERE day_key = ? AND completed = 1",
      )
      .get(prevKey);
    const returned = await db
      .prepare(
        `
        SELECT COUNT(DISTINCT a1.user_id) as c
        FROM advent_day_attempts a1
        INNER JOIN advent_day_attempts a2 ON a1.user_id = a2.user_id
        WHERE a1.day_key = ? AND a1.completed = 1
          AND a2.day_key = ?
      `,
      )
      .get(prevKey, todayKey);
    const prevC = Number(prevCompleters?.c ?? 0);
    const retC = Number(returned?.c ?? 0);
    nextDayReturn = {
      previousDayKey: prevKey,
      todayDayKey: todayKey,
      previousDayCompleters: prevC,
      returnedPlayers: retC,
      returnRate: prevC > 0 ? Math.round((retC / prevC) * 1000) / 10 : null,
    };
  }

  return {
    totalParticipants,
    completedAttempts,
    avgCompletedScore,
    returningPlayers,
    todaySnapshot,
    nextDayReturn,
    dailyStats: dailyStatsRows.map((r) => ({
      dayKey: r.day_key,
      uniquePlayers: Number(r.unique_players),
      attempts: Number(r.attempts),
      completed: Number(r.completed),
      avgScore: Math.round(Number(r.avg_score_completed) || 0),
    })),
  };
}

module.exports = {
  loadAdventSeasonForAdmin,
  loadAdventDaysForAdmin,
  saveAdventSeason,
  saveAdventDays,
  validateDayKey,
  validateQuestion,
  getDayByKey,
  upsertDay,
  upsertQuestion,
  deleteQuestion,
  listAllDays,
  getLeagueStats,
};
