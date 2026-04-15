require("dotenv").config({ path: require("path").join(__dirname, ".env") });
/** Na Renderu ne pregazi APP_ORIGIN iz dashboarda slučajnim .env.local u imageu. */
const dotenvLocalPath = require("path").join(__dirname, ".env.local");
const onRender = String(process.env.RENDER || "").toLowerCase() === "true" || process.env.RENDER === "1";
if (require("fs").existsSync(dotenvLocalPath)) {
  require("dotenv").config({ path: dotenvLocalPath, override: !onRender });
}

process.on("uncaughtException", (err) => {
  console.error("[server] uncaughtException:", err?.message || err);
});
process.on("unhandledRejection", (err) => {
  console.error("[server] unhandledRejection:", err?.message || err);
});

const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Database = require("better-sqlite3");
const { fromZonedTime, toZonedTime } = require("date-fns-tz");
const { addDays, startOfDay } = require("date-fns");

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_COOKIE = "mojput_token";

/** Javni URL ovog API-ja iz HTTP zahtjeva (debug / drugi endpointi — ne za link u mailu). */
function getApiPublicBase(req) {
  const xfProto = req.get("x-forwarded-proto");
  const proto = (xfProto ? xfProto.split(",")[0].trim() : "") || req.protocol || "http";
  const xfHost = req.get("x-forwarded-host");
  const host = (xfHost ? xfHost.split(",")[0].trim() : "") || req.get("host") || `127.0.0.1:${PORT}`;
  return `${proto}://${host}`;
}

/** Učitaj .env pa .env.local (override) — uvijek oba, inače API_PUBLIC_URL može ostati stari iz .env kad .env.local još nema ključ. */
function reloadAllEnv() {
  const root = __dirname;
  require("dotenv").config({ path: path.join(root, ".env") });
  const localPath = path.join(root, ".env.local");
  if (fs.existsSync(localPath)) {
    const onRender = String(process.env.RENDER || "").toLowerCase() === "true" || process.env.RENDER === "1";
    require("dotenv").config({ path: localPath, override: !onRender });
  }
}

/** API_PUBLIC_URL s diska: prvo .env.local (tunel), pa .env — ne oslanjaj se samo na process.env. */
function readApiPublicUrlFromDisk() {
  const root = __dirname;
  for (const name of [".env.local", ".env"]) {
    const fp = path.join(root, name);
    if (!fs.existsSync(fp)) continue;
    let raw;
    try {
      raw = fs.readFileSync(fp, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const m = t.match(/^API_PUBLIC_URL\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[1].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      v = v.replace(/\/$/, "");
      if (v) return v;
    }
  }
  return "";
}

const DEFAULT_RESEND_FROM = "MojPut <onboarding@resend.dev>";

/**
 * Jedinstveni «from» za Resend: uklanja navodnike iz env-a, dopunjava `MojPut <email>` ako je samo adresa,
 * te pada na onboarding@resend.dev ako vrijednost nije valjana (često krivo zalijepljeno u Render dashboardu).
 */
function normalizeResendFrom(raw) {
  let s = String(raw ?? "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  if (!s) return DEFAULT_RESEND_FROM;

  const emailInBrackets = /^(.+?)\s*<([^>\s]+@[^>\s]+)>\s*$/;
  const bracketed = s.match(emailInBrackets);
  if (bracketed) {
    const email = bracketed[2].trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      console.warn("[mail] RESEND_FROM sadrži nevaljan email — koristim zadano onboarding@resend.dev.");
      return DEFAULT_RESEND_FROM;
    }
    return `${bracketed[1].trim()} <${email}>`;
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) {
    return `MojPut <${s.toLowerCase()}>`;
  }

  console.warn("[mail] RESEND_FROM nije valjan («" + s + "») — koristim zadano onboarding@resend.dev.");
  return DEFAULT_RESEND_FROM;
}

/** Resend odbija zahtjeve bez User-Agent (403, često statusCode 1010). https://resend.com/docs/knowledge-base/403-error-1010 */
const RESEND_JSON_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "MojPut/1.0 (+https://github.com/tonisinkovic/MOJPUT)",
};

/** GitHub Pages origin (bez /MOJPUT) — CORS u produkciji. */
const GITHUB_PAGES_ORIGIN = "https://tonisinkovic.github.io";

/**
 * APP_ORIGIN = javni origin frontenda (npr. https://tonisinkovic.github.io), bez putanje /MOJPUT.
 */
function normalizeAppOrigin() {
  let o = String(process.env.APP_ORIGIN || "")
    .trim()
    .replace(/\/$/, "");
  o = o.replace(/\/MOJPUT$/i, "");
  return o;
}

/** Javni HTTPS origin frontenda ako APP_ORIGIN na Renderu slučajno ostane localhost (fork / vlastiti Pages). */
function publicAppOriginFallback() {
  const pub = String(process.env.PUBLIC_APP_ORIGIN || "")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/MOJPUT$/i, "");
  if (pub && /^https:\/\//i.test(pub)) return pub;
  return GITHUB_PAGES_ORIGIN;
}

/** Render / ostali PaaS — uključi sve uobičajene Render varijable (RENDER ponekad nije postavljen kako očekujemo). */
function isHostedEnvironment() {
  if (process.env.NODE_ENV === "production") return true;
  const r = String(process.env.RENDER || "").toLowerCase();
  if (r === "true" || r === "1") return true;
  if (String(process.env.RENDER_SERVICE_ID || "").trim().length > 0) return true;
  if (String(process.env.RENDER_EXTERNAL_URL || "").includes("onrender.com")) return true;
  if (String(process.env.RAILWAY_ENVIRONMENT || "").length > 0) return true;
  if (String(process.env.FLY_APP_NAME || "").length > 0) return true;
  return false;
}

/**
 * Stvarni deploy (Render, …) — bez NODE_ENV: lokalno često ima NODE_ENV=production u .env pa ne smije
 * gasiti link u mailu na 127.0.0.1 (.dev-frontend-origin).
 */
function isDeployedOnPaaS() {
  const r = String(process.env.RENDER || "").toLowerCase();
  if (r === "true" || r === "1") return true;
  if (String(process.env.RENDER_SERVICE_ID || "").trim().length > 0) return true;
  if (String(process.env.RENDER_EXTERNAL_URL || "").includes("onrender.com")) return true;
  if (String(process.env.RAILWAY_ENVIRONMENT || "").length > 0) return true;
  if (String(process.env.FLY_APP_NAME || "").length > 0) return true;
  return false;
}

/** Jednolinijski zapis od Vite dev servera (vite.config — writeDevFrontendOriginPlugin). */
function readDevFrontendOriginFile() {
  try {
    const fp = path.join(__dirname, ".dev-frontend-origin");
    if (!fs.existsSync(fp)) return null;
    const raw = fs
      .readFileSync(fp, "utf8")
      .trim()
      .replace(/\/$/, "")
      .replace(/\/MOJPUT$/i, "");
    if (!raw || !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(raw)) return null;
    return raw;
  } catch {
    return null;
  }
}

/**
 * Kad API radi lokalno, a APP_ORIGIN još pokazuje na GitHub Pages, link u mailu ne smije ići na Pages —
 * tamo bi /api/auth/verify zvao javni API (Render), a token postoji samo u lokalnoj bazi.
 * Stvarni port uzima se iz .dev-frontend-origin (Vite ga zapisuje pri startu). Ručno: DEV_MAIL_APP_ORIGIN.
 */
function localDevMailFrontendOrigin() {
  if (isDeployedOnPaaS()) return null;

  const explicit = String(process.env.DEV_MAIL_APP_ORIGIN || "")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/MOJPUT$/i, "");
  if (explicit) return explicit;

  const wouldBe = appOriginForLinks();
  const w = String(wouldBe || "")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/MOJPUT$/i, "");
  if (!w || !/^https:\/\//i.test(w)) return null;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(w)) return null;
  if (!/^https:\/\/[^/]+\.github\.io$/i.test(w)) return null;

  const auto = readDevFrontendOriginFile();
  if (auto) return auto;

  const port = String(process.env.FRONTEND_DEV_PORT || "8080").trim() || "8080";
  const fallback = `http://127.0.0.1:${port}`;
  console.warn(
    "[mail] Lokalni API + APP_ORIGIN (GitHub Pages): nema .dev-frontend-origin (pokreni Vite prije slanja maila?) — koristim",
    fallback,
    "ili FRONTEND_DEV_PORT iz .env.",
  );
  return fallback;
}

/**
 * Na pravom deployu (PaaS) u mailu nikad localhost — korisnik otvara s mobitela.
 * Lokalno (!isDeployedOnPaaS): ne zamjenjuj localhost s GitHub Pages — inače token ostane u lokalnoj bazi,
 * a link vodi na Pages/Render. Koristi .dev-frontend-origin (stvarni Vite port) ili APP_ORIGIN.
 */
function originNeverLocalhostForMail() {
  const fromLocalDev = localDevMailFrontendOrigin();
  if (fromLocalDev) return fromLocalDev;

  const allowLocal =
    String(process.env.ALLOW_LOCALHOST_IN_MAIL || "").toLowerCase() === "1" ||
    String(process.env.ALLOW_LOCALHOST_IN_MAIL || "").toLowerCase() === "true";
  let origin = appOriginForLinks();
  if (allowLocal) return origin;

  if (origin && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    if (!isDeployedOnPaaS()) {
      const vite = readDevFrontendOriginFile();
      if (vite) return vite;
      return origin;
    }
    const fb = publicAppOriginFallback();
    console.warn("[mail] ZAMJENA localhost → javni origin za link u pismu:", fb);
    return fb;
  }
  return origin;
}

function appOriginForLinks() {
  const forced = String(process.env.FORCE_MAIL_APP_ORIGIN || "")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/MOJPUT$/i, "");
  if (forced && /^https:\/\//i.test(forced)) {
    return forced;
  }

  const o = normalizeAppOrigin();
  const hosted = isHostedEnvironment();
  const isLocalHttp = o && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o);

  /** Hostano (Render, …): localhost u APP_ORIGIN nikad u mailu — čak i ako NODE_ENV nije "production". */
  if (hosted && isLocalHttp) {
    const fb = publicAppOriginFallback();
    console.warn(
      "[config] APP_ORIGIN je localhost na hostanom servisu — linkovi u mailu koriste:",
      fb,
      "(postavi APP_ORIGIN ili FORCE_MAIL_APP_ORIGIN=https://tvoj-user.github.io)",
    );
    return fb;
  }

  if (!o) {
    console.warn("[config] APP_ORIGIN nije postavljen — koristi se", publicAppOriginFallback());
    return publicAppOriginFallback();
  }
  if (/^https:\/\//i.test(o)) return o;
  /** Samo pravi lokalni dev (nije Render/Fly/…): link u mailu vodi na Vite. */
  if (isLocalHttp && !hosted) return o;
  console.warn("[config] APP_ORIGIN nije valjan — koristi se", publicAppOriginFallback());
  return publicAppOriginFallback();
}

/** Prvi IPv4 na LAN-u (nije loopback) — da link u mailu radi s mobitela na istom Wi‑Fi-u; 127.0.0.1 na mobitelu je sam mobitel. */
function getPreferredLanIPv4() {
  const candidates = [];
  const ifs = os.networkInterfaces();
  for (const name of Object.keys(ifs)) {
    for (const net of ifs[name] || []) {
      const fam = net.family;
      if ((fam !== "IPv4" && fam !== 4) || net.internal) continue;
      candidates.push(net.address);
    }
  }
  const rank = (a) => {
    if (/^192\.168\./.test(a)) return 300;
    if (/^10\./.test(a)) return 200;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(a)) return 200;
    return 100;
  };
  candidates.sort((a, b) => rank(b) - rank(a));
  return candidates[0] || null;
}

function localApiVerifyBaseUrl() {
  const p = Number(process.env.PORT || 3000);
  const raw = String(process.env.MAIL_API_HOST || "").trim();
  const hostOverride = raw
    ? raw
        .replace(/^https?:\/\//, "")
        .split("/")[0]
        .split(":")[0]
        .trim()
    : "";
  if (hostOverride) return `http://${hostOverride}:${p}`;
  if (String(process.env.MAIL_USE_LAN_IP || "0").trim() === "1") {
    const lan = getPreferredLanIPv4();
    if (lan) return `http://${lan}:${p}`;
  }
  return `http://127.0.0.1:${p}`;
}

/** Isti zadani kao u frontendu (src/config/apiBase.ts) — mora biti javni URL ovog Node servisa. */
const DEFAULT_PUBLIC_API_BASE = "https://mojput.onrender.com";

/**
 * Javni URL Node API-ja za link u mailu (mora biti isti servis gdje je token u bazi).
 * Produkcija: API_PUBLIC_URL (Render) ili zadani host. Lokalno: 127.0.0.1:PORT (MAIL_USE_LAN_IP=1 za LAN).
 * Override: MAIL_VERIFY_API_BASE (npr. ngrok).
 */
function resolvePublicApiBaseForMail() {
  const mailOnly = String(process.env.MAIL_VERIFY_API_BASE || "")
    .trim()
    .replace(/\/$/, "");
  if (mailOnly) return mailOnly;

  if (isDeployedOnPaaS()) {
    const fromEnv = String(process.env.API_PUBLIC_URL || "")
      .trim()
      .replace(/\/$/, "");
    const fromDisk = String(readApiPublicUrlFromDisk() || "")
      .trim()
      .replace(/\/$/, "");
    return fromEnv || fromDisk || DEFAULT_PUBLIC_API_BASE;
  }

  return localApiVerifyBaseUrl();
}

/**
 * Segment putanje u linkovima maila/redirecta (zadano MOJPUT = GitHub Pages).
 * Za frontend na korijenu domene (npr. Vercel): FRONTEND_AT_ROOT=1 ili FRONTEND_PATH_PREFIX= (prazan).
 */
function frontendPathPrefixSegment() {
  const root = String(process.env.FRONTEND_AT_ROOT || "")
    .trim()
    .toLowerCase();
  if (root === "1" || root === "true" || root === "yes") return "";
  if (!Object.prototype.hasOwnProperty.call(process.env, "FRONTEND_PATH_PREFIX")) return "MOJPUT";
  return String(process.env.FRONTEND_PATH_PREFIX || "").trim().replace(/^\/+|\/+$/g, "");
}

/** Stranica frontenda za unos 6-znamenkastog koda (nakon registracije). */
function frontendVerifyPageUrl(querySuffix) {
  const origin = getFrontendOriginForRedirect();
  const q = querySuffix ? `?${querySuffix}` : "";
  const seg = frontendPathPrefixSegment();
  const path = seg ? `/${seg}/verify` : `/verify`;
  return `${origin}${path}${q}`;
}

/** Nakon potvrde na Renderu: uvijek HTTPS GitHub Pages (APP_ORIGIN), bez lokalne Vite logike. */
function getFrontendOriginForRedirect() {
  if (isDeployedOnPaaS()) {
    const forced = String(process.env.FORCE_MAIL_APP_ORIGIN || "")
      .trim()
      .replace(/\/$/, "")
      .replace(/\/MOJPUT$/i, "");
    if (forced && /^https:\/\//i.test(forced)) return forced;
    const o = normalizeAppOrigin();
    const base = String(o || "")
      .trim()
      .replace(/\/$/, "")
      .replace(/\/MOJPUT$/i, "");
    if (base && /^https:\/\//i.test(base)) return base;
    return publicAppOriginFallback();
  }
  return originNeverLocalhostForMail();
}

function frontendPrijavaUrl(querySuffix) {
  const origin = getFrontendOriginForRedirect();
  const q = querySuffix ? `?${querySuffix}` : "";
  const seg = frontendPathPrefixSegment();
  const path = seg ? `/${seg}/prijava` : `/prijava`;
  return `${origin}${path}${q}`;
}

/** Stranica za novu lozinku nakon klika u mailu. */
function frontendResetPasswordPageUrl(token) {
  const origin = getFrontendOriginForRedirect();
  const seg = frontendPathPrefixSegment();
  const path = seg ? `/${seg}/zaboravljena-lozinka` : `/zaboravljena-lozinka`;
  const q = `token=${encodeURIComponent(String(token || ""))}`;
  return `${origin}${path}?${q}`;
}

/** Klik iz maila u pregledniku: redirect na Pages. fetch() iz SPA šalje samo Accept: application/json → JSON. */
function shouldUseVerifyRedirect(req) {
  if (String(req.query.format || "").toLowerCase() === "json") return false;
  if (String(req.query.redirect || "") === "0") return false;
  const accept = String(req.get("Accept") || "");
  if (/application\/json/i.test(accept) && !/text\/html/i.test(accept)) return false;
  return true;
}

const hasResend = Boolean(String(process.env.RESEND_API_KEY || "").trim());
const hasSmtp = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
);
console.log(
  "[config] Mail za registraciju:",
  hasResend
    ? "Resend API (preporučeno na Renderu)"
    : hasSmtp
      ? "SMTP"
      : "(Ethereal testni inbox ako nema SMTP)",
);
if (hasResend) {
  const fromEffective = normalizeResendFrom(process.env.RESEND_FROM);
  const masked = fromEffective.replace(/<([^>]+)>/, (_, addr) => {
    const [u, d] = String(addr).split("@");
    if (!d) return "<***>";
    return `<${(u || "").slice(0, 2)}***@${d}>`;
  });
  console.log("[config] Resend FROM (efektivno):", masked);
}
if (hasSmtp && process.env.SMTP_USER) {
  console.log("[config] SMTP pošiljatelj:", String(process.env.SMTP_USER).trim());
}
console.log("[config] APP_ORIGIN:", String(process.env.APP_ORIGIN || "").trim() || "(nije postavljen)");
console.log("[config] Render/PaaS:", isDeployedOnPaaS(), "| NODE_ENV:", process.env.NODE_ENV || "(nema)");
console.log("[config] Stranica za unos koda (potvrda) →", frontendVerifyPageUrl(""));
console.log("[config] Javni API (ostalo) →", resolvePublicApiBaseForMail());
console.log("[config] Redirect nakon potvrde →", frontendPrijavaUrl(""));
if (isDeployedOnPaaS() && !String(process.env.API_PUBLIC_URL || "").trim() && !readApiPublicUrlFromDisk()) {
  console.warn("[config] API_PUBLIC_URL nije u env — koristi se zadani:", DEFAULT_PUBLIC_API_BASE);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function openDb() {
  const dataDir = path.join(__dirname, "data");
  ensureDir(dataDir);
  const dbPath = path.join(dataDir, "mojput.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

/** Jedan limit po kalendarskom danu u Europe/Zagreb (isti ključ za sve upite). */
function getChatDayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

/** ISO trenutak sljedeće ponoći u Europe/Zagreb (reset dnevnog limita poruka). */
function getNextZagrebMidnightIso() {
  const now = new Date();
  const z = toZonedTime(now, "Europe/Zagreb");
  const next = addDays(startOfDay(z), 1);
  return fromZonedTime(next, "Europe/Zagreb").toISOString();
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      email_verify_token TEXT,
      email_verify_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS forum_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      creator_user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (creator_user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS forum_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (conversation_id) REFERENCES forum_conversations(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS forum_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, message_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (message_id) REFERENCES forum_messages(id)
    );

    CREATE TABLE IF NOT EXISTS pending_registrations (
      email TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      verify_token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      app_base_url TEXT
    );

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      page_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Lightweight migration for existing DBs (SQLite doesn't add columns automatically)
  const cols = db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
  if (!cols.includes("email_verified")) db.exec("ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0");
  if (!cols.includes("email_verify_token")) db.exec("ALTER TABLE users ADD COLUMN email_verify_token TEXT");
  if (!cols.includes("email_verify_expires_at")) db.exec("ALTER TABLE users ADD COLUMN email_verify_expires_at TEXT");
  try {
    db.prepare("SELECT 1 FROM forum_likes LIMIT 1").get();
  } catch {
    db.exec(`
      CREATE TABLE forum_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, message_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (message_id) REFERENCES forum_messages(id)
      )
    `);
  }

  try {
    db.prepare("SELECT 1 FROM pending_registrations LIMIT 1").get();
  } catch {
    db.exec(`
      CREATE TABLE pending_registrations (
        email TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        verify_token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        app_base_url TEXT
      )
    `);
  }

  const pendingCols = db.prepare("PRAGMA table_info(pending_registrations)").all().map((c) => c.name);
  if (pendingCols.length && !pendingCols.includes("app_base_url")) {
    db.exec("ALTER TABLE pending_registrations ADD COLUMN app_base_url TEXT");
  }
  if (pendingCols.length && !pendingCols.includes("verify_code_hash")) {
    db.exec("ALTER TABLE pending_registrations ADD COLUMN verify_code_hash TEXT");
  }

  try {
    db.prepare("SELECT 1 FROM app_meta LIMIT 1").get();
  } catch {
    db.exec(`CREATE TABLE app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
  }

  try {
    db.prepare("SELECT 1 FROM career_quiz_results LIMIT 1").get();
  } catch {
    db.exec(`
      CREATE TABLE career_quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        payload TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }

  const userCols = db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
  if (!userCols.includes("user_type")) {
    db.exec("ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'srednjoskolac'");
  }
  if (!userCols.includes("last_login_at")) {
    db.exec("ALTER TABLE users ADD COLUMN last_login_at TEXT");
  }
  if (!userCols.includes("password_reset_token_hash")) {
    db.exec("ALTER TABLE users ADD COLUMN password_reset_token_hash TEXT");
  }
  if (!userCols.includes("password_reset_expires_at")) {
    db.exec("ALTER TABLE users ADD COLUMN password_reset_expires_at TEXT");
  }

  const forumMsgCols = db.prepare("PRAGMA table_info(forum_messages)").all().map((c) => c.name);
  if (!forumMsgCols.includes("reply_to_id")) {
    db.exec("ALTER TABLE forum_messages ADD COLUMN reply_to_id INTEGER REFERENCES forum_messages(id)");
  }
  if (!forumMsgCols.includes("deleted_by_user_at")) {
    db.exec("ALTER TABLE forum_messages ADD COLUMN deleted_by_user_at TEXT");
  }

  try {
    db.prepare("SELECT 1 FROM user_saved_faculties LIMIT 1").get();
  } catch {
    db.exec(`
      CREATE TABLE user_saved_faculties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        faculty_id TEXT NOT NULL,
        label TEXT NOT NULL,
        city TEXT,
        excerpt TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, faculty_id)
      )
    `);
  }

  try {
    db.prepare("SELECT 1 FROM chatbot_daily_usage LIMIT 1").get();
  } catch {
    db.exec(`
      CREATE TABLE chatbot_daily_usage (
        user_id INTEGER NOT NULL,
        day TEXT NOT NULL,
        message_count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, day),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }

  const migrated = db.prepare("SELECT 1 FROM app_meta WHERE key = 'pending_registration_flow_v1'").get();
  if (!migrated) {
    db.exec("PRAGMA foreign_keys = OFF");
    db.exec("DELETE FROM forum_likes");
    db.exec("DELETE FROM forum_messages");
    db.exec("DELETE FROM forum_conversations");
    db.exec("DELETE FROM users");
    try {
      db.exec("DELETE FROM pending_registrations");
    } catch {
      /* ignore */
    }
    db.exec("PRAGMA foreign_keys = ON");
    db.prepare("INSERT INTO app_meta (key, value) VALUES ('pending_registration_flow_v1', '1')").run();
    console.log("[migrate] Jednokratno očišćeni korisnici i nepotvrđene prijave (račun nastaje tek nakon klika u mailu).");
  }

  const otpMigrated = db.prepare("SELECT 1 FROM app_meta WHERE key = 'email_verify_otp_v1'").get();
  if (!otpMigrated) {
    db.exec("PRAGMA foreign_keys = OFF");
    db.exec("DELETE FROM forum_likes");
    db.exec("DELETE FROM forum_messages");
    db.exec("DELETE FROM forum_conversations");
    db.exec("DELETE FROM users");
    try {
      db.exec("DELETE FROM pending_registrations");
    } catch {
      /* ignore */
    }
    db.exec("PRAGMA foreign_keys = ON");
    db.prepare("INSERT INTO app_meta (key, value) VALUES ('email_verify_otp_v1', '1')").run();
    console.log("[migrate] Potvrda računa 6-znamenkastim kodom — jednokratno očišćeni korisnici i nepotvrđene prijave.");
  }
}

function seedForum(db) {
  const count = db.prepare("SELECT COUNT(*) as c FROM forum_conversations").get().c;
  if (count > 0) return;

  const anyUser = db.prepare("SELECT id FROM users ORDER BY id ASC LIMIT 1").get();
  if (!anyUser) return;

  const insertConv = db.prepare(
    "INSERT INTO forum_conversations (title, description, creator_user_id) VALUES (?, ?, ?)",
  );
  insertConv.run(
    "Najbolji fakulteti za informatiku",
    "Diskusija o fakultetima sa najboljim IT programima",
    anyUser.id,
  );
  insertConv.run("Iskustva sa maturom", "Savjeti i trikovi za maturu", anyUser.id);
}

function generateSixDigitCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function hashVerifyCode(code) {
  return bcrypt.hashSync(String(code || ""), 10);
}

function normalizeOtpCode(raw) {
  return String(raw || "").replace(/\D/g, "").slice(0, 6);
}

/** @type {Map<string, { n: number, resetAt: number }>} */
const verifyCodeAttempts = new Map();

function verifyCodeRateLimitOk(emailKey) {
  const now = Date.now();
  const k = String(emailKey || "").toLowerCase().trim();
  if (!k) return false;
  let e = verifyCodeAttempts.get(k);
  if (!e || e.resetAt < now) {
    verifyCodeAttempts.set(k, { n: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (e.n >= 25) return false;
  e.n += 1;
  return true;
}

/** @type {Map<string, { n: number, resetAt: number }>} */
const forgotPasswordAttempts = new Map();

function forgotPasswordRateLimitOk(emailKey) {
  const now = Date.now();
  const k = `fp:${String(emailKey || "").toLowerCase().trim()}`;
  if (k === "fp:") return false;
  let e = forgotPasswordAttempts.get(k);
  if (!e || e.resetAt < now) {
    forgotPasswordAttempts.set(k, { n: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (e.n >= 5) return false;
  e.n += 1;
  return true;
}

function hashPasswordResetToken(token) {
  return crypto.createHash("sha256").update(String(token || ""), "utf8").digest("hex");
}

function finalizePendingRegistration(db, pending) {
  const already = db.prepare("SELECT id FROM users WHERE email = ?").get(pending.email);
  if (already) {
    db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(pending.email);
    return { alreadyUser: true };
  }
  db.prepare(
    "INSERT INTO users (username, email, password_hash, email_verified, email_verify_token, email_verify_expires_at) VALUES (?, ?, ?, 1, NULL, NULL)",
  ).run(pending.username, pending.email, pending.password_hash);
  db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(pending.email);
  seedForum(db);
  return { alreadyUser: false };
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "14d" });
}

/** Cookie (httpOnly) ili Authorization: Bearer — cross-site kolačići često padnu na mobitelu; token u headeru ostaje pouzdan. */
function getAuthTokenFromRequest(req) {
  const fromCookie = req.cookies?.[TOKEN_COOKIE];
  if (fromCookie && String(fromCookie).trim()) return String(fromCookie).trim();
  const raw = String(req.get("authorization") || req.get("Authorization") || "").trim();
  const m = raw.match(/^Bearer\s+(.+)$/i);
  if (m && m[1]) return m[1].trim();
  return null;
}

/**
 * Session cookie: za GitHub Pages → Render (različit host od API-ja) preglednik traži SameSite=None; Secure.
 * Lokalno preko Vite proxyja (http → isti host u browseru): Lax je dovoljan.
 */
function authCookieOptions(req) {
  const maxAge = 14 * 24 * 60 * 60 * 1000;
  const base = { httpOnly: true, path: "/", maxAge };

  const xfProto = String(req?.get?.("x-forwarded-proto") || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const secureApi = xfProto === "https" || Boolean(req?.secure);

  const origin = String(req?.get?.("origin") || "");
  let crossSiteHttps = false;
  if (origin.startsWith("https://") && secureApi) {
    try {
      const oh = new URL(origin).hostname;
      const hh = String(req?.get?.("host") || "").split(":")[0];
      if (oh && hh && oh !== hh) crossSiteHttps = true;
    } catch {
      /* ignore */
    }
  }

  if (crossSiteHttps) {
    return { ...base, sameSite: "none", secure: true };
  }

  if (process.env.NODE_ENV === "production" && secureApi) {
    return { ...base, sameSite: "none", secure: true };
  }

  return { ...base, sameSite: "lax", secure: false };
}

function setAuthCookie(res, token, req) {
  res.cookie(TOKEN_COOKIE, token, authCookieOptions(req));
}

function clearAuthCookie(res, req) {
  const o = authCookieOptions(req);
  res.clearCookie(TOKEN_COOKIE, {
    httpOnly: o.httpOnly,
    path: o.path,
    sameSite: o.sameSite,
    secure: o.secure,
  });
}

function authMiddleware(db) {
  return (req, res, next) => {
    const token = getAuthTokenFromRequest(req);
    if (!token) return res.status(401).json({ success: false, message: "Nisi prijavljen." });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db
        .prepare(
          "SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?",
        )
        .get(decoded.sub);
      if (!user) return res.status(401).json({ success: false, message: "Sesija nije važeća." });
      if (!user.email_verified) {
        return res.status(403).json({
          success: false,
          message: "Potvrdi email prije korištenja računa.",
          code: "EMAIL_NOT_VERIFIED",
        });
      }
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ success: false, message: "Sesija je istekla ili nije važeća." });
    }
  };
}

function optionalAuthMiddleware(db) {
  return (req, res, next) => {
    req.user = null;
    const token = getAuthTokenFromRequest(req);
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db
        .prepare(
          "SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?",
        )
        .get(decoded.sub);
      if (user && user.email_verified) req.user = user;
    } catch {
      /* ignore */
    }
    next();
  };
}

/** Emailovi tima (razdvojeni zarezom ili točka-zarezom). Zadano: mojputhr@gmail.com. */
function getAdminEmailSet() {
  const raw = String(process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "mojputhr@gmail.com").trim();
  return new Set(raw.split(/[,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean));
}

function isAdminEmail(email) {
  return getAdminEmailSet().has(String(email || "").trim().toLowerCase());
}

function userPayloadWithAdminFlag(userRow) {
  return {
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
    created_at: userRow.created_at,
    email_verified: userRow.email_verified,
    user_type: userRow.user_type ?? "srednjoskolac",
    last_login_at: userRow.last_login_at ?? null,
    is_admin: isAdminEmail(userRow.email),
  };
}

const ALLOWED_USER_TYPES = new Set(["srednjoskolac", "student", "profesor", "roditelj"]);

/** Nakon uspješne prijave: samo ako je email u ADMIN_EMAILS. */
function adminMiddleware(db) {
  const auth = authMiddleware(db);
  return (req, res, next) => {
    auth(req, res, () => {
      if (!isAdminEmail(req.user.email)) {
        return res.status(403).json({ success: false, message: "Nemaš pristup tim podacima." });
      }
      next();
    });
  };
}

function getMailTransportSync() {
  const host = String(process.env.SMTP_HOST || "").trim();
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "").replace(/\s/g, "");

  if (!host || !port || !user || !pass) return null;

  const isGmail =
    /gmail\.com$/i.test(host) || /@gmail\.com$/i.test(user) || host === "smtp.gmail.com";
  if (isGmail) {
    /** App password ili OAuth; 465 + TLS uobičajeno za smtp.gmail.com */
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  });
}

let etherealAccountPromise = null;

/** Testni SMTP (Ethereal) — koristi se kad nema SMTP_* ili kao pad kad Gmail ne radi (DNS/mreža). */
async function getEtherealMailTransport() {
  try {
    if (!etherealAccountPromise) {
      etherealAccountPromise = nodemailer.createTestAccount();
    }
    const account = await etherealAccountPromise;
    const transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    });
    return { transport, isEthereal: true, etherealUser: account.user };
  } catch (err) {
    console.error("[mail] Ethereal testni račun nije dostupan:", err?.message || err);
    etherealAccountPromise = null;
    throw err;
  }
}

async function getMailTransport() {
  const sync = getMailTransportSync();
  if (sync) return { transport: sync, isEthereal: false };
  return getEtherealMailTransport();
}

function smtpConnectionLikelyFailed(err) {
  const msg = String(err?.message || err || "").toLowerCase();
  return /enotfound|econnrefused|etimedout|getaddrinfo|eai_again|ehostunreach|enetunreach|certificate/i.test(
    msg,
  );
}

/** Lokalni dev / eksplicitno: SMTP_FALLBACK_ETHEREAL=1 — ako Gmail ne radi, šalji preko Ethereal. */
function allowSmtpFallbackToEthereal() {
  if (String(process.env.SMTP_FALLBACK_ETHEREAL || "").trim() === "1") return true;
  if (onRender) return false;
  if (process.env.NODE_ENV === "production") return false;
  return true;
}

function isValidEmail(email) {
  const s = String(email || "").trim();
  if (s.length < 6 || s.length > 254) return false;
  // Basic RFC-ish check: local@domain.tld (we can't prove inbox exists without sending)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inbox za obavijesti o povratnim informacijama (moguće overrideati s FEEDBACK_NOTIFY_EMAIL). */
function getFeedbackNotifyEmail() {
  return String(process.env.FEEDBACK_NOTIFY_EMAIL || "mojputhr@gmail.com").trim();
}

/**
 * Ne izlagati sirove SMTP odgovore (npr. Gmail 535) u JSON-u za korisnika.
 * 535 / BadCredentials = gotovo uvijek kriva lozinka ili korištenje obične lozinke umjesto App Password.
 */
function smtpErrorForClient(err) {
  const raw = String(err?.message || err || "");
  const lower = raw.toLowerCase();
  if (
    /\b535\b/i.test(raw) ||
    /badcredentials|invalid login|authentication failed|eauth|username and password not accepted/i.test(lower)
  ) {
    return (
      "Gmail je odbio SMTP prijavu. U .env koristi Google «Lozinka aplikacije» (16 znakova), ne lozinku za prijavu na Google. " +
      "Postavke Google računa → Sigurnost → dvostruka provjera → Lozinke aplikacija → generiraj za «Pošta». " +
      "SMTP_USER = puni email (npr. ime@gmail.com), SMTP_PASS = ta 16 znakova bez razmaka. " +
      "Ako ne želiš Gmail, ukloni SMTP_* iz okruženja — u dev modu koristi se testni Ethereal inbox."
    );
  }
  if (/econnrefused|etimedout|enotfound|getaddrinfo|certificate/i.test(lower)) {
    return "Ne mogu se spojiti na mail server. Provjeri SMTP_HOST, port i mrežu.";
  }
  return "Ne mogu poslati email. Provjeri SMTP postavke ili pokušaj kasnije.";
}

function resendErrorForClient(json, status) {
  const msg = typeof json?.message === "string" ? json.message.trim() : "";
  const lower = msg.toLowerCase();
  const resendCode = json && (json.statusCode ?? json.status_code);
  // Testni API ključ / sandbox: slanje samo na adresu vlasnika računa — nije problem RESEND_FROM.
  if (
    /only send testing|testing emails to your own|you can only send testing|verify a domain to send to other recipients|your own verified email|send to other recipient|not allowed to send to this recipient/i.test(
      lower
    )
  ) {
    return (
      "Resend u testnom načinu šalje samo na email s kojim si registriran na resend.com. " +
      "Za registracije drugih korisnika: na https://resend.com/domains verificiraj vlastiti domen, " +
      "pa u Render Environment postavi RESEND_FROM=MojPut <noreply@tvoj-verificirani-domen> (bez razmaka oko znaka =)."
    );
  }
  // Ista engleska poruka često spominje «verify/domain» kad zapravo misli na primatelja, ne na FROM.
  if (/recipient|your own (@|email)|only.*you can email|external recipient/i.test(lower) && /verify|domain|not authorized/i.test(lower)) {
    return (
      "Resend ne šalje na ovu adresu dok nemaš verificiran domen za slanje svima (testni način). " +
      "To nije zato što nedostaje RESEND_FROM — bez te varijable već se koristi MojPut <onboarding@resend.dev>. " +
      "Rješenje: https://resend.com/domains → verificiraj domen → RESEND_FROM=MojPut <noreply@tvoj-domen>."
    );
  }
  if (/domain|not valid|verify|not authorized to send/i.test(lower)) {
    return (
      "Resend: adresa «from» mora biti dozvoljena (ili je u odgovoru spomenuta verifikacija domena). " +
      "Ako RESEND_FROM nemaš u Environmentu, već se šalje s MojPut <onboarding@resend.dev>. " +
      "Inače postavi RESEND_FROM=MojPut <onboarding@resend.dev> ili, nakon verifikacije domena, MojPut <noreply@tvojdomen.hr>. " +
      "Točan uzrok vidi u Render logu uz redak [mail] Resend error: (JSON od API-ja)."
    );
  }
  if (/api.key|invalid key|unauthori|forbidden/i.test(lower)) {
    return "Resend: nevažeći ili odbijen API ključ. Provjeri RESEND_API_KEY u Render Environment.";
  }
  if (status === 401) {
    return (
      "Resend je odbio API ključ (HTTP 401). Na Renderu u Environment provjeri RESEND_API_KEY (aktivan ključ s resend.com → API Keys, obično re_…)."
    );
  }
  if (status === 403) {
    if (resendCode === 1010 || /user-agent|access denied/i.test(lower)) {
      return (
        "Resend 403: HTTP zahtjev mora imati User-Agent (Resend blokira inače — kod 1010). " +
        "Ažuriraj server na zadnju verziju MojPuta i redeploy na Renderu. https://resend.com/docs/knowledge-base/403-error-1010"
      );
    }
    return (
      "Resend je odbio zahtjev (HTTP 403). Provjeri RESEND_API_KEY, Domains u Resendu i RESEND_FROM. " +
      (msg ? `API: ${msg}` : "U Render logu traži redak [mail] Resend error: za JSON odgovor.")
    );
  }
  if (msg) return `Resend: ${msg}`;
  return `Ne mogu poslati email (Resend, HTTP ${status}).`;
}

/** Gmail šalje samo s adrese na koju si se autentificirao (SMTP_USER). */
function getVerificationMailFrom() {
  const userRaw = String(process.env.SMTP_USER || "").trim();
  const userLc = userRaw.toLowerCase();
  if (!userRaw) return String(process.env.MAIL_FROM || "").trim() || "MojPut <noreply@mojput.hr>";
  const raw = String(process.env.MAIL_FROM || "").trim();
  const m = raw.match(/^(.+?)\s*<([^>]+@[^>]+)>\s*$/i);
  if (m) {
    const inFrom = m[2].trim().toLowerCase();
    if (inFrom === userLc) return `${m[1].trim()} <${m[2].trim()}>`;
  }
  return `MojPut <${userRaw}>`;
}

async function sendVerificationEmail({ to, username, code }) {
  const subject = "MojPut — potvrdi svoj račun";
  const textBody = `Pozdrav ${username},\n\nTvoj 6-znamenkasti kod za potvrdu MojPut računa:\n\n${code}\n\nOtvori MojPut u pregledniku (npr. mojput na GitHub Pages), idi na stranicu za potvrdu računa i upiši ovaj kod zajedno s email adresom koju si koristio pri registraciji.\n\nKod vrijedi 24 sata. Ako nisi ti tražio registraciju, zanemari ovu poruku.\n`;
  const htmlBody = `
        <p>Pozdrav ${username},</p>
        <p>Tvoj <strong>6-znamenkasti kod</strong> za potvrdu računa na MojPutu:</p>
        <p style="font-size:28px;letter-spacing:0.25em;font-weight:700;font-family:ui-monospace,monospace;color:#0f172a;">${code}</p>
        <p>Otvori MojPut u pregledniku, idi na stranicu za potvrdu računa i upiši gornji kod zajedno s email adresom koju si koristio pri registraciji.</p>
        <p style="font-size:13px;color:#64748b;">Kod vrijedi 24 sata. Ne koristi linkove iz drugih starih poruka — samo ovaj kod u aplikaciji. Ako nisi ti tražio registraciju, zanemari ovu poruku.</p>
      `;

  /** Produkcija (Render): Resend ne koristi Gmail SMTP — samo API ključ. https://resend.com */
  const resendKey = String(process.env.RESEND_API_KEY || "").trim();
  if (resendKey) {
    const from = normalizeResendFrom(process.env.RESEND_FROM);
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          ...RESEND_JSON_HEADERS,
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text: textBody,
          html: htmlBody,
        }),
        signal: AbortSignal.timeout(25000),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.error("[mail] Resend error:", r.status, json);
        return { sent: false, error: resendErrorForClient(json, r.status) };
      }
      console.log("[mail] Resend OK — potvrda poslana na:", to, "| from:", from);
      return { sent: true };
    } catch (err) {
      const name = err?.name || "";
      console.error("[mail] Resend fetch:", name, err?.message || err);
      if (name === "AbortError" || /timeout/i.test(String(err?.message))) {
        return {
          sent: false,
          error: "Slanje maila preko Resenda je isteklo. Pokušaj ponovno; ako se ponavlja, provjeri status Render servisa i resend.com.",
        };
      }
      return {
        sent: false,
        error: "Ne mogu poslati email (Resend). Provjeri RESEND_API_KEY, Render logove i mrežu API-ja do api.resend.com.",
      };
    }
  }

  let transport;
  let isEthereal;
  try {
    const t = await getMailTransport();
    transport = t.transport;
    isEthereal = t.isEthereal;
  } catch {
    return {
      sent: false,
      error:
        "Mail nije konfiguriran. Na Renderu postavi RESEND_API_KEY (preporučeno) ili SMTP_* (Gmail app lozinka).",
    };
  }
  const from = getVerificationMailFrom();
  const replyTo = String(process.env.SMTP_USER || "").trim() || undefined;
  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo,
      subject,
      text: textBody,
      html: htmlBody,
    });
    const previewUrl = isEthereal && nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    if (previewUrl) {
      console.log("[mail] Ethereal preview (email nije stigao korisniku):", previewUrl);
    } else {
      console.log("[mail] OK — potvrda poslana na:", to, "| od:", from, "| id:", info?.messageId || "—");
    }
    return { sent: true, previewUrl: previewUrl || undefined };
  } catch (err) {
    console.error("[mail] failed to send verification email:", err?.message || err);
    if (
      !isEthereal &&
      smtpConnectionLikelyFailed(err) &&
      allowSmtpFallbackToEthereal()
    ) {
      try {
        console.warn(
          "[mail] SMTP (npr. smtp.gmail.com) nedostupan — šaljem preko Ethereal testnog inboxa. Otvori URL u konzoli za pregled «maila».",
        );
        const eth = await getEtherealMailTransport();
        const info = await eth.transport.sendMail({
          from: `MojPut <${eth.etherealUser}>`,
          to,
          subject,
          text: textBody,
          html: htmlBody,
        });
        const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
        if (previewUrl) {
          console.log("[mail] Ethereal preview (stvarni inbox korisnika nije korišten):", previewUrl);
        }
        return { sent: true, previewUrl: previewUrl || undefined };
      } catch (err2) {
        console.error("[mail] Ethereal fallback failed:", err2?.message || err2);
      }
    }
    return { sent: false, error: smtpErrorForClient(err) };
  }
}

async function sendPasswordResetEmail({ to, username, resetUrl }) {
  const subject = "MojPut — nova lozinka";
  const textBody = `Pozdrav ${username},\n\nZatražio/la si poveznicu za novu lozinku na MojPutu. Otvori ovaj link u pregledniku (vrijedi 1 sat):\n\n${resetUrl}\n\nAko nisi ti tražio/la promjenu lozinke, zanemari ovu poruku — tvoja lozinka ostaje ista dok ne otvoriš link.\n`;
  const htmlBody = `
        <p>Pozdrav ${username},</p>
        <p>Zatražio/la si <strong>novu lozinku</strong> za MojPut. Klikni gumb ispod (poveznica vrijedi 1 sat):</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Postavi novu lozinku</a></p>
        <p style="font-size:13px;word-break:break-all;color:#64748b;">Ako gumb ne radi, kopiraj ovu adresu u preglednik:<br/>${resetUrl}</p>
        <p style="font-size:13px;color:#64748b;">Ako nisi ti tražio/la promjenu, zanemari poruku.</p>
      `;

  const resendKey = String(process.env.RESEND_API_KEY || "").trim();
  if (resendKey) {
    const from = normalizeResendFrom(process.env.RESEND_FROM);
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          ...RESEND_JSON_HEADERS,
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text: textBody,
          html: htmlBody,
        }),
        signal: AbortSignal.timeout(25000),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.error("[mail] Resend error (reset):", r.status, json);
        return { sent: false, error: resendErrorForClient(json, r.status) };
      }
      console.log("[mail] Resend OK — reset lozinke poslan na:", to, "| from:", from);
      return { sent: true };
    } catch (err) {
      const name = err?.name || "";
      console.error("[mail] Resend fetch (reset):", name, err?.message || err);
      if (name === "AbortError" || /timeout/i.test(String(err?.message))) {
        return {
          sent: false,
          error: "Slanje maila preko Resenda je isteklo. Pokušaj ponovno.",
        };
      }
      return {
        sent: false,
        error: "Ne mogu poslati email (Resend). Provjeri RESEND_API_KEY i mrežu.",
      };
    }
  }

  let transport;
  let isEthereal;
  try {
    const t = await getMailTransport();
    transport = t.transport;
    isEthereal = t.isEthereal;
  } catch {
    return {
      sent: false,
      error:
        "Mail nije konfiguriran. Na Renderu postavi RESEND_API_KEY (preporučeno) ili SMTP_* (Gmail app lozinka).",
    };
  }
  const from = getVerificationMailFrom();
  const replyTo = String(process.env.SMTP_USER || "").trim() || undefined;
  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo,
      subject,
      text: textBody,
      html: htmlBody,
    });
    const previewUrl = isEthereal && nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    if (previewUrl) {
      console.log("[mail] Ethereal preview (reset lozinke):", previewUrl);
    } else {
      console.log("[mail] OK — reset lozinke poslan na:", to, "| od:", from, "| id:", info?.messageId || "—");
    }
    return { sent: true, previewUrl: previewUrl || undefined };
  } catch (err) {
    console.error("[mail] failed to send password reset email:", err?.message || err);
    if (
      !isEthereal &&
      smtpConnectionLikelyFailed(err) &&
      allowSmtpFallbackToEthereal()
    ) {
      try {
        const eth = await getEtherealMailTransport();
        const info = await eth.transport.sendMail({
          from: `MojPut <${eth.etherealUser}>`,
          to,
          subject,
          text: textBody,
          html: htmlBody,
        });
        const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
        if (previewUrl) {
          console.log("[mail] Ethereal preview (reset):", previewUrl);
        }
        return { sent: true, previewUrl: previewUrl || undefined };
      } catch (err2) {
        console.error("[mail] Ethereal fallback (reset) failed:", err2?.message || err2);
      }
    }
    return { sent: false, error: smtpErrorForClient(err) };
  }
}

/** Šalje adminu mail o novoj povratnoj informaciji (Resend ili SMTP kao kod registracije). */
async function sendFeedbackNotifyEmail({ feedbackId, userEmail, username, message, pagePath }) {
  const to = getFeedbackNotifyEmail();
  if (!isValidEmail(to)) {
    console.warn("[feedback-mail] nevaljana FEEDBACK_NOTIFY_EMAIL:", to);
    return { sent: false, error: "invalid notify address" };
  }

  const subject = `MojPut — povratna informacija #${feedbackId}`;
  const textBody = [
    `Nova povratna informacija (ID ${feedbackId})`,
    "",
    `Korisnik: ${username}`,
    `Email: ${userEmail}`,
    `Stranica: ${pagePath || "(nije poslano)"}`,
    "",
    "Poruka:",
    message,
  ].join("\n");

  const esc = (x) => escapeHtml(String(x));
  const htmlBody = `
        <p><strong>Nova povratna informacija</strong> · ID: ${feedbackId}</p>
        <p><strong>Korisnik:</strong> ${esc(username)}<br/>
        <strong>Email:</strong> <a href="mailto:${esc(userEmail)}">${esc(userEmail)}</a><br/>
        <strong>Stranica:</strong> ${esc(pagePath || "—")}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      `;

  const resendKey = String(process.env.RESEND_API_KEY || "").trim();
  if (resendKey) {
    const from = normalizeResendFrom(process.env.RESEND_FROM);
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          ...RESEND_JSON_HEADERS,
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: userEmail,
          subject,
          text: textBody,
          html: htmlBody,
        }),
        signal: AbortSignal.timeout(25000),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.error("[feedback-mail] Resend:", r.status, json);
        return { sent: false, error: resendErrorForClient(json, r.status) };
      }
      console.log("[feedback-mail] Resend OK →", to);
      return { sent: true };
    } catch (err) {
      const name = err?.name || "";
      console.error("[feedback-mail] Resend:", name, err?.message || err);
      if (name === "AbortError" || /timeout/i.test(String(err?.message))) {
        return {
          sent: false,
          error:
            "Slanje maila preko Resenda je isteklo. Pokušaj ponovno; ako se ponavlja, provjeri Render i resend.com.",
        };
      }
      return { sent: false, error: "Ne mogu poslati email (Resend). Provjeri RESEND_API_KEY i mrežu." };
    }
  }

  let transport;
  let isEthereal;
  try {
    const t = await getMailTransport();
    transport = t.transport;
    isEthereal = t.isEthereal;
  } catch {
    console.warn("[feedback-mail] nema mail transporta — obavijest nije poslana (poruka je u bazi).");
    return { sent: false, error: "no mail" };
  }

  const from = getVerificationMailFrom();
  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo: userEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });
    if (isEthereal && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log("[feedback-mail] Ethereal preview:", previewUrl);
    } else {
      console.log("[feedback-mail] poslano na", to);
    }
    return { sent: true };
  } catch (err) {
    console.error("[feedback-mail] SMTP:", err?.message || err);
    return { sent: false, error: smtpErrorForClient(err) };
  }
}

async function loadUniversitiesData() {
  const dataFile = path.join(__dirname, "universities_data.json");
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  }
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
  return [];
}

function readUniversitiesDataSync() {
  const dataFile = path.join(__dirname, "universities_data.json");
  try {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[universities] failed to read universities_data.json:", err?.message || err);
    return [];
  }
}

async function main() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  /** Prije CORS-a — neki health probeovi šalju zahtjev bez Origin; Render traži brz 200. */
  app.get("/", (_req, res) => res.status(200).type("text/plain").send("ok"));
  app.get("/api/health", (_req, res) => res.status(200).json({ success: true }));

  const db = openDb();
  migrate(db);
  await loadUniversitiesData(); // ensures file exists on first run

  /** Besplatne poruke chata po korisniku i danu (Europe/Zagreb). */
  const CHAT_FREE_DAILY_LIMIT = Math.min(500, Math.max(1, Number(process.env.CHAT_FREE_DAILY_LIMIT || 12) || 12));

  function getChatUsageToday(userId) {
    const day = getChatDayKey();
    const row = db.prepare("SELECT message_count FROM chatbot_daily_usage WHERE user_id = ? AND day = ?").get(userId, day);
    return row ? row.message_count : 0;
  }

  /**
   * Atomski: u jednoj transakciji provjeri limit i povećaj brojač (sprječava paralelne zahtjeve koji zaobiđu 12).
   * Vraća false ako je limit već iscrpljen.
   */
  function reserveChatSlot(userId) {
    const day = getChatDayKey();
    const run = db.transaction(() => {
      const row = db.prepare("SELECT message_count FROM chatbot_daily_usage WHERE user_id = ? AND day = ?").get(userId, day);
      const used = row ? row.message_count : 0;
      if (used >= CHAT_FREE_DAILY_LIMIT) return false;
      db.prepare(
        `INSERT INTO chatbot_daily_usage (user_id, day, message_count) VALUES (?, ?, 1)
         ON CONFLICT(user_id, day) DO UPDATE SET message_count = message_count + 1`,
      ).run(userId, day);
      return true;
    });
    return run();
  }

  /** Ako AI poziv padne nakon rezervacije, vrati jedno mjesto (ne naplaćuj neuspjeli pokušaj). */
  function refundChatSlot(userId) {
    const day = getChatDayKey();
    db.prepare(
      "UPDATE chatbot_daily_usage SET message_count = message_count - 1 WHERE user_id = ? AND day = ? AND message_count > 0",
    ).run(userId, day);
  }

  /**
   * GitHub Pages i API na različitim hostovima — CORS mora točno odgovarati Originu.
   * Više origin-a: CORS_ALLOWED_ORIGINS (zarezom), plus APP_ORIGIN / zadani GH Pages.
   */
  function collectAllowedCorsOrigins() {
    const set = new Set();
    const add = (raw) => {
      let s = String(raw || "")
        .trim()
        .replace(/\/$/, "")
        .replace(/\/MOJPUT$/i, "");
      if (s && /^https:\/\//i.test(s)) set.add(s);
    };
    add(GITHUB_PAGES_ORIGIN);
    add(normalizeAppOrigin());
    add(publicAppOriginFallback());
    add(appOriginForLinks());
    const extra = String(process.env.CORS_ALLOWED_ORIGINS || "");
    for (const part of extra.split(/[,;]+/)) add(part.trim());
    return [...set];
  }

  const productionCorsOrigins = collectAllowedCorsOrigins();
  const productionCorsOptions =
    productionCorsOrigins.length === 1
      ? { origin: productionCorsOrigins[0], credentials: true, allowedHeaders: ["Content-Type", "Accept", "Authorization"] }
      : {
          origin(origin, cb) {
            if (!origin) return cb(null, true);
            if (productionCorsOrigins.includes(origin)) return cb(null, true);
            console.warn("[cors] odbijen origin:", origin, "| dopušteno:", productionCorsOrigins.join(", "));
            cb(null, false);
          },
          credentials: true,
          allowedHeaders: ["Content-Type", "Accept", "Authorization"],
        };

  app.use(
    process.env.NODE_ENV === "production"
      ? cors(productionCorsOptions)
      : cors({ origin: true, credentials: true, allowedHeaders: ["Content-Type", "Accept", "Authorization"] }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body || {};
      const cleanUsername = String(username || "").trim();
      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanPassword = String(password || "");

      if (!cleanUsername || !cleanEmail || !cleanPassword) {
        return res.status(400).json({ success: false, message: "Molimo ispuni sva polja." });
      }
      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ success: false, message: "Unesi valjanu email adresu." });
      }
      if (cleanPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Lozinka mora imati barem 6 znakova." });
      }

      const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);
      if (existingUser) {
        return res.status(409).json({ success: false, message: "Email je već registriran." });
      }

      const passwordHash = bcrypt.hashSync(cleanPassword, 12);
      const verifyToken = crypto.randomBytes(32).toString("hex");
      const plainCode = generateSixDigitCode();
      const verifyCodeHash = hashVerifyCode(plainCode);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(cleanEmail);
      const appBase = appOriginForLinks();
      db.prepare(
        "INSERT INTO pending_registrations (email, username, password_hash, verify_token, verify_code_hash, expires_at, app_base_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run(cleanEmail, cleanUsername, passwordHash, verifyToken, verifyCodeHash, expiresAt, appBase);

      const mail = await sendVerificationEmail({ to: cleanEmail, username: cleanUsername, code: plainCode });

      if (!mail.sent) {
        db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(cleanEmail);
        return res.status(502).json({
          success: false,
          message:
            mail.error ||
            "Ne mogu poslati potvrdu emailom. Provjeri SMTP postavke (Gmail: app lozinka bez razmaka, 2FA uključena).",
        });
      }

      const payload = { success: true, email: cleanEmail, verification_required: true };
      if (mail.previewUrl) payload.email_preview_url = mail.previewUrl;
      if (String(process.env.MOJPUT_E2E || "").trim() === "1") payload.dev_verification_code = plainCode;
      return res.json(payload);
    } catch (err) {
      console.error("[auth/register]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.get("/api/auth/verify", (req, res) => {
    reloadAllEnv();
    let wantRedirect = String(req.query.redirect || "") === "1" || shouldUseVerifyRedirect(req);
    if (String(req.query.redirect || "") === "0") wantRedirect = false;

    if (wantRedirect) {
      return res.redirect(303, frontendVerifyPageUrl(""));
    }
    return res.status(410).json({
      success: false,
      message:
        "Potvrda računa više nije linkom. Otvori stranicu «Potvrda računa» na MojPutu i upiši email te 6-znamenkasti kod iz pisma.",
    });
  });

  app.post("/api/auth/verify-code", (req, res) => {
    try {
      const { email, code } = req.body || {};
      const cleanEmail = String(email || "").trim().toLowerCase();
      const codeNorm = normalizeOtpCode(code);

      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ success: false, message: "Unesi valjanu email adresu." });
      }
      if (codeNorm.length !== 6) {
        return res.status(400).json({ success: false, message: "Kod mora imati točno 6 znamenki." });
      }

      if (!verifyCodeRateLimitOk(cleanEmail)) {
        return res.status(429).json({
          success: false,
          message: "Previše pokušaja. Pričekaj oko 15 minuta ili zatraži novi kod.",
        });
      }

      const pending = db
        .prepare(
          "SELECT email, username, password_hash, expires_at, verify_code_hash FROM pending_registrations WHERE email = ?",
        )
        .get(cleanEmail);

      if (!pending || !pending.verify_code_hash) {
        return res.status(400).json({
          success: false,
          message: "Nema aktivne registracije za taj email ili je kod već iskorišten. Registriraj se ponovno.",
        });
      }

      if (pending.expires_at) {
        const exp = new Date(pending.expires_at).getTime();
        if (Number.isFinite(exp) && exp < Date.now()) {
          db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(cleanEmail);
          return res.status(400).json({
            success: false,
            message: "Kod je istekao. Registriraj se ponovno ili zatraži novi email.",
          });
        }
      }

      if (!bcrypt.compareSync(codeNorm, pending.verify_code_hash)) {
        return res.status(400).json({ success: false, message: "Kod nije točan." });
      }

      finalizePendingRegistration(db, pending);
      return res.json({ success: true });
    } catch (err) {
      console.error("[auth/verify-code]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.post("/api/auth/resend-verification", async (req, res) => {
    const { email } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Unesi valjanu email adresu." });
    }

    const userRow = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);
    if (userRow) {
      return res.json({ success: true });
    }

    const pending = db.prepare("SELECT username FROM pending_registrations WHERE email = ?").get(cleanEmail);
    if (!pending) {
      return res.json({ success: true });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const plainCode = generateSixDigitCode();
    const verifyCodeHash = hashVerifyCode(plainCode);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.prepare(
      "UPDATE pending_registrations SET verify_token = ?, verify_code_hash = ?, expires_at = ?, app_base_url = ? WHERE email = ?",
    ).run(verifyToken, verifyCodeHash, expiresAt, appOriginForLinks(), cleanEmail);

    try {
      const mail = await sendVerificationEmail({ to: cleanEmail, username: pending.username, code: plainCode });
      if (!mail.sent) {
        return res.status(502).json({
          success: false,
          message: mail.error || "Ne mogu poslati email. Pokušaj kasnije.",
        });
      }
      const payload = { success: true };
      if (mail.previewUrl) payload.email_preview_url = mail.previewUrl;
      return res.json(payload);
    } catch {
      return res.status(500).json({ success: false, message: "Ne mogu poslati email. Pokušaj kasnije." });
    }
  });

  const GENERIC_FORGOT_PASSWORD_MSG =
    "Ako ta email adresa ima potvrđen račun na MojPutu, poslali smo poveznicu za novu lozinku. Provjeri pristiglu poštu (i spam).";

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body || {};
      const cleanEmail = String(email || "").trim().toLowerCase();
      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ success: false, message: "Unesi valjanu email adresu." });
      }
      if (!forgotPasswordRateLimitOk(cleanEmail)) {
        return res.status(429).json({
          success: false,
          message: "Previše zahtjeva. Pričekaj nekoliko minuta pa pokušaj ponovno.",
        });
      }

      const userRow = db
        .prepare("SELECT id, username, email_verified FROM users WHERE email = ?")
        .get(cleanEmail);

      if (!userRow || !userRow.email_verified) {
        return res.json({ success: true, message: GENERIC_FORGOT_PASSWORD_MSG });
      }

      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashPasswordResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      db.prepare(
        "UPDATE users SET password_reset_token_hash = ?, password_reset_expires_at = ? WHERE id = ?",
      ).run(tokenHash, expiresAt, userRow.id);

      const resetUrl = frontendResetPasswordPageUrl(rawToken);
      const mail = await sendPasswordResetEmail({
        to: cleanEmail,
        username: userRow.username,
        resetUrl,
      });

      if (!mail.sent) {
        db.prepare(
          "UPDATE users SET password_reset_token_hash = NULL, password_reset_expires_at = NULL WHERE id = ?",
        ).run(userRow.id);
        return res.status(502).json({
          success: false,
          message: mail.error || "Ne mogu poslati email. Pokušaj kasnije.",
        });
      }

      const payload = { success: true, message: GENERIC_FORGOT_PASSWORD_MSG };
      if (mail.previewUrl) payload.email_preview_url = mail.previewUrl;
      return res.json(payload);
    } catch (err) {
      console.error("[auth/forgot-password]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.post("/api/auth/reset-password", (req, res) => {
    try {
      const { token, password } = req.body || {};
      const rawToken = String(token || "").trim();
      const cleanPassword = String(password || "");

      if (!rawToken || !cleanPassword) {
        return res.status(400).json({ success: false, message: "Nedostaje token ili lozinka." });
      }
      if (cleanPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Lozinka mora imati barem 6 znakova." });
      }

      const tokenHash = hashPasswordResetToken(rawToken);
      const row = db
        .prepare("SELECT id, password_reset_expires_at FROM users WHERE password_reset_token_hash = ?")
        .get(tokenHash);

      if (!row) {
        return res.status(400).json({
          success: false,
          message: "Poveznica nije valjana ili je već korištena. Zatraži novu na stranici za prijavu.",
        });
      }

      const exp = row.password_reset_expires_at ? new Date(row.password_reset_expires_at).getTime() : 0;
      if (!exp || Number.isNaN(exp) || exp < Date.now()) {
        db.prepare(
          "UPDATE users SET password_reset_token_hash = NULL, password_reset_expires_at = NULL WHERE id = ?",
        ).run(row.id);
        return res.status(400).json({
          success: false,
          message: "Poveznica je istekla. Zatraži novu poveznicu za lozinku.",
        });
      }

      const passwordHash = bcrypt.hashSync(cleanPassword, 12);
      db.prepare(
        "UPDATE users SET password_hash = ?, password_reset_token_hash = NULL, password_reset_expires_at = NULL WHERE id = ?",
      ).run(passwordHash, row.id);

      return res.json({ success: true, message: "Lozinka je promijenjena. Možeš se prijaviti." });
    } catch (err) {
      console.error("[auth/reset-password]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body || {};
      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanPassword = String(password || "");

      if (!cleanEmail || !cleanPassword) {
        return res.status(400).json({ success: false, message: "Molimo ispuni sva polja." });
      }
      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ success: false, message: "Unesi valjanu email adresu." });
      }

      const row = db
        .prepare(
          "SELECT id, username, email, password_hash, created_at, email_verified, user_type, last_login_at FROM users WHERE email = ?",
        )
        .get(cleanEmail);
      if (!row) {
        const pend = db
          .prepare("SELECT password_hash FROM pending_registrations WHERE email = ?")
          .get(cleanEmail);
        if (pend && bcrypt.compareSync(cleanPassword, pend.password_hash)) {
          return res.status(403).json({
            success: false,
            message: "Račun još nije aktiviran. Upiši 6-znamenkasti kod s pisma na stranici za potvrdu računa.",
            code: "PENDING_VERIFICATION",
          });
        }
        return res.status(401).json({ success: false, message: "Neispravan email ili lozinka." });
      }

      if (!row.password_hash || typeof row.password_hash !== "string") {
        console.error("[auth/login] korisnik bez valjanog password_hash:", row.id);
        return res.status(500).json({ success: false, message: "Račun je nepotpun. Kontaktiraj podršku ili registriraj se ponovno." });
      }

      if (!row.email_verified) {
        return res.status(403).json({
          success: false,
          message: "Potvrdi email prije prijave.",
          code: "EMAIL_NOT_VERIFIED",
        });
      }

      const ok = bcrypt.compareSync(cleanPassword, row.password_hash);
      if (!ok) return res.status(401).json({ success: false, message: "Neispravan email ili lozinka." });

      db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(row.id);
      const fresh = db
        .prepare(
          "SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?",
        )
        .get(row.id);
      const user = userPayloadWithAdminFlag(fresh);
      const token = signToken({ sub: user.id });
      setAuthCookie(res, token, req);
      /** Isti JWT i u JSON-u — preglednici često blokiraju cross-site kolačić (Pages → Render); klijent šalje Authorization. */
      return res.json({ success: true, user, token });
    } catch (err) {
      console.error("[auth/login] greška:", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    clearAuthCookie(res, req);
    return res.json({ success: true });
  });

  app.get("/api/auth/me", authMiddleware(db), (req, res) => {
    return res.json({ success: true, user: userPayloadWithAdminFlag(req.user) });
  });

  /** Rezultat karijernog kviza (2×50) — samo vlasnik računa. */
  app.post("/api/career-quiz/save", authMiddleware(db), (req, res) => {
    try {
      const payload = req.body?.payload;
      if (payload === undefined || payload === null || typeof payload !== "object") {
        return res.status(400).json({ success: false, message: "Nedostaje payload." });
      }
      const str = JSON.stringify(payload);
      if (str.length > 600000) {
        return res.status(400).json({ success: false, message: "Podaci su predugački." });
      }
      const info = db.prepare("INSERT INTO career_quiz_results (user_id, payload) VALUES (?, ?)").run(req.user.id, str);
      return res.json({ success: true, id: Number(info.lastInsertRowid) });
    } catch (err) {
      console.error("[career-quiz/save]", err?.message || err);
      return res.status(500).json({ success: false, message: "Nije moguće spremiti rezultat." });
    }
  });

  app.get("/api/career-quiz/latest", authMiddleware(db), (req, res) => {
    try {
      const row = db
        .prepare(
          "SELECT id, created_at, payload FROM career_quiz_results WHERE user_id = ? ORDER BY id DESC LIMIT 1",
        )
        .get(req.user.id);
      if (!row) return res.json({ success: true, data: null });
      let parsed;
      try {
        parsed = JSON.parse(row.payload);
      } catch {
        return res.status(500).json({ success: false, message: "Oštećeni podaci." });
      }
      return res.json({
        success: true,
        data: { id: row.id, created_at: row.created_at, payload: parsed },
      });
    } catch (err) {
      console.error("[career-quiz/latest]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati rezultat." });
    }
  });

  app.get("/api/career-quiz/history", authMiddleware(db), (req, res) => {
    try {
      const rows = db
        .prepare(
          "SELECT id, created_at, payload FROM career_quiz_results WHERE user_id = ? ORDER BY id DESC LIMIT 50",
        )
        .all(req.user.id);
      const data = rows.map((r) => ({
        id: r.id,
        created_at: r.created_at,
        payload: JSON.parse(r.payload),
      }));
      return res.json({ success: true, data });
    } catch (err) {
      console.error("[career-quiz/history]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati povijest." });
    }
  });

  app.get("/api/me/dashboard", authMiddleware(db), (req, res) => {
    try {
      const uid = req.user.id;
      const forumThreads = Number(
        db.prepare("SELECT COUNT(*) as c FROM forum_conversations WHERE creator_user_id = ?").get(uid).c,
      );
      const forumMessages = Number(db.prepare("SELECT COUNT(*) as c FROM forum_messages WHERE user_id = ?").get(uid).c);
      const savedRows = db
        .prepare(
          "SELECT id, faculty_id, label, city, excerpt, created_at FROM user_saved_faculties WHERE user_id = ? ORDER BY id DESC LIMIT 50",
        )
        .all(uid);
      const quizRows = db
        .prepare(
          "SELECT id, created_at, payload FROM career_quiz_results WHERE user_id = ? ORDER BY id DESC LIMIT 30",
        )
        .all(uid);
      const quizHistory = quizRows.map((r) => ({
        id: r.id,
        created_at: r.created_at,
        payload: JSON.parse(r.payload),
      }));
      const u = db
        .prepare("SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?")
        .get(uid);
      let profilePercent = 25;
      if (u.user_type && ALLOWED_USER_TYPES.has(u.user_type)) profilePercent += 25;
      if (quizHistory.length > 0) profilePercent += 25;
      if (savedRows.length > 0) profilePercent += 25;
      return res.json({
        success: true,
        data: {
          user: userPayloadWithAdminFlag(u),
          activity: {
            forum_threads: forumThreads,
            forum_messages: forumMessages,
            saved_faculties_count: savedRows.length,
            profile_completion_percent: Math.min(100, profilePercent),
          },
          saved_faculties: savedRows,
          quiz_history: quizHistory,
        },
      });
    } catch (err) {
      console.error("[me/dashboard]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati profil." });
    }
  });

  app.patch("/api/me/profile", authMiddleware(db), (req, res) => {
    try {
      const uid = req.user.id;
      const { username, user_type, current_password, new_password } = req.body || {};
      const row = db.prepare("SELECT id, password_hash FROM users WHERE id = ?").get(uid);
      if (!row) return res.status(404).json({ success: false, message: "Korisnik nije pronađen." });

      if (typeof new_password === "string" && new_password.length > 0) {
        const cur = String(current_password || "");
        if (!bcrypt.compareSync(cur, row.password_hash)) {
          return res.status(400).json({ success: false, message: "Trenutna lozinka nije ispravna." });
        }
        if (new_password.length < 8) {
          return res.status(400).json({ success: false, message: "Nova lozinka mora imati barem 8 znakova." });
        }
        const hash = bcrypt.hashSync(new_password, 10);
        db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, uid);
      }

      if (typeof username === "string" && username.trim().length >= 2) {
        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(username.trim().slice(0, 120), uid);
      }
      if (typeof user_type === "string" && ALLOWED_USER_TYPES.has(user_type)) {
        db.prepare("UPDATE users SET user_type = ? WHERE id = ?").run(user_type, uid);
      }

      const u = db
        .prepare("SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?")
        .get(uid);
      return res.json({ success: true, user: userPayloadWithAdminFlag(u) });
    } catch (err) {
      console.error("[me/profile]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ažuriranje nije uspjelo." });
    }
  });

  app.post("/api/me/saved-faculties", authMiddleware(db), (req, res) => {
    try {
      const { faculty_id, label, city, excerpt } = req.body || {};
      const fid = String(faculty_id || "").trim().slice(0, 200);
      const lab = String(label || "").trim().slice(0, 300);
      if (!fid || !lab) return res.status(400).json({ success: false, message: "Nedostaje fakultet." });
      const info = db
        .prepare(
          "INSERT INTO user_saved_faculties (user_id, faculty_id, label, city, excerpt) VALUES (?, ?, ?, ?, ?)",
        )
        .run(
          req.user.id,
          fid,
          lab,
          String(city || "").trim().slice(0, 120) || null,
          String(excerpt || "").trim().slice(0, 500) || null,
        );
      const row = db
        .prepare("SELECT id, faculty_id, label, city, excerpt, created_at FROM user_saved_faculties WHERE id = ?")
        .get(info.lastInsertRowid);
      return res.json({ success: true, data: row });
    } catch (err) {
      if (String(err?.message || "").includes("UNIQUE")) {
        return res.status(409).json({ success: false, message: "Ovaj fakultet je već spremljen." });
      }
      console.error("[saved-faculties]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu spremiti." });
    }
  });

  app.delete("/api/me/saved-faculties/:id", authMiddleware(db), (req, res) => {
    try {
      const id = Number(req.params.id);
      const r = db.prepare("DELETE FROM user_saved_faculties WHERE id = ? AND user_id = ?").run(id, req.user.id);
      if (r.changes === 0) return res.status(404).json({ success: false, message: "Nije pronađeno." });
      return res.json({ success: true });
    } catch (err) {
      console.error("[saved-faculties del]", err?.message || err);
      return res.status(500).json({ success: false, message: "Brisanje nije uspjelo." });
    }
  });

  /** Sažetak za tim održavanja (samo ADMIN_EMAILS). */
  app.get("/api/admin/stats", adminMiddleware(db), (_req, res) => {
    try {
      const one = (sql) => Number(db.prepare(sql).get()?.c ?? 0);
      return res.json({
        success: true,
        data: {
          users_total: one("SELECT COUNT(*) as c FROM users"),
          users_verified: one("SELECT COUNT(*) as c FROM users WHERE email_verified = 1"),
          pending_registrations: one("SELECT COUNT(*) as c FROM pending_registrations"),
          site_feedback: one("SELECT COUNT(*) as c FROM site_feedback"),
          forum_conversations: one("SELECT COUNT(*) as c FROM forum_conversations"),
          forum_messages: one("SELECT COUNT(*) as c FROM forum_messages"),
          forum_likes: one("SELECT COUNT(*) as c FROM forum_likes"),
          registrations_last_7_days: one(
            "SELECT COUNT(*) as c FROM users WHERE datetime(created_at) >= datetime('now', '-7 days')",
          ),
        },
      });
    } catch (err) {
      console.error("[admin/stats]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati statistiku." });
    }
  });

  /** Povratne informacije — samo za prijavljene; nema javnog popisa (samo u bazi za održavanje). */
  app.post("/api/feedback", authMiddleware(db), (req, res) => {
    try {
      const raw = String((req.body || {}).message || "").trim();
      const pageRaw = String((req.body || {}).pagePath || "").trim();
      if (raw.length < 3) {
        return res.status(400).json({ success: false, message: "Poruka je prekratka (barem 3 znaka)." });
      }
      if (raw.length > 4000) {
        return res.status(400).json({ success: false, message: "Poruka je predugačka (najviše 4000 znakova)." });
      }
      const pagePath = pageRaw.length > 500 ? pageRaw.slice(0, 500) : pageRaw;
      const insertInfo = db
        .prepare("INSERT INTO site_feedback (user_id, message, page_path) VALUES (?, ?, ?)")
        .run(req.user.id, raw, pagePath || null);
      const feedbackId = Number(insertInfo.lastInsertRowid);

      res.json({ success: true });

      sendFeedbackNotifyEmail({
        feedbackId,
        userEmail: req.user.email,
        username: req.user.username,
        message: raw,
        pagePath: pagePath || "",
      }).then((mailRes) => {
        if (!mailRes?.sent) {
          console.warn("[feedback-mail] nije poslan:", mailRes?.error || "nepoznato");
        }
      });
    } catch (err) {
      console.error("[feedback]", err?.message || err);
      return res.status(500).json({ success: false, message: "Nije moguće spremiti poruku. Pokušaj kasnije." });
    }
  });

  // Forum
  app.get("/api/forum/conversations", (_req, res) => {
    const rows = db
      .prepare(
        `
        SELECT c.id, c.title, c.description, c.created_at, u.username as creator_username,
               (SELECT COUNT(*) FROM forum_messages m WHERE m.conversation_id = c.id) as message_count
        FROM forum_conversations c
        JOIN users u ON u.id = c.creator_user_id
        ORDER BY c.created_at DESC
      `,
      )
      .all();
    return res.json({ success: true, data: rows });
  });

  app.post("/api/forum/conversations", authMiddleware(db), (req, res) => {
    const { title, description } = req.body || {};
    const cleanTitle = String(title || "").trim();
    const cleanDescription = String(description || "").trim();
    if (!cleanTitle) return res.status(400).json({ success: false, message: "Unesi naziv razgovora!" });

    const info = db
      .prepare("INSERT INTO forum_conversations (title, description, creator_user_id) VALUES (?, ?, ?)")
      .run(cleanTitle, cleanDescription, req.user.id);

    const conv = db
      .prepare(
        `
        SELECT c.id, c.title, c.description, c.created_at, u.username as creator_username,
               (SELECT COUNT(*) FROM forum_messages m WHERE m.conversation_id = c.id) as message_count
        FROM forum_conversations c
        JOIN users u ON u.id = c.creator_user_id
        WHERE c.id = ?
      `,
      )
      .get(info.lastInsertRowid);

    return res.json({ success: true, data: conv });
  });

  app.get("/api/forum/conversations/:id/messages", optionalAuthMiddleware(db), (req, res) => {
    const convId = Number(req.params.id);
    if (!Number.isFinite(convId)) return res.status(400).json({ success: false, message: "Neispravan ID." });

    const rows = db
      .prepare(
        `
        SELECT
          m.id,
          CASE WHEN m.deleted_by_user_at IS NOT NULL THEN '' ELSE m.text END as text,
          m.created_at,
          m.reply_to_id,
          m.deleted_by_user_at,
          u.id as user_id,
          u.username,
          (SELECT COUNT(*) FROM forum_likes l WHERE l.message_id = m.id) as like_count,
          pu.username as reply_to_username,
          CASE
            WHEN m.reply_to_id IS NULL THEN NULL
            WHEN parent.deleted_by_user_at IS NOT NULL THEN '(poruka uklonjena od autora)'
            ELSE SUBSTR(COALESCE(parent.text, ''), 1, 120)
          END as reply_to_snippet
        FROM forum_messages m
        JOIN users u ON u.id = m.user_id
        LEFT JOIN forum_messages parent ON parent.id = m.reply_to_id
        LEFT JOIN users pu ON pu.id = parent.user_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC, m.id ASC
      `,
      )
      .all(convId);

    const userId = req.user?.id;
    const withLiked = rows.map((r) => {
      let userLiked = false;
      if (userId) {
        const like = db.prepare("SELECT 1 FROM forum_likes WHERE user_id = ? AND message_id = ?").get(userId, r.id);
        userLiked = !!like;
      }
      return {
        ...r,
        user_liked: userLiked,
        reply_to_username: r.reply_to_username || null,
        reply_to_snippet: r.reply_to_snippet || null,
      };
    });

    return res.json({ success: true, data: withLiked });
  });

  app.post("/api/forum/conversations/:id/messages", authMiddleware(db), (req, res) => {
    const convId = Number(req.params.id);
    const { text, reply_to_id: replyToRaw } = req.body || {};
    const cleanText = String(text || "").trim();
    const replyToId =
      replyToRaw === undefined || replyToRaw === null || replyToRaw === ""
        ? null
        : Number(replyToRaw);
    if (!Number.isFinite(convId)) return res.status(400).json({ success: false, message: "Neispravan ID." });
    if (!cleanText) return res.status(400).json({ success: false, message: "Poruka ne može biti prazna." });

    const conv = db.prepare("SELECT id FROM forum_conversations WHERE id = ?").get(convId);
    if (!conv) return res.status(404).json({ success: false, message: "Razgovor ne postoji." });

    if (replyToId != null && Number.isFinite(replyToId)) {
      const parent = db
        .prepare("SELECT id, conversation_id FROM forum_messages WHERE id = ?")
        .get(Math.floor(replyToId));
      if (!parent || parent.conversation_id !== convId) {
        return res.status(400).json({ success: false, message: "Odgovor mora biti u istom razgovoru." });
      }
    } else if (replyToId != null && !Number.isFinite(replyToId)) {
      return res.status(400).json({ success: false, message: "Neispravan ID poruke za odgovor." });
    }

    const info = db
      .prepare(
        "INSERT INTO forum_messages (conversation_id, user_id, text, reply_to_id) VALUES (?, ?, ?, ?)",
      )
      .run(convId, req.user.id, cleanText, replyToId != null && Number.isFinite(replyToId) ? Math.floor(replyToId) : null);

    const msg = db
      .prepare(
        `
        SELECT
          m.id,
          m.text,
          m.created_at,
          m.reply_to_id,
          m.deleted_by_user_at,
          u.id as user_id,
          u.username,
          0 as like_count,
          pu.username as reply_to_username,
          CASE
            WHEN m.reply_to_id IS NULL THEN NULL
            WHEN parent.deleted_by_user_at IS NOT NULL THEN '(poruka uklonjena od autora)'
            ELSE SUBSTR(COALESCE(parent.text, ''), 1, 120)
          END as reply_to_snippet
        FROM forum_messages m
        JOIN users u ON u.id = m.user_id
        LEFT JOIN forum_messages parent ON parent.id = m.reply_to_id
        LEFT JOIN users pu ON pu.id = parent.user_id
        WHERE m.id = ?
      `,
      )
      .get(info.lastInsertRowid);

    return res.json({
      success: true,
      data: {
        ...msg,
        user_liked: false,
        reply_to_username: msg.reply_to_username || null,
        reply_to_snippet: msg.reply_to_snippet || null,
      },
    });
  });

  /** Autor može ukloniti poruku s javnog prikaza; red ostaje u bazi (soft delete). */
  app.post("/api/forum/messages/:id/soft-delete", authMiddleware(db), (req, res) => {
    const msgId = Number(req.params.id);
    if (!Number.isFinite(msgId)) return res.status(400).json({ success: false, message: "Neispravan ID." });

    const row = db.prepare("SELECT id, user_id, deleted_by_user_at FROM forum_messages WHERE id = ?").get(msgId);
    if (!row) return res.status(404).json({ success: false, message: "Poruka ne postoji." });
    if (row.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Možeš ukloniti samo vlastite poruke." });
    }
    if (row.deleted_by_user_at) {
      return res.json({ success: true, already: true });
    }

    db.prepare("UPDATE forum_messages SET deleted_by_user_at = datetime('now') WHERE id = ?").run(msgId);
    return res.json({ success: true });
  });

  app.post("/api/forum/messages/:id/like", authMiddleware(db), (req, res) => {
    const msgId = Number(req.params.id);
    if (!Number.isFinite(msgId)) return res.status(400).json({ success: false, message: "Neispravan ID." });

    const msg = db.prepare("SELECT id, conversation_id FROM forum_messages WHERE id = ?").get(msgId);
    if (!msg) return res.status(404).json({ success: false, message: "Poruka ne postoji." });

    const existing = db.prepare("SELECT id FROM forum_likes WHERE user_id = ? AND message_id = ?").get(req.user.id, msgId);
    if (existing) {
      db.prepare("DELETE FROM forum_likes WHERE id = ?").run(existing.id);
      const count = db.prepare("SELECT COUNT(*) as c FROM forum_likes WHERE message_id = ?").get(msgId).c;
      return res.json({ success: true, liked: false, like_count: count });
    }
    db.prepare("INSERT INTO forum_likes (user_id, message_id) VALUES (?, ?)").run(req.user.id, msgId);
    const count = db.prepare("SELECT COUNT(*) as c FROM forum_likes WHERE message_id = ?").get(msgId).c;
    return res.json({ success: true, liked: true, like_count: count });
  });

  app.get("/api/chat/quota", optionalAuthMiddleware(db), (req, res) => {
    const limit = CHAT_FREE_DAILY_LIMIT;
    if (!req.user) {
      return res.json({
        success: true,
        authenticated: false,
        limit,
        used: 0,
        remaining: 0,
      });
    }
    const used = getChatUsageToday(req.user.id);
    let resetsAt = null;
    try {
      resetsAt = getNextZagrebMidnightIso();
    } catch (e) {
      console.error("[api/chat/quota] getNextZagrebMidnightIso:", e?.message || e);
    }
    return res.json({
      success: true,
      authenticated: true,
      limit,
      used,
      remaining: Math.max(0, limit - used),
      ...(resetsAt ? { resetsAt } : {}),
    });
  });

  // AI Chatbot — Prisma (SQLite) + universities_data.json; OpenAI ako je OPENAI_API_KEY
  let chatService;
  try {
    chatService = require(path.join(__dirname, "server", "services", "chatService.cjs"));
  } catch (err) {
    console.error("[chatbot] Učitavanje chatService.cjs nije uspjelo:", err?.message || err);
  }

  if (chatService) {
    app.get("/api/gradovi", async (_req, res) => {
      try {
        const data = await chatService.prisma.grad.findMany({ orderBy: { naziv: "asc" } });
        res.json({ success: true, data });
      } catch (err) {
        console.error("[api/gradovi]", err);
        res.status(500).json({ success: false, message: "Greška pri dohvaćanju gradova." });
      }
    });

    app.get("/api/fakulteti", async (req, res) => {
      try {
        const grad = req.query.grad ? String(req.query.grad).trim() : null;
        const where = grad ? { grad } : {};
        const data = await chatService.prisma.fakultet.findMany({
          where,
          include: { studiji: true },
          orderBy: { naziv: "asc" },
        });
        res.json({ success: true, data });
      } catch (err) {
        console.error("[api/fakulteti]", err);
        res.status(500).json({ success: false, message: "Greška pri dohvaćanju fakulteta." });
      }
    });

    app.get("/api/studiji", async (req, res) => {
      try {
        const fakultetId = req.query.fakultet_id ? Number(req.query.fakultet_id) : null;
        const where = fakultetId ? { fakultet_id: fakultetId } : {};
        const data = await chatService.prisma.studij.findMany({
          where,
          include: { fakultet: true },
          orderBy: { naziv_studija: "asc" },
        });
        res.json({ success: true, data });
      } catch (err) {
        console.error("[api/studiji]", err);
        res.status(500).json({ success: false, message: "Greška pri dohvaćanju studija." });
      }
    });

    app.post("/api/chat", authMiddleware(db), async (req, res) => {
      const { messages } = req.body || {};
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: "Potrebna je poruka." });
      }

      if (!reserveChatSlot(req.user.id)) {
        const used = getChatUsageToday(req.user.id);
        return res.status(403).json({
          success: false,
          code: "CHAT_DAILY_LIMIT",
          message:
            "Iskoristio si dnevni besplatni limit poruka. Za znatno više korištenja chatbota uskoro uvodimo premium plan — prati obavijesti na MojPutu.",
          limit: CHAT_FREE_DAILY_LIMIT,
          used,
        });
      }

      try {
        const response = await chatService.chatLocal(messages);
        res.json({ success: true, content: response });
      } catch (err) {
        refundChatSlot(req.user.id);
        console.error("[api/chat]", err);
        res.status(500).json({
          success: false,
          message: err?.message || "Greška pri generiranju odgovora.",
        });
      }
    });
  } else {
    app.post("/api/chat", authMiddleware(db), (_req, res) => {
      return res.status(503).json({
        success: false,
        message:
          "Chatbot modul nije učitan na serveru. Administrator: provjeri deploy log i da npm postinstall pokrene prisma generate.",
      });
    });
  }

  // Universities API (still available)
  app.get("/api/universities", (_req, res) => {
    const universities = readUniversitiesDataSync();
    res.json({ success: true, count: universities.length, data: universities });
  });

  app.get("/api/universities/:id", (req, res) => {
    const universities = readUniversitiesDataSync();
    const uni = universities.find(
      (u) => String(u.name || "").toLowerCase() === String(req.params.id).toLowerCase(),
    );
    if (uni) return res.json({ success: true, data: uni });
    return res.status(404).json({ success: false, message: "Sveučilište nije pronađeno" });
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (req.path && String(req.path).startsWith("/api")) {
      console.error("[api]", req.method, req.path, err?.message || err);
      return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Interna greška servera." : String(err?.message || err),
      });
    }
    next(err);
  });

  /** Slušaj tek kad su sve rute registrirane (inače rani zahtjevi na /api/* mogu dobiti 404). */
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] API sluša port ${PORT} — spreman (/api/health, /api/chat/quota, …)`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

