"use strict";

const crypto = require("crypto");

const CODE_PATTERN = /^[a-z0-9]{6,16}$/;
const MAX_VISITS_PER_VISITOR_DAY = 8;
const DEDUPE_WINDOW_MS = 60 * 60 * 1000;
const NEW_USER_CLAIM_WINDOW_MS = 72 * 60 * 60 * 1000;

function referralHashSalt() {
  return String(process.env.REFERRAL_HASH_SALT || process.env.JWT_SECRET || "mojput-referral-dev-salt");
}

function getVisitorHash(req) {
  const xf = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  const ip = xf || req.ip || req.socket?.remoteAddress || "unknown";
  const ua = String(req.headers["user-agent"] || "").slice(0, 120);
  return crypto.createHmac("sha256", referralHashSalt()).update(`${ip}|${ua}`).digest("hex").slice(0, 40);
}

function getDayKeyUtc() {
  return new Date().toISOString().slice(0, 10);
}

function generateReferralCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const raw = crypto.randomBytes(8).toString("base64url").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const code = (raw + crypto.randomBytes(4).toString("hex")).slice(0, 10);
    if (CODE_PATTERN.test(code)) return code;
  }
  return crypto.randomBytes(5).toString("hex");
}

async function qGet(db, sql, ...params) {
  return db.prepare(sql).get(...params);
}

async function qAll(db, sql, ...params) {
  return db.prepare(sql).all(...params);
}

async function qRun(db, sql, ...params) {
  return db.prepare(sql).run(...params);
}

async function getOrCreateReferralCode(db, userId) {
  const existing = await qGet(db, "SELECT code FROM advent_referral_codes WHERE user_id = ?", userId);
  if (existing?.code) return existing.code;

  for (let i = 0; i < 12; i += 1) {
    const code = generateReferralCode();
    try {
      await qRun(
        db,
        "INSERT INTO advent_referral_codes (user_id, code) VALUES (?, ?)",
        userId,
        code,
      );
      return code;
    } catch (err) {
      if (String(err?.message || "").includes("UNIQUE")) continue;
      throw err;
    }
  }
  throw new Error("Ne mogu generirati referral kod.");
}

async function resolveReferrerByCode(db, code) {
  const normalized = String(code || "").trim().toLowerCase();
  if (!CODE_PATTERN.test(normalized)) return null;
  const row = await qGet(
    db,
    `
      SELECT c.user_id, c.code, u.username
      FROM advent_referral_codes c
      JOIN users u ON u.id = c.user_id
      WHERE c.code = ?
    `,
    normalized,
  );
  if (!row) return null;
  return { userId: Number(row.user_id), code: row.code, username: row.username };
}

async function trackReferralVisit(db, req, { code, landingPath }) {
  const referrer = await resolveReferrerByCode(db, code);
  if (!referrer) return { recorded: false, reason: "invalid_code" };

  const viewerId = req.user?.id != null ? Number(req.user.id) : null;
  if (viewerId != null && viewerId === referrer.userId) {
    return { recorded: false, reason: "self_referral" };
  }

  const visitorHash = getVisitorHash(req);
  const dayKey = getDayKeyUtc();

  const countRow = await qGet(
    db,
    `
      SELECT COUNT(*) as c FROM advent_referral_visits
      WHERE referral_code = ? AND visitor_hash = ? AND day_key = ?
    `,
    referrer.code,
    visitorHash,
    dayKey,
  );
  if (Number(countRow?.c ?? 0) >= MAX_VISITS_PER_VISITOR_DAY) {
    return { recorded: false, reason: "rate_limited" };
  }

  const recent = await qGet(
    db,
    `
      SELECT id FROM advent_referral_visits
      WHERE referral_code = ? AND visitor_hash = ?
      ORDER BY id DESC LIMIT 1
    `,
    referrer.code,
    visitorHash,
  );
  if (recent?.id) {
    const last = await qGet(db, "SELECT created_at FROM advent_referral_visits WHERE id = ?", recent.id);
    const t = Date.parse(last?.created_at || "");
    if (Number.isFinite(t) && Date.now() - t < DEDUPE_WINDOW_MS) {
      return { recorded: false, reason: "deduped" };
    }
  }

  const path = String(landingPath || "").trim().slice(0, 200) || "/adventska-liga";
  await qRun(
    db,
    `
      INSERT INTO advent_referral_visits (referral_code, referrer_user_id, visitor_hash, landing_path, day_key)
      VALUES (?, ?, ?, ?, ?)
    `,
    referrer.code,
    referrer.userId,
    visitorHash,
    path,
    dayKey,
  );

  return { recorded: true, reason: null };
}

async function claimReferralSignup(db, userId, code) {
  const referrer = await resolveReferrerByCode(db, code);
  if (!referrer) return { ok: false, code: "invalid_code", message: "Nevaljan referral kod." };

  if (Number(userId) === referrer.userId) {
    return { ok: false, code: "self_referral", message: "Ne možeš koristiti vlastiti link." };
  }

  const existing = await qGet(db, "SELECT id FROM advent_referral_signups WHERE referred_user_id = ?", userId);
  if (existing) return { ok: true, code: "already_attributed", attributed: false };

  const user = await qGet(db, "SELECT id, created_at FROM users WHERE id = ?", userId);
  if (!user) return { ok: false, code: "no_user", message: "Korisnik ne postoji." };

  const createdMs = Date.parse(user.created_at || "");
  if (!Number.isFinite(createdMs) || Date.now() - createdMs > NEW_USER_CLAIM_WINDOW_MS) {
    return { ok: true, code: "account_too_old", attributed: false };
  }

  try {
    await qRun(
      db,
      `
      INSERT INTO advent_referral_signups (referral_code, referrer_user_id, referred_user_id)
      VALUES (?, ?, ?)
    `,
      referrer.code,
      referrer.userId,
      userId,
    );
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (String(err?.code || "") === "SQLITE_CONSTRAINT" || String(err?.code || "") === "23505" || msg.includes("unique")) {
      return { ok: true, code: "already_attributed", attributed: false };
    }
    throw err;
  }

  return { ok: true, code: "attributed", attributed: true };
}

async function getReferralStatsForAdmin(db) {
  const totals = await qGet(
    db,
    `
      SELECT
        (SELECT COUNT(*) FROM advent_referral_visits) as visits,
        (SELECT COUNT(*) FROM advent_referral_signups) as signups,
        (SELECT COUNT(DISTINCT referrer_user_id) FROM advent_referral_codes) as referrers_with_codes
    `,
  );

  const top = await qAll(
    db,
    `
      SELECT
        c.code,
        u.username,
        (SELECT COUNT(*) FROM advent_referral_visits v WHERE v.referral_code = c.code) as visits,
        (SELECT COUNT(*) FROM advent_referral_signups s WHERE s.referral_code = c.code) as signups
      FROM advent_referral_codes c
      JOIN users u ON u.id = c.user_id
      ORDER BY visits DESC, signups DESC
      LIMIT 25
    `,
  );

  const sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const last7 = await qGet(
    db,
    "SELECT COUNT(*) as c FROM advent_referral_visits WHERE created_at >= ?",
    sinceIso,
  );

  const last7Signups = await qGet(
    db,
    "SELECT COUNT(*) as c FROM advent_referral_signups WHERE created_at >= ?",
    sinceIso,
  );

  return {
    totalVisits: Number(totals?.visits ?? 0),
    totalSignups: Number(totals?.signups ?? 0),
    referrersWithCodes: Number(totals?.referrers_with_codes ?? 0),
    visitsLast7Days: Number(last7?.c ?? 0),
    signupsLast7Days: Number(last7Signups?.c ?? 0),
    topReferrers: top.map((r) => ({
      code: r.code,
      username: r.username,
      visits: Number(r.visits),
      signups: Number(r.signups),
    })),
  };
}

function buildPublicShareUrl(originHint, basePath, code) {
  const base = String(basePath || "/adventska-liga").replace(/\/$/, "");
  const origin = originHint || "https://mojput.com";
  const url = new URL(base, origin.endsWith("/") ? origin : `${origin}/`);
  if (code) url.searchParams.set("ref", code);
  url.searchParams.set("utm_source", "advent_share");
  url.searchParams.set("utm_medium", "referral");
  return url.toString();
}

module.exports = {
  CODE_PATTERN,
  getVisitorHash,
  getOrCreateReferralCode,
  resolveReferrerByCode,
  trackReferralVisit,
  claimReferralSignup,
  getReferralStatsForAdmin,
  buildPublicShareUrl,
};