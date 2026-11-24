"use strict";

const { computeAdventDayScore } = require("./adventLeagueScoring.cjs");

async function qGet(db, sql, ...params) {
  return db.prepare(sql).get(...params);
}

async function qAll(db, sql, ...params) {
  return db.prepare(sql).all(...params);
}

async function qRun(db, sql, ...params) {
  return db.prepare(sql).run(...params);
}

function extractInsertId(info) {
  if (!info) return 0;
  return Number(info.lastInsertRowid ?? info.id ?? 0) || 0;
}

async function validateDayAttemptAccess(db, userId, dayKey) {
  const row = await qGet(
    db,
    "SELECT id, completed FROM advent_day_attempts WHERE user_id = ? AND day_key = ?",
    userId,
    dayKey,
  );

  if (!row) return { exists: false, attemptId: null, completed: false };
  return { exists: true, attemptId: row.id, completed: Boolean(row.completed) };
}

async function getAttemptForUser(db, attemptId, userId) {
  const row = await qGet(
    db,
    "SELECT id, user_id, day_key, completed, questions_answered FROM advent_day_attempts WHERE id = ?",
    attemptId,
  );
  if (!row || Number(row.user_id) !== Number(userId)) return null;
  return {
    ...row,
    completed: Boolean(row.completed),
    questions_answered: Number(row.questions_answered) || 0,
  };
}

function isUniqueConstraintError(err) {
  const msg = String(err?.message || err || "").toLowerCase();
  const code = String(err?.code || "");
  return code === "SQLITE_CONSTRAINT" || code === "23505" || msg.includes("unique constraint") || msg.includes("unique");
}

async function createDayAttempt(db, userId, dayKey, startedAt = new Date().toISOString()) {
  const info = await qRun(
    db,
    `
      INSERT INTO advent_day_attempts (user_id, day_key, started_at, completed)
      VALUES (?, ?, ?, 0)
    `,
    userId,
    dayKey,
    startedAt,
  );

  return { id: extractInsertId(info), userId, dayKey, startedAt };
}

async function getOrCreateDayAttempt(db, userId, dayKey) {
  const access = await validateDayAttemptAccess(db, userId, dayKey);
  if (access.exists) return { id: access.attemptId, created: false };
  try {
    const created = await createDayAttempt(db, userId, dayKey);
    return { id: created.id, created: true };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      const again = await validateDayAttemptAccess(db, userId, dayKey);
      if (again.exists) return { id: again.attemptId, created: false };
    }
    throw err;
  }
}

/** Server-side sidro za mjerenje trajanja odgovora (pitanje 0 = početak pokušaja, inače prethodni answered_at). */
async function getQuestionTimingAnchorMs(db, attemptId, questionIndex) {
  const attempt = await qGet(db, "SELECT started_at FROM advent_day_attempts WHERE id = ?", attemptId);
  if (!attempt?.started_at) return NaN;
  const attemptMs = Date.parse(attempt.started_at);
  if (!Number.isInteger(questionIndex) || questionIndex < 0) return NaN;
  if (questionIndex === 0) return attemptMs;
  const prev = await qGet(
    db,
    "SELECT answered_at FROM advent_question_answers WHERE attempt_id = ? AND question_index = ?",
    attemptId,
    questionIndex - 1,
  );
  if (!prev?.answered_at) return NaN;
  const prevMs = Date.parse(prev.answered_at);
  return Number.isFinite(prevMs) ? prevMs : NaN;
}

async function saveQuestionAnswer(db, params) {
  if (!params || typeof params !== "object") {
    throw new Error(`saveQuestionAnswer requires params object, got: ${typeof params}`);
  }

  const { attemptId, userId, dayKey, questionIndex, selectedAnswer, isCorrect, score, durationMs } = params;

  const existing = await qGet(
    db,
    "SELECT id FROM advent_question_answers WHERE attempt_id = ? AND question_index = ?",
    attemptId,
    questionIndex,
  );

  if (existing) {
    const err = new Error(`Question ${questionIndex} already answered for this attempt.`);
    err.code = "DUPLICATE_ANSWER";
    throw err;
  }

  const answeredAt = new Date().toISOString();

  let info;
  try {
    info = await qRun(
      db,
      `
      INSERT INTO advent_question_answers 
        (attempt_id, user_id, day_key, question_index, selected_answer, is_correct, score, duration_ms, answered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      attemptId,
      userId,
      dayKey,
      questionIndex,
      selectedAnswer,
      isCorrect ? 1 : 0,
      score,
      durationMs,
      answeredAt,
    );
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      const dup = new Error(`Question ${questionIndex} already answered for this attempt.`);
      dup.code = "DUPLICATE_ANSWER";
      throw dup;
    }
    throw err;
  }

  return { id: extractInsertId(info), isCorrect, score };
}

async function updateDayAttemptProgress(db, attemptId) {
  const answers = await qGet(
    db,
    `
      SELECT 
        COUNT(*) as answered,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
        SUM(score) as total_score,
        SUM(duration_ms) as total_duration
      FROM advent_question_answers
      WHERE attempt_id = ?
    `,
    attemptId,
  );

  await qRun(
    db,
    `
    UPDATE advent_day_attempts
    SET 
      questions_answered = ?,
      questions_correct = ?,
      total_score = ?,
      total_duration_ms = ?
    WHERE id = ?
  `,
    answers.answered || 0,
    answers.correct || 0,
    answers.total_score || 0,
    answers.total_duration || 0,
    attemptId,
  );

  return {
    answered: Number(answers.answered) || 0,
    correct: Number(answers.correct) || 0,
    totalScore: Number(answers.total_score) || 0,
    totalDuration: Number(answers.total_duration) || 0,
  };
}

async function completeDayAttempt(db, attemptId, submittedAt = new Date().toISOString()) {
  const result = await qRun(
    db,
    `
    UPDATE advent_day_attempts
    SET completed = 1, submitted_at = ?
    WHERE id = ? AND completed = 0
  `,
    submittedAt,
    attemptId,
  );

  if (!result || (result.changes != null && result.changes === 0)) {
    const err = new Error("Pokušaj je već završen.");
    err.code = "ALREADY_COMPLETED";
    throw err;
  }

  return updateDayAttemptProgress(db, attemptId);
}

async function getDayAttemptDetails(db, attemptId) {
  const attempt = await qGet(
    db,
    `
      SELECT 
        id, user_id, day_key, total_score, questions_answered, questions_correct,
        total_duration_ms, started_at, submitted_at, completed
      FROM advent_day_attempts
      WHERE id = ?
    `,
    attemptId,
  );

  if (!attempt) return null;

  const answers = await qAll(
    db,
    `
      SELECT 
        question_index, selected_answer, is_correct, score, duration_ms, answered_at
      FROM advent_question_answers
      WHERE attempt_id = ?
      ORDER BY question_index ASC
    `,
    attemptId,
  );

  return {
    ...attempt,
    completed: Boolean(attempt.completed),
    answers: answers.map((a) => ({
      ...a,
      is_correct: Boolean(a.is_correct),
    })),
  };
}

async function getUserAdventProgress(db, userId) {
  const attempts = await qAll(
    db,
    `
      SELECT day_key, total_score, questions_answered, questions_correct, completed, started_at, submitted_at
      FROM advent_day_attempts
      WHERE user_id = ?
      ORDER BY day_key ASC
    `,
    userId,
  );

  const completedOnly = attempts.filter((a) => a.completed);
  const totalScore = completedOnly.reduce((sum, a) => sum + (a.total_score || 0), 0);
  const daysPlayed = completedOnly.length;

  return {
    totalScore,
    daysPlayed,
    attempts: attempts.map((a) => ({
      ...a,
      completed: Boolean(a.completed),
    })),
  };
}

async function getAdventLeaderboard(db, limit = 50) {
  const { getAdventSeasonLeaderboard } = require("./adventLeagueLeaderboard.cjs");
  const page = await getAdventSeasonLeaderboard(db, limit, 0);
  return page.entries.map(({ rank, username, totalScore, daysPlayed }) => ({
    rank,
    username,
    totalScore,
    daysPlayed,
  }));
}

function sanitizeQuestionForClient(question) {
  if (!question) return null;
  const { correctAnswer, explanation, ...safe } = question;
  return safe;
}

function validateQuestionAnswer(question, selectedAnswer) {
  if (!question || !question.correctAnswer) {
    return false;
  }
  const correct =
    String(selectedAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
  return correct;
}

function computeQuestionScore(isCorrect, durationMs) {
  const result = computeAdventDayScore({ correct: isCorrect, durationMs });
  return result.totalScore;
}

function computeQuestionScoreBreakdown(isCorrect, durationMs) {
  return computeAdventDayScore({ correct: isCorrect, durationMs });
}

module.exports = {
  validateDayAttemptAccess,
  getAttemptForUser,
  createDayAttempt,
  getOrCreateDayAttempt,
  getQuestionTimingAnchorMs,
  isUniqueConstraintError,
  saveQuestionAnswer,
  updateDayAttemptProgress,
  completeDayAttempt,
  getDayAttemptDetails,
  getUserAdventProgress,
  getAdventLeaderboard,
  sanitizeQuestionForClient,
  validateQuestionAnswer,
  computeQuestionScore,
  computeQuestionScoreBreakdown,
};