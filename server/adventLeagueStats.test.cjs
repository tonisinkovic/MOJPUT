const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const { getLeagueStats } = require("./adventLeagueAdmin.cjs");

function createTestDb() {
  const raw = new Database(":memory:");
  raw.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, email TEXT);
    CREATE TABLE advent_day_attempts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      day_key TEXT NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      questions_answered INTEGER DEFAULT 0
    );
  `);
  raw.prepare("INSERT INTO users (id, username, email) VALUES (1, 'a', 'a@t.com'), (2, 'b', 'b@t.com')").run();
  raw.prepare(
    "INSERT INTO advent_day_attempts (user_id, day_key, total_score, completed) VALUES (1, '2026-12-01', 900, 1)",
  ).run();
  raw.prepare(
    "INSERT INTO advent_day_attempts (user_id, day_key, total_score, completed) VALUES (1, '2026-12-02', 800, 1)",
  ).run();
  raw.prepare(
    "INSERT INTO advent_day_attempts (user_id, day_key, total_score, completed) VALUES (2, '2026-12-02', 500, 0)",
  ).run();

  return {
    prepare(sql) {
      return {
        get: (...p) => raw.prepare(sql).get(...p),
        all: (...p) => raw.prepare(sql).all(...p),
        run: (...p) => raw.prepare(sql).run(...p),
      };
    },
    _raw: raw,
  };
}

describe("getLeagueStats analytics fields", () => {
  let db;

  before(() => {
    db = createTestDb();
  });

  after(() => {
    db._raw.close();
  });

  it("returns avg, returning players, and next-day return", async () => {
    const stats = await getLeagueStats(db, { todayKey: "2026-12-02" });
    assert.equal(stats.totalParticipants, 2);
    assert.equal(stats.completedAttempts, 2);
    assert.equal(stats.avgCompletedScore, 850);
    assert.equal(stats.returningPlayers, 1);
    assert.equal(stats.todaySnapshot.uniquePlayers, 2);
    assert.equal(stats.todaySnapshot.completed, 1);
    assert.equal(stats.nextDayReturn.returnedPlayers, 1);
    assert.equal(stats.dailyStats[0].uniquePlayers, 1);
  });
});