const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const {
  createAnswerReport,
  acceptAnswerReport,
  rejectAnswerReport,
  buildAttemptReview,
} = require("./adventAnswerReports.cjs");

function createDb() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    );
    CREATE TABLE advent_day_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      questions_answered INTEGER NOT NULL DEFAULT 0,
      questions_correct INTEGER NOT NULL DEFAULT 0,
      total_duration_ms INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL,
      submitted_at TEXT,
      completed INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE advent_question_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      question_index INTEGER NOT NULL,
      selected_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      score INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL
    );
    CREATE TABLE advent_answer_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      answer_id INTEGER NOT NULL UNIQUE,
      attempt_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      question_index INTEGER NOT NULL,
      selected_answer TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL,
      resolved_at TEXT
    );
  `);
  return db;
}

describe("adventAnswerReports", () => {
  it("prijava netočnog odgovora može se prihvatiti i donijeti bodove", async () => {
    const db = createDb();
    const user = db.prepare("INSERT INTO users (username, email) VALUES ('Ana', 'ana@test')").run();
    const attempt = db
      .prepare(
        "INSERT INTO advent_day_attempts (user_id, day_key, questions_answered, started_at, completed) VALUES (?, '2026-12-05', 10, '2026-12-05T10:00:00Z', 1)",
      )
      .run(user.lastInsertRowid);
    const answer = db
      .prepare(
        `INSERT INTO advent_question_answers
          (attempt_id, user_id, day_key, question_index, selected_answer, is_correct, score, duration_ms)
         VALUES (?, ?, '2026-12-05', 0, 'Kina', 0, 0, 2000)`,
      )
      .run(attempt.lastInsertRowid, user.lastInsertRowid);

    const created = await createAnswerReport(db, user.lastInsertRowid, answer.lastInsertRowid);
    assert.equal(created.status, "open");
    const again = await createAnswerReport(db, user.lastInsertRowid, answer.lastInsertRowid);
    assert.equal(again.created, false);

    const accepted = await acceptAnswerReport(db, created.id, { remember: false });
    assert.equal(accepted.status, "accepted");
    assert.equal(accepted.score, 100);
    assert.equal(accepted.remembered, false);

    const saved = db.prepare("SELECT is_correct, score FROM advent_question_answers WHERE id = ?").get(answer.lastInsertRowid);
    assert.equal(saved.is_correct, 1);
    assert.equal(saved.score, 100);
    const totals = db.prepare("SELECT total_score, questions_correct FROM advent_day_attempts WHERE id = ?").get(attempt.lastInsertRowid);
    assert.equal(totals.total_score, 100);
    assert.equal(totals.questions_correct, 1);

    const review = await buildAttemptReview(db, "2026-12-05", [
      {
        id: answer.lastInsertRowid,
        question_index: 0,
        selected_answer: "Kina",
        is_correct: 1,
        score: 100,
        duration_ms: 2000,
      },
    ]);
    assert.match(review[0].questionText, /stanovnika/);
    assert.equal(review[0].correctAnswerLabel, "Indija");
    assert.equal(review[0].reportStatus, "accepted");
  });

  it("odbija prijavu bez izmjene bodova", async () => {
    const db = createDb();
    const user = db.prepare("INSERT INTO users (username, email) VALUES ('Ivo', 'ivo@test')").run();
    const attempt = db
      .prepare(
        "INSERT INTO advent_day_attempts (user_id, day_key, started_at, completed) VALUES (?, '2026-12-05', '2026-12-05T10:00:00Z', 1)",
      )
      .run(user.lastInsertRowid);
    const answer = db
      .prepare(
        `INSERT INTO advent_question_answers
          (attempt_id, user_id, day_key, question_index, selected_answer, is_correct, score, duration_ms)
         VALUES (?, ?, '2026-12-05', 0, 'Kina', 0, 0, 8000)`,
      )
      .run(attempt.lastInsertRowid, user.lastInsertRowid);
    const created = await createAnswerReport(db, user.lastInsertRowid, answer.lastInsertRowid);
    const rejected = await rejectAnswerReport(db, created.id);
    assert.equal(rejected.status, "rejected");
    const saved = db.prepare("SELECT score, is_correct FROM advent_question_answers WHERE id = ?").get(answer.lastInsertRowid);
    assert.equal(saved.score, 0);
    assert.equal(saved.is_correct, 0);
  });
});
