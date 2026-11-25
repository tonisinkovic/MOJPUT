const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const { getReferralCatchUpDayKey, isDayKeyPlayableForUser } = require("./adventLeagueCatchUp.cjs");

function createTestDb() {
  const raw = new Database(":memory:");
  raw.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE advent_referral_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT NOT NULL,
      referrer_user_id INTEGER NOT NULL,
      referred_user_id INTEGER NOT NULL UNIQUE,
      created_at TEXT NOT NULL
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
      UNIQUE(user_id, day_key)
    );
  `);
  return {
    prepare(sql) {
      return {
        get: (...p) => raw.prepare(sql).get(...p),
        all: (...p) => raw.prepare(sql).all(...p),
        run: (...p) => raw.prepare(sql).run(...p),
      };
    },
    close() {
      raw.close();
    },
  };
}

function completeDay(db, userId, dayKey) {
  db.prepare(
    `INSERT INTO advent_day_attempts
      (user_id, day_key, total_score, started_at, submitted_at, completed)
     VALUES (?, ?, 100, ?, ?, 1)`,
  ).run(userId, dayKey, `${dayKey}T10:00:00Z`, `${dayKey}T10:05:00Z`);
}

describe("adventLeagueCatchUp", () => {
  let db;
  let plainId;
  let referredId;

  before(() => {
    db = createTestDb();
    plainId = db
      .prepare("INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)")
      .run("plain", "plain@test.com", "h", "2026-12-05T08:00:00Z").lastInsertRowid;
    const referrerId = db
      .prepare("INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)")
      .run("ref", "ref@test.com", "h", "2026-12-01T08:00:00Z").lastInsertRowid;
    referredId = db
      .prepare("INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)")
      .run("new", "new@test.com", "h", "2026-12-05T08:00:00Z").lastInsertRowid;
    db.prepare(
      `INSERT INTO advent_referral_signups
        (referral_code, referrer_user_id, referred_user_id, created_at)
       VALUES (?, ?, ?, ?)`,
    ).run("CODE1", referrerId, referredId, "2026-12-05T09:00:00Z");
  });

  after(() => {
    db.close();
  });

  it("današnji kviz dan je igriv i bez referala", async () => {
    const today = "2026-12-10";
    assert.equal(await isDayKeyPlayableForUser(db, plainId, today, today), true);
    assert.equal(await isDayKeyPlayableForUser(db, plainId, "2026-12-07", today), false);
    assert.equal(await getReferralCatchUpDayKey(db, plainId, today), null);
  });

  it("referral otvara samo najraniji propušteni dan", async () => {
    const today = "2026-12-10";
    completeDay(db, referredId, "2026-12-05");
    completeDay(db, referredId, "2026-12-06");

    assert.equal(await getReferralCatchUpDayKey(db, referredId, today), "2026-12-07");
    assert.equal(await isDayKeyPlayableForUser(db, referredId, today, today), true);
    assert.equal(await isDayKeyPlayableForUser(db, referredId, "2026-12-07", today), true);
    assert.equal(await isDayKeyPlayableForUser(db, referredId, "2026-12-08", today), false);
    assert.equal(await isDayKeyPlayableForUser(db, referredId, "2026-12-11", today), false);
  });
});
