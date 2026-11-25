"use strict";

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const { registerAdventLeagueRoutes } = require("./adventLeagueRoutes.cjs");
const { buildResultsPdf } = require("./adventLeaguePdf.cjs");

const JWT_SECRET = "test-advent-secret";
const DAYS = ["2026-12-05", "2026-12-06", "2026-12-07"];

function createTestDb() {
  const raw = new Database(":memory:");
  raw.pragma("foreign_keys = ON");
  raw.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 1
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
      UNIQUE(user_id, day_key)
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
      UNIQUE(attempt_id, question_index)
    );
    CREATE TABLE advent_question_opens (
      attempt_id INTEGER NOT NULL,
      question_index INTEGER NOT NULL,
      opened_at TEXT NOT NULL,
      PRIMARY KEY (attempt_id, question_index)
    );
  `);
  const info = raw.prepare("INSERT INTO users (username, email, password_hash) VALUES ('igrac', 'igrac@test.com', 'x')").run();
  return {
    raw,
    userId: info.lastInsertRowid,
    db: {
      prepare(sql) {
        return {
          get: (...params) => raw.prepare(sql).get(...params),
          all: (...params) => raw.prepare(sql).all(...params),
          run: (...params) => raw.prepare(sql).run(...params),
        };
      },
    },
  };
}

function requestJson(server, method, urlPath, body, token) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: server.address().port,
        path: urlPath,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = null;
          }
          resolve({ status: res.statusCode, json, text });
        });
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function answerFor(question) {
  if (question.type === "choice") return question.correctAnswer;
  if (question.type === "distance") return String(question.distanceKm);
  return question.acceptedAnswers[0];
}

describe("advent quiz flow — tri dana", () => {
  let server;
  let ctx;
  let token;

  before(async () => {
    process.env.NODE_ENV = "development";
    ctx = createTestDb();
    const app = express();
    app.use(express.json());
    registerAdventLeagueRoutes(app, ctx.db, {
      authMiddleware: async (req, _res, next) => {
        const raw = String(req.headers.authorization || "").replace(/^Bearer /, "");
        const decoded = jwt.verify(raw, JWT_SECRET);
        req.user = { id: Number(decoded.sub) };
        next();
      },
      optionalAuthMiddleware: async (_req, _res, next) => next(),
      adminMiddleware: async (req, _res, next) => {
        req.user = { id: ctx.userId };
        next();
      },
      getChatDayKey: () => process.env.ADVENT_DEV_TODAY_KEY,
    });
    server = await new Promise((resolve) => {
      const s = app.listen(0, "127.0.0.1", () => resolve(s));
    });
    token = jwt.sign({ sub: ctx.userId }, JWT_SECRET);
  });

  after(async () => {
    delete process.env.ADVENT_DEV_TODAY_KEY;
    await new Promise((resolve) => server.close(resolve));
    ctx.raw.close();
  });

  it("igra tri dana, sprema bodove jednom i zbraja ljestvicu", async () => {
    let expected = 0;
    for (const dayKey of DAYS) {
      process.env.ADVENT_DEV_TODAY_KEY = dayKey;
      const start = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token);
      assert.equal(start.status, 200, start.json?.message);
      assert.equal(start.json.data.questions.length, 10);
      for (const question of start.json.data.questions) {
        assert.equal(question.correctAnswer, undefined);
        assert.equal(question.acceptedAnswers, undefined);
        assert.equal(question.distanceKm, undefined);
      }
      const attemptId = start.json.data.attemptId;
      const full = require("./adventLeagueData.cjs").getDayPackage(dayKey);
      for (const question of full.questions) {
        const openedAt = new Date(Date.now() - 2000).toISOString();
        ctx.raw
          .prepare("INSERT INTO advent_question_opens (attempt_id, question_index, opened_at) VALUES (?, ?, ?)")
          .run(attemptId, question.index, openedAt);
        const ans = await requestJson(
          server,
          "POST",
          "/api/advent/answer",
          {
            attemptId,
            dayKey,
            questionIndex: question.index,
            selectedAnswer: answerFor(question),
            questionStartedAt: openedAt,
          },
          token,
        );
        assert.equal(ans.status, 200, `${dayKey} #${question.index} ${ans.json?.message}`);
        assert.equal(ans.json.data.score, 100, `${dayKey} #${question.index}`);
        expected += 100;
        const again = await requestJson(
          server,
          "POST",
          "/api/advent/answer",
          {
            attemptId,
            dayKey,
            questionIndex: question.index,
            selectedAnswer: answerFor(question),
            questionStartedAt: openedAt,
          },
          token,
        );
        assert.ok(again.status === 409 || again.status === 400);
      }
      const done = await requestJson(server, "POST", "/api/advent/complete", { attemptId, dayKey }, token);
      assert.equal(done.status, 200, done.json?.message);
      assert.equal(done.json.data.totalScore, 1000);
      const replay = await requestJson(server, "POST", "/api/advent/start", { dayKey }, token);
      assert.equal(replay.status, 409);
    }

    const board = await requestJson(server, "GET", "/api/advent/leaderboard", null, token);
    assert.equal(board.status, 200);
    assert.equal(board.json.data.entries[0].username, "igrac");
    assert.equal(board.json.data.entries[0].totalScore, expected);
    assert.equal(board.json.data.entries[0].daysPlayed, 3);
  });

  it("PDF rezultata je valjan dokument", async () => {
    const res = await requestJson(server, "GET", "/api/admin/advent/results/export?format=pdf", null, token);
    assert.equal(res.status, 200);
    assert.ok(res.text.startsWith("%PDF"));
    const direct = buildResultsPdf(["Igrac 1000"]);
    assert.ok(direct.includes("%PDF"));
  });
});
