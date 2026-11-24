const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const { registerAdventLeagueRoutes } = require("./adventLeagueRoutes.cjs");
const { validateAdventClientQuestionStart } = require("./adventLeagueScoring.cjs");

const JWT_SECRET = "test-advent-security-secret";

function createTestDb() {
  const raw = new Database(":memory:");
  raw.pragma("foreign_keys = ON");
  raw.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      user_type TEXT
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
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, day_key),
      FOREIGN KEY (user_id) REFERENCES users(id)
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
      duration_ms INTEGER NOT NULL,
      answered_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(attempt_id, question_index),
      FOREIGN KEY (attempt_id) REFERENCES advent_day_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE advent_referral_codes (user_id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE advent_referral_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT NOT NULL,
      referrer_user_id INTEGER NOT NULL,
      visitor_hash TEXT NOT NULL,
      landing_path TEXT NOT NULL DEFAULT '/adventska-liga',
      day_key TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE advent_referral_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referral_code TEXT NOT NULL,
      referrer_user_id INTEGER NOT NULL,
      referred_user_id INTEGER NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  const u1 = raw
    .prepare("INSERT INTO users (username, email, password_hash, email_verified, user_type) VALUES (?, ?, ?, 1, 'srednjoskolac')")
    .run("player1", "player1@test.com", "hash");
  const u2 = raw
    .prepare("INSERT INTO users (username, email, password_hash, email_verified, user_type) VALUES (?, ?, ?, 1, 'srednjoskolac')")
    .run("player2", "player2@test.com", "hash");
  const admin = raw
    .prepare("INSERT INTO users (username, email, password_hash, email_verified, user_type) VALUES (?, ?, ?, 1, 'srednjoskolac')")
    .run("admin", "admin@advent.test", "hash");
  return {
    db: wrap(raw),
    user1Id: u1.lastInsertRowid,
    user2Id: u2.lastInsertRowid,
    adminId: admin.lastInsertRowid,
    close: () => raw.close(),
  };
}

function wrap(raw) {
  return {
    prepare(sql) {
      return {
        get: (...params) => raw.prepare(sql).get(...params),
        all: (...params) => raw.prepare(sql).all(...params),
        run: (...params) => raw.prepare(sql).run(...params),
      };
    },
  };
}

function authMiddleware(db) {
  return async (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ success: false, message: "Nisi prijavljen." });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db
        .prepare(
          "SELECT id, username, email, created_at, email_verified, user_type FROM users WHERE id = ?",
        )
        .get(decoded.sub);
      if (!user?.email_verified) return res.status(403).json({ success: false });
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ success: false });
    }
  };
}

function optionalAuthMiddleware() {
  return (req, _res, next) => {
    req.user = null;
    next();
  };
}

function adminMiddlewareFactory(adminEmails) {
  const auth = authMiddleware;
  return (db) => {
    const authMw = auth(db);
    return (req, res, next) => {
      authMw(req, res, () => {
        const email = String(req.user?.email || "").toLowerCase();
        if (!adminEmails.map((e) => e.toLowerCase()).includes(email)) {
          return res.status(403).json({ success: false, message: "Nemaš pristup tim podacima." });
        }
        next();
      });
    };
  };
}

const adminMiddleware = adminMiddlewareFactory(["admin@advent.test"]);

async function requestJson(server, method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        host: "127.0.0.1",
        port: server.address().port,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          resolve({ status: res.statusCode, json: raw ? JSON.parse(raw) : null });
        });
      },
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

describe("adventLeagueSecurity", () => {
  let server;
  let dbCtx;
  let token1;
  let token2;
  const dayKey = "2026-12-01";

  before(async () => {
    process.env.ADVENT_DEV_TODAY_KEY = dayKey;
    process.env.NODE_ENV = "development";
    dbCtx = createTestDb();
    const app = express();
    app.use(express.json());
    registerAdventLeagueRoutes(app, dbCtx.db, {
      authMiddleware: authMiddleware(dbCtx.db),
      optionalAuthMiddleware: optionalAuthMiddleware(),
      adminMiddleware: adminMiddleware(dbCtx.db),
      getChatDayKey: () => "2099-01-01",
    });
    server = await new Promise((resolve) => {
      const s = app.listen(0, "127.0.0.1", () => resolve(s));
    });
    token1 = jwt.sign({ sub: dbCtx.user1Id }, JWT_SECRET);
    token2 = jwt.sign({ sub: dbCtx.user2Id }, JWT_SECRET);
  });

  after(async () => {
    delete process.env.ADVENT_DEV_TODAY_KEY;
    await new Promise((resolve) => server.close(resolve));
    dbCtx.close();
  });

  it("ne šalje correctAnswer na start", async () => {
    const res = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token1);
    assert.equal(res.status, 200);
    assert.ok(!res.json.data.questions[0].correctAnswer);
  });

  it("odbija odgovor na tuđi attempt", async () => {
    const start = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token1);
    const attemptId = start.json.data.attemptId;
    const wrong = await requestJson(
      server,
      "POST",
      "/api/advent/answer",
      {
        attemptId,
        dayKey,
        questionIndex: 0,
        selectedAnswer: "a",
        questionStartedAt: new Date().toISOString(),
      },
      token2,
    );
    assert.equal(wrong.status, 403);
  });

  it("odbija preskakanje pitanja (redoslijed)", async () => {
    const start = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token2);
    assert.equal(start.status, 200);
    const attemptId = start.json.data.attemptId;
    const skip = await requestJson(
      server,
      "POST",
      "/api/advent/answer",
      {
        attemptId,
        dayKey,
        questionIndex: 1,
        selectedAnswer: "a",
        questionStartedAt: new Date().toISOString(),
      },
      token2,
    );
    assert.equal(skip.status, 400);
    assert.equal(skip.json.code, "OUT_OF_ORDER");
  });

  it("server mjeri vrijeme — backdated client start i instant submit", async () => {
    const start = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token1);
    const attemptId = start.json.data.attemptId;
    await sleep(800);
    const backdated = new Date(Date.now() - 10_000).toISOString();
    const ans = await requestJson(
      server,
      "POST",
      "/api/advent/answer",
      {
        attemptId,
        dayKey,
        questionIndex: 0,
        selectedAnswer: "a",
        questionStartedAt: backdated,
      },
      token1,
    );
    assert.equal(ans.status, 400);
    assert.equal(ans.json.code, "INVALID_TIMING");
  });

  it("ne cure explanation kad je odgovor netočan", async () => {
    const start = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token1);
    const attemptId = start.json.data.attemptId;
    const already = start.json.data.answered?.length || 0;
    if (already >= 10) return;
    await sleep(600);
    const idx = already;
    const ans = await requestJson(
      server,
      "POST",
      "/api/advent/answer",
      {
        attemptId,
        dayKey,
        questionIndex: idx,
        selectedAnswer: "d",
        questionStartedAt: new Date().toISOString(),
      },
      token1,
    );
    if (ans.status === 409) return;
    assert.equal(ans.status, 200);
    if (!ans.json.data.correct) {
      assert.equal(ans.json.data.explanation, null);
    }
  });

  it("admin ruta bez admin emaila → 403", async () => {
    const res = await requestJson(server, "GET", "/api/admin/advent/stats", null, token1);
    assert.equal(res.status, 403);
  });

  it("admin ruta bez auth → 401", async () => {
    const res = await requestJson(server, "GET", "/api/admin/advent/stats", null, null);
    assert.equal(res.status, 401);
  });

  it("validateAdventClientQuestionStart odbija backdating", () => {
    const now = Date.now();
    const anchor = now - 30_000;
    const clientStart = now - 20_000;
    const submit = now;
    assert.equal(validateAdventClientQuestionStart(clientStart, anchor, submit), null);
    const cheatStart = anchor - 10_000;
    assert.ok(validateAdventClientQuestionStart(cheatStart, anchor, submit));
  });
});