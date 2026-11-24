"use strict";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function clampPaging(limit, offset) {
  const lim = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || DEFAULT_LIMIT));
  const off = Math.max(0, Number(offset) || 0);
  return { limit: lim, offset: off };
}

function publicEntry(row, viewerUserId) {
  return {
    rank: row.rank,
    username: row.username,
    totalScore: row.totalScore,
    daysPlayed: row.daysPlayed ?? undefined,
    isYou: viewerUserId != null && row.userId === viewerUserId,
  };
}

async function getAdventSeasonLeaderboard(db, limit, offset) {
  const { limit: lim, offset: off } = clampPaging(limit, offset);

  const rows = await db
    .prepare(
      `
    SELECT
      u.id as user_id,
      u.username,
      SUM(a.total_score) as total_score,
      COUNT(*) as days_played,
      MAX(a.submitted_at) as last_submit
    FROM advent_day_attempts a
    INNER JOIN users u ON u.id = a.user_id
    WHERE a.completed = 1
    GROUP BY u.id, u.username
    ORDER BY total_score DESC, days_played DESC, last_submit ASC, u.id ASC
    LIMIT ? OFFSET ?
  `,
    )
    .all(lim, off);

  const countRow = await db
    .prepare(
      `
    SELECT COUNT(*) as c FROM (
      SELECT u.id
      FROM advent_day_attempts a
      INNER JOIN users u ON u.id = a.user_id
      WHERE a.completed = 1
      GROUP BY u.id
    )
  `,
    )
    .get();

  const entries = rows.map((row, i) => ({
    rank: off + i + 1,
    userId: row.user_id,
    username: row.username,
    totalScore: Number(row.total_score) || 0,
    daysPlayed: Number(row.days_played) || 0,
  }));

  return {
    entries,
    total: Number(countRow?.c) || 0,
    limit: lim,
    offset: off,
  };
}

async function getAdventDailyLeaderboard(db, dayKey, limit, offset) {
  const { limit: lim, offset: off } = clampPaging(limit, offset);

  const rows = await db
    .prepare(
      `
    SELECT
      u.id as user_id,
      u.username,
      a.total_score,
      a.submitted_at
    FROM advent_day_attempts a
    INNER JOIN users u ON u.id = a.user_id
    WHERE a.day_key = ? AND a.completed = 1
    ORDER BY a.total_score DESC, a.total_duration_ms ASC, a.submitted_at ASC, u.id ASC
    LIMIT ? OFFSET ?
  `,
    )
    .all(dayKey, lim, off);

  const countRow = await db
    .prepare(
      `
    SELECT COUNT(*) as c
    FROM advent_day_attempts
    WHERE day_key = ? AND completed = 1
  `,
    )
    .get(dayKey);

  const entries = rows.map((row, i) => ({
    rank: off + i + 1,
    userId: row.user_id,
    username: row.username,
    totalScore: Number(row.total_score) || 0,
    daysPlayed: 1,
  }));

  return {
    entries,
    total: Number(countRow?.c) || 0,
    limit: lim,
    offset: off,
    dayKey,
  };
}

async function getAdventSeasonStandingForUser(db, userId) {
  const row = await db
    .prepare(
      `
    WITH standings AS (
      SELECT
        u.id,
        u.username,
        SUM(a.total_score) AS total_score,
        COUNT(*) AS days_played,
        MAX(a.submitted_at) AS last_submit
      FROM advent_day_attempts a
      INNER JOIN users u ON u.id = a.user_id
      WHERE a.completed = 1
      GROUP BY u.id, u.username
    ),
    ranked AS (
      SELECT
        s1.id,
        s1.username,
        s1.total_score,
        s1.days_played,
        (
          SELECT COUNT(*) + 1
          FROM standings s2
          WHERE
            (s2.total_score > s1.total_score)
            OR (s2.total_score = s1.total_score AND s2.days_played > s1.days_played)
            OR (s2.total_score = s1.total_score AND s2.days_played = s1.days_played AND s2.last_submit < s1.last_submit)
            OR (s2.total_score = s1.total_score AND s2.days_played = s1.days_played AND s2.last_submit = s1.last_submit AND s2.id < s1.id)
        ) AS rank
      FROM standings s1
    )
    SELECT rank, username, total_score, days_played
    FROM ranked
    WHERE id = ?
  `,
    )
    .get(userId);

  if (!row) return null;

  return {
    rank: Number(row.rank),
    username: row.username,
    totalScore: Number(row.total_score) || 0,
    daysPlayed: Number(row.days_played) || 0,
  };
}

async function getAdventDailyStandingForUser(db, userId, dayKey) {
  const mine = await db
    .prepare(
      `
    SELECT total_score, total_duration_ms, submitted_at
    FROM advent_day_attempts
    WHERE user_id = ? AND day_key = ? AND completed = 1
  `,
    )
    .get(userId, dayKey);

  if (!mine) return null;

  const user = await db.prepare("SELECT username FROM users WHERE id = ?").get(userId);

  const better = await db
    .prepare(
      `
    SELECT COUNT(*) as c
    FROM advent_day_attempts a
    WHERE a.day_key = ? AND a.completed = 1
    AND (
      a.total_score > ?
      OR (a.total_score = ? AND a.total_duration_ms < ?)
      OR (a.total_score = ? AND a.total_duration_ms = ? AND a.submitted_at < ?)
      OR (a.total_score = ? AND a.total_duration_ms = ? AND a.submitted_at = ? AND a.user_id < ?)
    )
  `,
    )
    .get(
      dayKey,
      mine.total_score,
      mine.total_score,
      mine.total_duration_ms,
      mine.total_score,
      mine.total_duration_ms,
      mine.submitted_at,
      mine.total_score,
      mine.total_duration_ms,
      mine.submitted_at,
      userId,
    );

  return {
    rank: Number(better?.c || 0) + 1,
    username: user?.username || "—",
    totalScore: Number(mine.total_score) || 0,
    daysPlayed: 1,
  };
}

module.exports = {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  clampPaging,
  publicEntry,
  getAdventSeasonLeaderboard,
  getAdventDailyLeaderboard,
  getAdventSeasonStandingForUser,
  getAdventDailyStandingForUser,
};