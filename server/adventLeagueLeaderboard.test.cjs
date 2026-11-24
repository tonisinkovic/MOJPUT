const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const {
  getAdventSeasonLeaderboard,
  getAdventDailyLeaderboard,
  getAdventSeasonStandingForUser,
  clampPaging,
} = require("./adventLeagueLeaderboard.cjs");

function setupDb() {
  const raw = new Database(":memory:");
  raw.pragma("foreign_keys = ON");
  raw.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
    CREATE TABLE advent_day_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      questions_answered INTEGER NOT NULL DEFAULT 10,
      questions_correct INTEGER NOT NULL DEFAULT 0,
      total_duration_ms INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL,
      submitted_at TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, day_key),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX idx_advent_day_attempts_completed ON advent_day_attempts(completed, day_key);
    CREATE INDEX idx_advent_day_attempts_user_score ON advent_day_attempts(user_id, total_score);
  `);

  const users = [
    ["ana", "ana@test.com"],
    ["marko", "marko@test.com"],
    ["iva", "iva@test.com"],
    ["petar", "petar@test.com"],
  ];
  const ids = {};
  for (const [name, email] of users) {
    const info = raw
      .prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)")
      .run(name, email, "h");
    ids[name] = info.lastInsertRowid;
  }

  // Ana: 2 days, 900 total — rank 1 by score
  raw
    .prepare(
      "INSERT INTO advent_day_attempts (user_id, day_key, total_score, total_duration_ms, started_at, submitted_at, completed) VALUES (?, ?, ?, ?, ?, ?, 1)",
    )
    .run(ids.ana, "2026-12-01", 500, 1000, "2026-12-01T10:00:00Z", "2026-12-01T10:05:00Z");
  raw
    .prepare(
      "INSERT INTO advent_day_attempts (user_id, day_key, total_score, total_duration_ms, started_at, submitted_at, completed) VALUES (?, ?, ?, ?, ?, ?, 1)",
    )
    .run(ids.ana, "2026-12-02", 400, 1000, "2026-12-02T10:00:00Z", "2026-12-02T10:05:00Z");

  // Marko: same total 900 but fewer days? Actually 1 day 900 - tie score with different days
  raw
    .prepare(
      "INSERT INTO advent_day_attempts (user_id, day_key, total_score, total_duration_ms, started_at, submitted_at, completed) VALUES (?, ?, ?, ?, ?, ?, 1)",
    )
    .run(ids.marko, "2026-12-01", 900, 1000, "2026-12-01T11:00:00Z", "2026-12-01T11:05:00Z");

  // Iva: 900, 2 days like Ana — tie-break by last_submit
  raw
    .prepare(
      "INSERT INTO advent_day_attempts (user_id, day_key, total_score, total_duration_ms, started_at, submitted_at, completed) VALUES (?, ?, ?, ?, ?, ?, 1)",
    )
    .run(ids.iva, "2026-12-01", 450, 1000, "2026-12-01T10:00:00Z", "2026-12-01T10:05:00Z");
  raw
    .prepare(
      "INSERT INTO advent_day_attempts (user_id, day_key, total_score, total_duration_ms, started_at, submitted_at, completed) VALUES (?, ?, ?, ?, ?, ?, 1)",
    )
    .run(ids.iva, "2026-12-02", 450, 1000, "2026-12-02T10:00:00Z", "2026-12-02T20:00:00Z");

  // Petar: incomplete attempt — not on leaderboard
  raw
    .prepare(
      "INSERT INTO advent_day_attempts (user_id, day_key, total_score, total_duration_ms, started_at, completed) VALUES (?, ?, ?, ?, ?, 0)",
    )
    .run(ids.petar, "2026-12-01", 800, 1000, "2026-12-01T10:00:00Z");

  const db = {
    prepare(sql) {
      return {
        get: (...p) => raw.prepare(sql).get(...p),
        all: (...p) => raw.prepare(sql).all(...p),
        run: (...p) => raw.prepare(sql).run(...p),
      };
    },
  };

  return { db, ids, raw };
}

describe("adventLeagueLeaderboard", () => {
  let ctx;

  before(() => {
    ctx = setupDb();
  });

  it("clampPaging respects max", () => {
    assert.equal(clampPaging(100, 0).limit, 50);
    assert.equal(clampPaging(10, -5).offset, 0);
  });

  it("season leaderboard — sort by total score", async () => {
    const page = await getAdventSeasonLeaderboard(ctx.db, 10, 0);
    assert.equal(page.total, 3);
    assert.equal(page.entries[0].username, "ana");
    assert.equal(page.entries[0].totalScore, 900);
    assert.equal(page.entries[0].daysPlayed, 2);
  });

  it("season tie-break — more days_played wins at same score", async () => {
    const page = await getAdventSeasonLeaderboard(ctx.db, 10, 0);
    const ana = page.entries.find((e) => e.username === "ana");
    const marko = page.entries.find((e) => e.username === "marko");
    assert.ok(ana.rank < marko.rank);
    assert.equal(ana.totalScore, marko.totalScore);
  });

  it("pagination offset", async () => {
    const page = await getAdventSeasonLeaderboard(ctx.db, 1, 1);
    assert.equal(page.entries.length, 1);
    assert.equal(page.entries[0].rank, 2);
  });

  it("daily leaderboard for day 1", async () => {
    const page = await getAdventDailyLeaderboard(ctx.db, "2026-12-01", 10, 0);
    assert.equal(page.total, 3);
    assert.equal(page.entries[0].username, "marko");
    assert.equal(page.entries[0].totalScore, 900);
  });

  it("incomplete attempts excluded", async () => {
    const page = await getAdventDailyLeaderboard(ctx.db, "2026-12-01", 50, 0);
    assert.ok(!page.entries.some((e) => e.username === "petar"));
  });

  it("season rank for user", async () => {
    const ana = await getAdventSeasonStandingForUser(ctx.db, ctx.ids.ana);
    assert.equal(ana.rank, 1);
    assert.equal(ana.totalScore, 900);
  });
});