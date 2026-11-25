"use strict";

const crypto = require("crypto");

async function qGet(db, sql, ...params) {
  return db.prepare(sql).get(...params);
}

async function qAll(db, sql, ...params) {
  return db.prepare(sql).all(...params);
}

async function qRun(db, sql, ...params) {
  return db.prepare(sql).run(...params);
}

async function getDrawStatusForUser(db, userId) {
  const row = await qGet(db, "SELECT joined_at FROM advent_prize_draw_entries WHERE user_id = ?", userId);
  return {
    entered: Boolean(row),
    joinedAt: row?.joined_at ?? null,
  };
}

async function enterPrizeDraw(db, userId) {
  const existing = await qGet(db, "SELECT user_id FROM advent_prize_draw_entries WHERE user_id = ?", userId);
  if (existing) {
    return { entered: true, already: true };
  }
  const now = new Date().toISOString();
  await qRun(db, "INSERT INTO advent_prize_draw_entries (user_id, joined_at) VALUES (?, ?)", userId, now);
  return { entered: true, already: false, joinedAt: now };
}

async function listDrawEntrantsForAdmin(db, limit = 500) {
  const rows = await qAll(
    db,
    `SELECT e.user_id, e.joined_at, u.username
     FROM advent_prize_draw_entries e
     JOIN users u ON u.id = e.user_id
     ORDER BY e.joined_at ASC
     LIMIT ?`,
    Math.min(2000, Math.max(1, limit)),
  );
  return rows.map((r) => ({
    userId: Number(r.user_id),
    username: String(r.username || ""),
    joinedAt: r.joined_at,
  }));
}

async function getDrawStats(db) {
  const row = await qGet(db, "SELECT COUNT(*) as c FROM advent_prize_draw_entries");
  const winners = await qAll(
    db,
    `SELECT w.id, w.user_id, w.picked_at, u.username
     FROM advent_prize_draw_winners w
     JOIN users u ON u.id = w.user_id
     ORDER BY w.picked_at DESC
     LIMIT 20`,
  );
  return {
    entrantCount: Number(row?.c) || 0,
    recentWinners: winners.map((w) => ({
      id: w.id,
      userId: Number(w.user_id),
      username: String(w.username || ""),
      pickedAt: w.picked_at,
    })),
  };
}

async function pickRandomDrawWinner(db, adminUserId) {
  const countRow = await qGet(db, "SELECT COUNT(*) as c FROM advent_prize_draw_entries");
  const total = Number(countRow?.c) || 0;
  if (total < 1) {
    return { ok: false, code: "NO_ENTRANTS", message: "Nema prijava u nagradnoj igri." };
  }

  const offset = crypto.randomInt(0, total);
  const entrant = await qGet(
    db,
    `SELECT e.user_id, u.username
     FROM advent_prize_draw_entries e
     JOIN users u ON u.id = e.user_id
     ORDER BY e.user_id ASC
     LIMIT 1 OFFSET ?`,
    offset,
  );
  if (!entrant) {
    return { ok: false, code: "PICK_FAILED", message: "Izvlačenje nije uspjelo." };
  }

  const seed = crypto.randomBytes(16).toString("hex");
  const pickedAt = new Date().toISOString();
  await qRun(
    db,
  `INSERT INTO advent_prize_draw_winners (user_id, picked_at, picked_by_admin_id, random_seed)
     VALUES (?, ?, ?, ?)`,
    entrant.user_id,
    pickedAt,
    adminUserId,
    seed,
  );

  return {
    ok: true,
    winner: {
      userId: Number(entrant.user_id),
      username: String(entrant.username || ""),
      pickedAt,
      seed,
      poolSize: total,
    },
  };
}

module.exports = {
  getDrawStatusForUser,
  enterPrizeDraw,
  listDrawEntrantsForAdmin,
  getDrawStats,
  pickRandomDrawWinner,
};