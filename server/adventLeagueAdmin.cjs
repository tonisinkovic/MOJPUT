"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "src", "data", "advent-league");
const SEASON_PATH = path.join(DATA_DIR, "season.json");
const DAYS_PATH = path.join(DATA_DIR, "advent-days.json");
const SCORING_PATH = path.join(DATA_DIR, "scoring.json");

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

function questionTypeOf(q) {
  const raw = String(q?.type || "choice").toLowerCase();
  if (raw === "text" || raw === "open") return "text";
  if (raw === "distance" || raw === "estimate") return "distance";
  return "choice";
}

function validateQuestion(q) {
  if (!q || typeof q !== "object") return "Pitanje mora biti objekt.";
  if (typeof q.index !== "number" || q.index < 0 || q.index >= 10) return "Index mora biti 0-9.";
  if (!q.text || typeof q.text !== "string" || q.text.trim().length < 5) return "Tekst pitanja je obavezan (min 5 znakova).";
  const type = questionTypeOf(q);
  const limit = q.timeLimitSec == null || q.timeLimitSec === "" ? (q.index === 5 ? 10 : 30) : Number(q.timeLimitSec);
  if (!Number.isFinite(limit) || limit < 5 || limit > 120) return "timeLimitSec mora biti 5–120.";
  if (q.category && typeof q.category !== "string") return "category mora biti string.";
  if (q.explanation && typeof q.explanation !== "string") return "explanation mora biti string.";
  if (q.difficulty != null && q.difficulty !== "") {
    const d = Number(q.difficulty);
    if (!Number.isFinite(d) || d < 1 || d > 5) return "difficulty mora biti broj 1–5.";
  }
  if (type === "choice") {
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
  } else if (type === "text") {
    const answers = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers.map((s) => String(s).trim()).filter(Boolean) : [];
    if (answers.length < 1) return "Potrebno je barem jedan točan odgovor.";
  } else if (type === "distance") {
    const km = Number(q.distanceKm);
    if (!Number.isFinite(km) || km <= 0) return "distanceKm mora biti pozitivan broj.";
  }
  return null;
}

function normalizeQuestion(q) {
  const validationError = validateQuestion(q);
  if (validationError) return { error: validationError };
  const type = questionTypeOf(q);
  const timeLimitSec = q.timeLimitSec == null || q.timeLimitSec === "" ? (q.index === 5 ? 10 : 30) : Number(q.timeLimitSec);
  const base = {
    index: q.index,
    type,
    text: String(q.text).trim(),
    category: q.category ? String(q.category).trim() : "",
    explanation: q.explanation ? String(q.explanation) : "",
    timeLimitSec,
  };
  if (q.difficulty != null && q.difficulty !== "") base.difficulty = Number(q.difficulty);
  if (type === "choice") {
    return {
      question: {
        ...base,
        options: q.options.map((opt) => ({ id: String(opt.id), text: String(opt.text).trim() })),
        correctAnswer: String(q.correctAnswer),
      },
    };
  }
  if (type === "text") {
    return {
      question: {
        ...base,
        options: [],
        acceptedAnswers: q.acceptedAnswers.map((s) => String(s).trim()).filter(Boolean),
      },
    };
  }
  return {
    question: {
      ...base,
      options: [],
      distanceKm: Number(q.distanceKm),
    },
  };
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
  const normalized = normalizeQuestion(questionData);
  if (normalized.error) throw new Error(normalized.error);
  questionData = normalized.question;
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

function loadScoringForAdmin() {
  if (!fs.existsSync(SCORING_PATH)) return null;
  return readJson(SCORING_PATH);
}

function saveScoringForAdmin(scoring) {
  if (!scoring || !Array.isArray(scoring.timeBands) || scoring.timeBands.length < 1) {
    throw new Error("timeBands su obavezni.");
  }
  for (const band of scoring.timeBands) {
    const maxSeconds = Number(band.maxSeconds);
    const points = Number(band.points);
    if (!Number.isFinite(maxSeconds) || maxSeconds <= 0 || maxSeconds > 120) throw new Error("maxSeconds mora biti 1–120.");
    if (!Number.isFinite(points) || points < 0 || points > 100) throw new Error("Bodovi pojasa moraju biti 0–100.");
  }
  const distance = scoring.distance || {};
  const full = Number(distance.fullPointsWithinKm);
  const percent = Number(distance.zeroBeyondPercent);
  if (!Number.isFinite(full) || full < 0 || full > 500) throw new Error("fullPointsWithinKm mora biti 0–500.");
  if (!Number.isFinite(percent) || percent <= 0 || percent > 100) throw new Error("zeroBeyondPercent mora biti 1–100.");
  const next = {
    version: Number(scoring.version) || 2,
    timeBands: scoring.timeBands.map((band) => ({
      maxSeconds: Number(band.maxSeconds),
      points: Number(band.points),
    })),
    defaultTimeLimitSec: Number(scoring.defaultTimeLimitSec) || 30,
    easyQuestionIndex: Number(scoring.easyQuestionIndex ?? 5),
    easyTimeLimitSec: Number(scoring.easyTimeLimitSec) || 10,
    submitGraceMs: Number(scoring.submitGraceMs) || 1500,
    minDurationMs: Number(scoring.minDurationMs) || 500,
    distance: { fullPointsWithinKm: full, zeroBeyondPercent: percent },
  };
  writeJson(SCORING_PATH, next);
  try {
    const { reloadScoringConfig } = require("./adventLeagueScoring.cjs");
    reloadScoringConfig();
  } catch (err) {
    console.warn("[adventLeagueAdmin] reloadScoringConfig:", err?.message || err);
  }
  return next;
}

async function listAdventResults(db, { dayKey } = {}) {
  const params = [];
  let where = "";
  if (dayKey) {
    where = "WHERE a.day_key = ?";
    params.push(dayKey);
  }
  const days = await db
    .prepare(
      `
      SELECT a.day_key, u.username, a.total_score, a.questions_correct, a.questions_answered, a.completed, a.submitted_at, a.id as attempt_id
      FROM advent_day_attempts a
      INNER JOIN users u ON u.id = a.user_id
      ${where}
      ORDER BY a.day_key ASC, a.total_score DESC, u.username ASC
    `,
    )
    .all(...params);

  const answerParams = [];
  let answerWhere = "";
  if (dayKey) {
    answerWhere = "WHERE q.day_key = ?";
    answerParams.push(dayKey);
  }
  const answers = await db
    .prepare(
      `
      SELECT q.id, q.attempt_id, q.day_key, q.question_index, q.selected_answer, q.is_correct, q.score, q.duration_ms, u.username
      FROM advent_question_answers q
      INNER JOIN users u ON u.id = q.user_id
      ${answerWhere}
      ORDER BY q.day_key ASC, u.username ASC, q.question_index ASC
    `,
    )
    .all(...answerParams);

  return {
    days: days.map((row) => ({
      attemptId: row.attempt_id,
      dayKey: row.day_key,
      username: row.username,
      totalScore: Number(row.total_score) || 0,
      questionsCorrect: Number(row.questions_correct) || 0,
      questionsAnswered: Number(row.questions_answered) || 0,
      completed: Boolean(row.completed),
      submittedAt: row.submitted_at || null,
    })),
    answers: answers.map((row) => ({
      id: row.id,
      attemptId: row.attempt_id,
      dayKey: row.day_key,
      questionIndex: Number(row.question_index),
      username: row.username,
      selectedAnswer: row.selected_answer,
      correct: Boolean(row.is_correct),
      score: Number(row.score) || 0,
      durationMs: Number(row.duration_ms) || 0,
    })),
  };
}

async function correctAdventAnswer(db, answerId, { score, isCorrect }) {
  const id = Number(answerId);
  const nextScore = Number(score);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Nevaljan id odgovora.");
  if (!Number.isFinite(nextScore) || nextScore < 0 || nextScore > 100) throw new Error("Bodovi moraju biti 0–100.");
  const row = await db.prepare("SELECT attempt_id FROM advent_question_answers WHERE id = ?").get(id);
  if (!row) throw new Error("Odgovor nije pronađen.");
  await db
    .prepare("UPDATE advent_question_answers SET score = ?, is_correct = ? WHERE id = ?")
    .run(Math.round(nextScore), isCorrect ? 1 : 0, id);
  const { updateDayAttemptProgress } = require("./adventLeagueDb.cjs");
  await updateDayAttemptProgress(db, row.attempt_id);
  return { id, attemptId: row.attempt_id, score: Math.round(nextScore), isCorrect: Boolean(isCorrect) };
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
  loadScoringForAdmin,
  saveScoringForAdmin,
  listAdventResults,
  correctAdventAnswer,
};
