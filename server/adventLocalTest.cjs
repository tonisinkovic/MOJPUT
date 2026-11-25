"use strict";

/** Lokalni test kviza. Isključen dok sezona ne krene. Nikad na Renderu, Railwayu ili Flyu. */
const LOCAL_QUIZ_TEST_ENABLED = false;

function isLoopbackAddress(addr) {
  const a = String(addr || "");
  return a === "127.0.0.1" || a === "::1" || a === "::ffff:127.0.0.1";
}

function isDeployedOnPaaS() {
  return Boolean(process.env.RENDER || process.env.RAILWAY_ENVIRONMENT || process.env.FLY_APP_NAME);
}

function isLocalQuizTestRequest(req) {
  if (!LOCAL_QUIZ_TEST_ENABLED) return false;
  if (isDeployedOnPaaS()) return false;
  const addr = req?.socket?.remoteAddress || req?.connection?.remoteAddress || "";
  return isLoopbackAddress(addr);
}

function readGuestKey(req) {
  const raw = String(req?.get?.("x-advent-local-guest") || req?.headers?.["x-advent-local-guest"] || "")
    .trim()
    .toLowerCase();
  return /^[a-z0-9]{8,32}$/.test(raw) ? raw : "";
}

async function ensureLocalGuest(db, guestKey) {
  if (!/^[a-z0-9]{8,32}$/.test(String(guestKey || ""))) return null;
  const email = `advent-guest-${guestKey}@localhost.test`;
  const select = () => db.prepare("SELECT id, username FROM users WHERE email = ?").get(email);
  const existing = await select();
  if (existing?.id) return { id: Number(existing.id), username: String(existing.username || "Gost") };

  const username = `Gost ${guestKey.slice(0, 6)}`;
  try {
    const info = await db
      .prepare(
        "INSERT INTO users (username, email, password_hash, user_type, email_verified) VALUES (?, ?, ?, ?, 1)",
      )
      .run(username, email, "local-guest-no-login", "srednjoskolac");
    const id = Number(info?.lastInsertRowid || 0);
    if (id) return { id, username };
  } catch (err) {
    const again = await select();
    if (again?.id) return { id: Number(again.id), username: String(again.username || username) };
    throw err;
  }
  const created = await select();
  if (!created?.id) return null;
  return { id: Number(created.id), username: String(created.username || username) };
}

module.exports = {
  isLoopbackAddress,
  isDeployedOnPaaS,
  isLocalQuizTestRequest,
  readGuestKey,
  ensureLocalGuest,
};
