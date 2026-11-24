const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const {
  validateDayAttemptAccess,
  createDayAttempt,
  saveQuestionAnswer,
  updateDayAttemptProgress,
  completeDayAttempt,
  getDayAttemptDetails,
  getUserAdventProgress,
  getAdventLeaderboard,
  sanitizeQuestionForClient,
  validateQuestionAnswer,
} = require("./adventLeagueDb.cjs");

function createTestDb() {
  const raw = new Database(":memory:");
  raw.pragma("journal_mode = WAL");
  raw.pragma("foreign_keys = ON");

  raw.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS advent_day_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      questions_answered INTEGER NOT NULL DEFAULT 0,
      questions_correct INTEGER NOT NULL DEFAULT 0,
      total_duration_ms INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL,
      submitted_at TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, day_key),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS advent_question_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      question_index INTEGER NOT NULL,
      selected_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      score INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      answered_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(attempt_id, question_index),
      FOREIGN KEY (attempt_id) REFERENCES advent_day_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  return {
    prepare(sql) {
      return {
        get: (...params) => raw.prepare(sql).get(...params),
        all: (...params) => raw.prepare(sql).all(...params),
        run: (...params) => raw.prepare(sql).run(...params),
      };
    },
    _raw: raw,
  };
}

describe("adventLeagueDb", () => {
  let db;
  let testUserId;

  before(() => {
    db = createTestDb();
    const userInfo = db
      .prepare("INSERT INTO users (username, email, password_hash, email_verified) VALUES (?, ?, ?, 1)")
      .run("testuser", "test@test.com", "hash123");
    testUserId = userInfo.lastInsertRowid;
  });

  after(() => {
    db._raw.close();
  });

  it("validateDayAttemptAccess - no attempt", async () => {
    const result = await validateDayAttemptAccess(db, testUserId, "2026-12-01");
    assert.equal(result.exists, false);
    assert.equal(result.completed, false);
  });

  it("createDayAttempt", async () => {
    const attempt = await createDayAttempt(db, testUserId, "2026-12-01", "2026-12-01T10:00:00Z");
    assert.ok(attempt.id > 0);
    assert.equal(attempt.dayKey, "2026-12-01");
  });

  it("validateDayAttemptAccess - exists but not completed", async () => {
    const result = await validateDayAttemptAccess(db, testUserId, "2026-12-01");
    assert.equal(result.exists, true);
    assert.equal(result.completed, false);
  });

  it("saveQuestionAnswer", async () => {
    const attempt = db
      .prepare("SELECT id FROM advent_day_attempts WHERE user_id = ? AND day_key = ?")
      .get(testUserId, "2026-12-01");

    const ans = await saveQuestionAnswer(db, {
      attemptId: attempt.id,
      userId: testUserId,
      dayKey: "2026-12-01",
      questionIndex: 0,
      selectedAnswer: "a",
      isCorrect: true,
      score: 150,
      durationMs: 5000,
    });

    assert.equal(ans.isCorrect, true);
    assert.equal(ans.score, 150);
  });

  it("saveQuestionAnswer - duplicate throws", async () => {
    const attempt = db
      .prepare("SELECT id FROM advent_day_attempts WHERE user_id = ? AND day_key = ?")
      .get(testUserId, "2026-12-01");

    await assert.rejects(() =>
      saveQuestionAnswer(db, {
        attemptId: attempt.id,
        userId: testUserId,
        dayKey: "2026-12-01",
        questionIndex: 0,
        selectedAnswer: "b",
        isCorrect: false,
        score: 0,
        durationMs: 3000,
      }),
    );
  });

  it("updateDayAttemptProgress", async () => {
    const attempt = db
      .prepare("SELECT id FROM advent_day_attempts WHERE user_id = ? AND day_key = ?")
      .get(testUserId, "2026-12-01");

    const progress = await updateDayAttemptProgress(db, attempt.id);
    assert.equal(progress.answered, 1);
    assert.equal(progress.correct, 1);
    assert.equal(progress.totalScore, 150);
  });

  it("completeDayAttempt", async () => {
    const attempt = db
      .prepare("SELECT id FROM advent_day_attempts WHERE user_id = ? AND day_key = ?")
      .get(testUserId, "2026-12-01");

    const final = await completeDayAttempt(db, attempt.id, "2026-12-01T10:05:00Z");
    assert.equal(final.answered, 1);

    const check = await validateDayAttemptAccess(db, testUserId, "2026-12-01");
    assert.equal(check.completed, true);
  });

  it("getDayAttemptDetails", async () => {
    const attempt = db
      .prepare("SELECT id FROM advent_day_attempts WHERE user_id = ? AND day_key = ?")
      .get(testUserId, "2026-12-01");

    const details = await getDayAttemptDetails(db, attempt.id);
    assert.equal(details.completed, true);
    assert.equal(details.answers.length, 1);
    assert.equal(details.answers[0].is_correct, true);
  });

  it("getUserAdventProgress", async () => {
    const progress = await getUserAdventProgress(db, testUserId);
    assert.equal(progress.daysPlayed, 1);
    assert.equal(progress.totalScore, 150);
  });

  it("getAdventLeaderboard", async () => {
    const lb = await getAdventLeaderboard(db, 10);
    assert.equal(lb.length, 1);
    assert.equal(lb[0].username, "testuser");
    assert.equal(lb[0].totalScore, 150);
  });

  it("sanitizeQuestionForClient removes secret fields", () => {
    const q = {
      text: "Test?",
      options: [],
      correctAnswer: "a",
      explanation: "Secret!",
    };
    const safe = sanitizeQuestionForClient(q);
    assert.ok(!safe.correctAnswer);
    assert.ok(!safe.explanation);
    assert.equal(safe.text, "Test?");
  });

  it("validateQuestionAnswer", () => {
    const q = { correctAnswer: "b" };
    assert.equal(validateQuestionAnswer(q, "b"), true);
    assert.equal(validateQuestionAnswer(q, "B"), true);
    assert.equal(validateQuestionAnswer(q, "a"), false);
  });
});