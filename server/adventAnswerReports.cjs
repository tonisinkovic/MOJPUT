"use strict";

const { getFullQuestion } = require("./adventLeagueData.cjs");
const { correctAnswerText, questionTypeOf } = require("./adventLeagueGrading.cjs");
const { computeAdventDayScore, resolveTimeLimitSec } = require("./adventLeagueScoring.cjs");
const { correctAdventAnswer, rememberTextAnswer } = require("./adventLeagueAdmin.cjs");

function isMissingTableError(err) {
  const msg = String(err?.message || err || "").toLowerCase();
  return msg.includes("no such table") || msg.includes("does not exist") || msg.includes("undefined table");
}

function fail(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function displaySelectedAnswer(question, raw) {
  const value = String(raw || "").trim();
  if (!value) return "Bez odgovora";
  if (questionTypeOf(question) === "choice") {
    const option = (Array.isArray(question?.options) ? question.options : []).find(
      (item) => String(item?.id || "").toLowerCase() === value.toLowerCase(),
    );
    return option?.text ? String(option.text) : value;
  }
  return value;
}

function pointsIfRecognized(question, durationMs) {
  if (!question) return 0;
  if (questionTypeOf(question) === "distance") return 100;
  const scored = computeAdventDayScore({
    correct: true,
    durationMs: Number(durationMs) || 0,
    timeLimitSec: resolveTimeLimitSec(question),
  });
  return scored.totalScore;
}

async function reportStatusByAnswerIds(db, answerIds) {
  const ids = [...new Set(answerIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
  if (!ids.length) return new Map();
  const placeholders = ids.map(() => "?").join(", ");
  try {
    const rows = await db
      .prepare(`SELECT answer_id, status FROM advent_answer_reports WHERE answer_id IN (${placeholders})`)
      .all(...ids);
    return new Map((rows || []).map((row) => [Number(row.answer_id), String(row.status || "open")]));
  } catch (err) {
    if (isMissingTableError(err)) return new Map();
    throw err;
  }
}

async function buildAttemptReview(db, dayKey, answers) {
  const list = Array.isArray(answers) ? answers : [];
  const statuses = await reportStatusByAnswerIds(
    db,
    list.map((answer) => answer.id),
  );
  return list.map((answer) => {
    const question = getFullQuestion(dayKey, answer.question_index);
    const answerId = Number(answer.id) || 0;
    return {
      answerId,
      questionIndex: Number(answer.question_index),
      questionText: question?.text || "",
      selectedAnswer: displaySelectedAnswer(question, answer.selected_answer),
      correct: Boolean(answer.is_correct),
      score: Number(answer.score) || 0,
      durationMs: Number(answer.duration_ms) || 0,
      correctAnswerLabel: correctAnswerText(question) || "",
      reportStatus: statuses.get(answerId) || null,
    };
  });
}

async function createAnswerReport(db, userId, answerId) {
  const id = Number(answerId);
  if (!Number.isInteger(id) || id <= 0) throw fail(400, "Nevaljan odgovor.");
  const answer = await db
    .prepare(
      `
      SELECT q.id, q.attempt_id, q.user_id, q.day_key, q.question_index, q.selected_answer, q.is_correct, a.completed
      FROM advent_question_answers q
      INNER JOIN advent_day_attempts a ON a.id = q.attempt_id
      WHERE q.id = ?
    `,
    )
    .get(id);
  if (!answer || Number(answer.user_id) !== Number(userId)) throw fail(404, "Odgovor nije pronađen.");
  if (!answer.completed) throw fail(400, "Prijavu možeš poslati tek kad završiš kviz.");
  if (answer.is_correct) throw fail(400, "Točan odgovor nije potrebno prijaviti.");

  const existing = await db.prepare("SELECT id, status FROM advent_answer_reports WHERE answer_id = ?").get(id);
  if (existing) return { id: Number(existing.id), status: String(existing.status || "open"), created: false };

  const info = await db
    .prepare(
      `
      INSERT INTO advent_answer_reports
        (answer_id, attempt_id, user_id, day_key, question_index, selected_answer, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'open', ?)
    `,
    )
    .run(
      id,
      answer.attempt_id,
      answer.user_id,
      answer.day_key,
      answer.question_index,
      String(answer.selected_answer || ""),
      new Date().toISOString(),
    );
  return { id: Number(info.lastInsertRowid) || 0, status: "open", created: true };
}

function mapReportRow(row) {
  const question = getFullQuestion(row.day_key, row.question_index);
  const awardScore = pointsIfRecognized(question, row.duration_ms);
  return {
    id: Number(row.id),
    answerId: Number(row.answer_id),
    attemptId: Number(row.attempt_id),
    dayKey: row.day_key,
    questionIndex: Number(row.question_index),
    username: row.username,
    selectedAnswer: displaySelectedAnswer(question, row.selected_answer),
    questionText: question?.text || "",
    correctAnswerLabel: correctAnswerText(question) || "",
    status: String(row.status || "open"),
    createdAt: row.created_at || null,
    resolvedAt: row.resolved_at || null,
    durationMs: Number(row.duration_ms) || 0,
    currentScore: Number(row.score) || 0,
    awardScore,
  };
}

async function listAnswerReports(db) {
  const rows = await db
    .prepare(
      `
      SELECT r.id, r.answer_id, r.attempt_id, r.day_key, r.question_index, r.selected_answer, r.status, r.created_at, r.resolved_at,
             u.username, q.duration_ms, q.score
      FROM advent_answer_reports r
      INNER JOIN users u ON u.id = r.user_id
      INNER JOIN advent_question_answers q ON q.id = r.answer_id
      ORDER BY CASE r.status WHEN 'open' THEN 0 ELSE 1 END, r.created_at DESC
      LIMIT 100
    `,
    )
    .all();
  return (rows || []).map(mapReportRow);
}

async function loadOpenReport(db, reportId) {
  const id = Number(reportId);
  if (!Number.isInteger(id) || id <= 0) throw fail(400, "Nevaljana prijava.");
  const report = await db
    .prepare(
      `
      SELECT r.id, r.answer_id, r.status, q.day_key, q.question_index, q.selected_answer, q.duration_ms
      FROM advent_answer_reports r
      INNER JOIN advent_question_answers q ON q.id = r.answer_id
      WHERE r.id = ?
    `,
    )
    .get(id);
  if (!report) throw fail(404, "Prijava nije pronađena.");
  if (report.status !== "open") throw fail(400, "Prijava je već riješena.");
  return report;
}

async function acceptAnswerReport(db, reportId, { remember = true } = {}) {
  const report = await loadOpenReport(db, reportId);
  const question = getFullQuestion(report.day_key, report.question_index);
  const score = pointsIfRecognized(question, report.duration_ms);
  await correctAdventAnswer(db, report.answer_id, { score, isCorrect: true });
  const remembered = remember ? rememberTextAnswer(report.day_key, report.question_index, report.selected_answer) : { added: false };
  await db.prepare("UPDATE advent_answer_reports SET status = 'accepted', resolved_at = ? WHERE id = ?").run(new Date().toISOString(), report.id);
  return {
    id: Number(report.id),
    status: "accepted",
    score,
    remembered: Boolean(remembered.added),
  };
}

async function rejectAnswerReport(db, reportId) {
  const report = await loadOpenReport(db, reportId);
  await db.prepare("UPDATE advent_answer_reports SET status = 'rejected', resolved_at = ? WHERE id = ?").run(new Date().toISOString(), report.id);
  return { id: Number(report.id), status: "rejected" };
}

module.exports = {
  pointsIfRecognized,
  buildAttemptReview,
  createAnswerReport,
  listAnswerReports,
  acceptAnswerReport,
  rejectAnswerReport,
};
