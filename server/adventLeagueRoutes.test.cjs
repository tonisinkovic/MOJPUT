const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const { registerAdventLeagueRoutes } = require("./adventLeagueRoutes.cjs");

const JWT_SECRET = "test-advent-secret";

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
      user_type TEXT,
      last_login_at TEXT
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
  `);
  const info = raw
    .prepare("INSERT INTO users (username, email, password_hash, email_verified, user_type) VALUES (?, ?, ?, 1, 'srednjoskolac')")
    .run("player", "player@test.com", "hash");
  return { db: wrap(raw), userId: info.lastInsertRowid, close: () => raw.close() };
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

function optionalAuthMiddleware(db) {
  return async (req, res, next) => {
    req.user = null;
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db
        .prepare(
          "SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?",
        )
        .get(decoded.sub);
      if (user?.email_verified) req.user = user;
    } catch {
      /* ignore */
    }
    next();
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
          "SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?",
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

describe("adventLeagueRoutes", () => {
  let app;
  let server;
  let dbCtx;
  let token;
  const dayKey = "2026-12-08";

  before(async () => {
    process.env.ADVENT_DEV_TODAY_KEY = dayKey;
    process.env.NODE_ENV = "development";
    dbCtx = createTestDb();
    app = express();
    app.use(express.json());
    registerAdventLeagueRoutes(app, dbCtx.db, {
      authMiddleware: authMiddleware(dbCtx.db),
      optionalAuthMiddleware: optionalAuthMiddleware(dbCtx.db),
      adminMiddleware: (_req, res) => res.status(403).json({ success: false, message: "test admin off" }),
      getChatDayKey: () => "2099-01-01",
    });
    server = await new Promise((resolve) => {
      const s = app.listen(0, "127.0.0.1", () => resolve(s));
    });
    token = jwt.sign({ sub: dbCtx.userId }, JWT_SECRET);
  });

  after(async () => {
    delete process.env.ADVENT_DEV_TODAY_KEY;
    await new Promise((resolve) => server.close(resolve));
    dbCtx.close();
  });

  it("POST start returns sanitized questions", async () => {
    const res = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token);
    assert.equal(res.status, 200);
    assert.equal(res.json.success, true);
    assert.equal(res.json.data.questions.length, 10);
    assert.ok(!res.json.data.questions[0].correctAnswer);
    assert.equal(res.json.data.questions[0].acceptedAnswers, undefined);
  });

  it("full quiz flow — 10 answers and complete", async () => {
    const start = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token);
    const attemptId = start.json.data.attemptId;
    const questions = start.json.data.questions;

    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 550));
      const questionStartedAt = new Date().toISOString();
      const ansRes = await requestJson(
        server,
        "POST",
        "/api/advent/answer",
        {
          attemptId,
          dayKey,
          questionIndex: i,
          selectedAnswer: questions[i].options[0].id,
          questionStartedAt,
        },
        token,
      );
      assert.equal(ansRes.status, 200, `answer ${i}: ${ansRes.json?.message || ""}`);
    }

    const complete = await requestJson(server, "POST", "/api/advent/complete", { attemptId, dayKey }, token);
    assert.equal(complete.status, 200);
    assert.equal(complete.json.data.questionsAnswered, 10);

    const dup = await requestJson(
      server,
      "POST",
      "/api/advent/answer",
      { attemptId, dayKey, questionIndex: 0, selectedAnswer: "a", questionStartedAt: new Date().toISOString() },
      token,
    );
    assert.equal(dup.status, 409);
  });
});