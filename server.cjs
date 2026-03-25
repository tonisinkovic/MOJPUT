require("dotenv").config({ path: require("path").join(__dirname, ".env") });
require("dotenv").config({ path: require("path").join(__dirname, ".env.local"), override: true });

process.on("uncaughtException", (err) => {
  console.error("[server] uncaughtException:", err?.message || err);
});
process.on("unhandledRejection", (err) => {
  console.error("[server] unhandledRejection:", err?.message || err);
});

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Database = require("better-sqlite3");

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_COOKIE = "mojput_token";
// Vite dev server runs on 8080 and this app uses HashRouter + base "/MOJPUT/"
// Example dev URL: http://localhost:8080/MOJPUT/#/prijava
const APP_ORIGIN = process.env.APP_ORIGIN || "http://localhost:8080/MOJPUT";

/**
 * Javni URL frontenda nakon potvrde (redirect u mailu).
 * APP_ORIGIN u .env ima prednost (npr. GitHub Pages) — ne koristi se localhost iz preglednika.
 * Ako APP_ORIGIN nije postavljen, koristi Origin (lokalni dev) ili fallback.
 */
function publicAppOrigin(req) {
  const fromEnv = String(process.env.APP_ORIGIN || "").trim().replace(/\/$/, "");
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv;
  }
  const origin = req.get("origin");
  if (origin && /^https?:\/\//i.test(origin)) {
    try {
      return `${new URL(origin).origin}/MOJPUT`;
    } catch {
      /* ignore */
    }
  }
  return String(APP_ORIGIN || "http://localhost:8080/MOJPUT").replace(/\/$/, "");
}

/** Javni URL ovog API-ja iz HTTP zahtjeva (debug / drugi endpointi — ne za link u mailu). */
function getApiPublicBase(req) {
  const xfProto = req.get("x-forwarded-proto");
  const proto = (xfProto ? xfProto.split(",")[0].trim() : "") || req.protocol || "http";
  const xfHost = req.get("x-forwarded-host");
  const host = (xfHost ? xfHost.split(",")[0].trim() : "") || req.get("host") || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

/** Učitaj .env pa .env.local (override) — uvijek oba, inače API_PUBLIC_URL može ostati stari iz .env kad .env.local još nema ključ. */
function reloadAllEnv() {
  const root = __dirname;
  require("dotenv").config({ path: path.join(root, ".env") });
  if (fs.existsSync(path.join(root, ".env.local"))) {
    require("dotenv").config({ path: path.join(root, ".env.local"), override: true });
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

/** Javni HTTPS URL (ne localhost) — za redirect i za link u mailu. */
const GH_PAGES_DEFAULT = "https://tonisinkovic.github.io/MOJPUT";

function isPublicHttpsNotLocalhost(url) {
  const s = String(url || "").trim().replace(/\/$/, "");
  if (!s || !/^https:\/\//i.test(s)) return false;
  try {
    const h = new URL(s).hostname.toLowerCase();
    return h !== "localhost" && h !== "127.0.0.1" && h !== "::1";
  } catch {
    return false;
  }
}

/**
 * Baza URL-a u mailu — UVIJEK nešto što mobitel može otvoriti (GitHub Pages).
 * APP_ORIGIN/localhost iz .env ne smije ikad ući u mail (npr. https://localhost:8082).
 * Opcionalno: EMAIL_VERIFY_PAGE_BASE=https://… (samo javni HTTPS).
 */
function getEmailVerifyLinkBase() {
  reloadAllEnv();
  const custom = String(process.env.EMAIL_VERIFY_PAGE_BASE || "").trim().replace(/\/$/, "");
  if (isPublicHttpsNotLocalhost(custom)) return custom;
  const pub = String(process.env.APP_ORIGIN_PUBLIC || "").trim().replace(/\/$/, "");
  if (isPublicHttpsNotLocalhost(pub)) return pub;
  const origin = String(process.env.APP_ORIGIN || "").trim().replace(/\/$/, "");
  if (isPublicHttpsNotLocalhost(origin)) return origin;
  return GH_PAGES_DEFAULT;
}

/** Redirect nakon GET /api/auth/verify?redirect=1 — isto pravilo, nikad localhost. */
function getRedirectAfterVerifyBase() {
  return getEmailVerifyLinkBase();
}

/**
 * Potpuni URL u mailu — GitHub Pages (ili EMAIL_VERIFY_PAGE_BASE). Stranica zove API (VITE_API_URL).
 */
function buildEmailVerifyUrl(_req, verifyToken) {
  const siteBase = getEmailVerifyLinkBase().replace(/\/$/, "");
  const u = `${siteBase}/#/prijava?verify=${encodeURIComponent(verifyToken)}`;
  if (/localhost|127\.0\.0\.1/i.test(u)) {
    console.error("[mail] buildEmailVerifyUrl: neočekivano localhost — forsiram GH Pages.");
    return `${GH_PAGES_DEFAULT.replace(/\/$/, "")}/#/prijava?verify=${encodeURIComponent(verifyToken)}`;
  }
  return u;
}

const hasSmtp = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
);
console.log("[config] SMTP konfiguriran:", hasSmtp, hasSmtp ? "(pravi email)" : "(Ethereal testni inbox)");
if (hasSmtp && process.env.SMTP_USER) {
  console.log("[config] Registracija — potvrda se šalje s adrese:", String(process.env.SMTP_USER).trim());
}
console.log("[config] APP_ORIGIN (.env):", APP_ORIGIN);
console.log("[config] Stvarni redirect nakon potvrde (mobitel):", getRedirectAfterVerifyBase());
{
  const fromDisk = readApiPublicUrlFromDisk();
  const fromEnv = String(process.env.API_PUBLIC_URL || "").trim();
  const shown = fromDisk || fromEnv || "(nema)";
  console.log("[config] API_PUBLIC_URL (za VITE build / direktan API poziv):", shown);
  if (!fromDisk && !fromEnv) {
    console.warn(
      "[config] Nema API_PUBLIC_URL — link u mailu i dalje vodi na GitHub Pages; za potvrdu s mobitela treba VITE_API_URL u buildu = javni API (Render/tunel).",
    );
  }
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
  return db;
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

  try {
    db.prepare("SELECT 1 FROM app_meta LIMIT 1").get();
  } catch {
    db.exec(`CREATE TABLE app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
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

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "14d" });
}

function setAuthCookie(res, token) {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(TOKEN_COOKIE, { path: "/" });
}

function authMiddleware(db) {
  return (req, res, next) => {
    const token = req.cookies?.[TOKEN_COOKIE];
    if (!token) return res.status(401).json({ success: false, message: "Nisi prijavljen." });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db
        .prepare("SELECT id, username, email, created_at, email_verified FROM users WHERE id = ?")
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
    const token = req.cookies?.[TOKEN_COOKIE];
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db
        .prepare("SELECT id, username, email, created_at, email_verified FROM users WHERE id = ?")
        .get(decoded.sub);
      if (user && user.email_verified) req.user = user;
    } catch {
      /* ignore */
    }
    next();
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
    return nodemailer.createTransport({
      service: "gmail",
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
async function getMailTransport() {
  const sync = getMailTransportSync();
  if (sync) return { transport: sync, isEthereal: false };

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
  return { transport, isEthereal: true };
}

function isValidEmail(email) {
  const s = String(email || "").trim();
  if (s.length < 6 || s.length > 254) return false;
  // Basic RFC-ish check: local@domain.tld (we can't prove inbox exists without sending)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
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

async function sendVerificationEmail({ to, username, verifyUrl }) {
  const u = String(verifyUrl || "");
  console.log("[mail] Link za potvrdu (GitHub Pages → prijava zove API):", u);
  const { transport, isEthereal } = await getMailTransport();
  const from = getVerificationMailFrom();
  const replyTo = String(process.env.SMTP_USER || "").trim() || undefined;
  const hrefHtml = String(verifyUrl).replace(/&/g, "&amp;");
  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo,
      subject: "MojPut — potvrdi svoj račun",
      text: `Pozdrav ${username},\n\nZa aktivaciju MojPut računa otvori ovaj link u pregledniku:\n${verifyUrl}\n\nLink vrijedi 24 sata. Ako nisi ti tražio registraciju, zanemari ovu poruku.\n`,
      html: `
        <p>Pozdrav ${username},</p>
        <p>Da bi se prijavio/la na MojPut, potvrdi račun klikom na gumb ili link ispod (otvara se u pregledniku).</p>
        <p><a href="${hrefHtml}" style="display:inline-block;padding:10px 16px;background:#1e293b;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Potvrdi račun</a></p>
        <p style="word-break:break-all;font-size:13px;"><a href="${hrefHtml}">${hrefHtml}</a></p>
        <p style="font-size:13px;color:#64748b;">Link vrijedi 24 sata. Ako nisi ti tražio registraciju, zanemari ovu poruku.</p>
      `,
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
    return { sent: false, error: err?.message || String(err) };
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
  const db = openDb();
  migrate(db);
  await loadUniversitiesData(); // ensures file exists on first run

  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => res.json({ success: true }));

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
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const verifyUrl = buildEmailVerifyUrl(req, verifyToken);

      db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(cleanEmail);
      const appBase = publicAppOrigin(req);
      db.prepare(
        "INSERT INTO pending_registrations (email, username, password_hash, verify_token, expires_at, app_base_url) VALUES (?, ?, ?, ?, ?, ?)",
      ).run(cleanEmail, cleanUsername, passwordHash, verifyToken, expiresAt, appBase);

      const mail = await sendVerificationEmail({ to: cleanEmail, username: cleanUsername, verifyUrl });

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
      if (mail.previewUrl) payload.dev_verification_url = verifyUrl;
      return res.json(payload);
    } catch (err) {
      console.error("[auth/register]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.get("/api/auth/verify", (req, res) => {
    reloadAllEnv();
    const token = String(req.query.token || "").trim();
    const wantRedirect = String(req.query.redirect || "") === "1";
    const siteBase = getRedirectAfterVerifyBase();

    function redirectPrijava(qs) {
      res.redirect(302, `${siteBase}/#/prijava?${qs}`);
    }

    if (!token) {
      if (wantRedirect) return redirectPrijava("verify_error=missing");
      return res.status(400).json({ success: false, message: "Nedostaje token." });
    }

    const pending = db
      .prepare(
        "SELECT email, username, password_hash, expires_at, app_base_url FROM pending_registrations WHERE verify_token = ?",
      )
      .get(token);

    if (!pending) {
      if (wantRedirect) return res.redirect(302, `${siteBase}/#/prijava?verify_error=invalid`);
      return res.status(400).json({ success: false, message: "Link nije važeći ili je već iskorišten." });
    }

    if (pending.expires_at) {
      const exp = new Date(pending.expires_at).getTime();
      if (Number.isFinite(exp) && exp < Date.now()) {
        db.prepare("DELETE FROM pending_registrations WHERE verify_token = ?").run(token);
        if (wantRedirect) return res.redirect(302, `${siteBase}/#/prijava?verify_error=expired`);
        return res.status(400).json({ success: false, message: "Link je istekao. Registriraj se ponovno." });
      }
    }

    const already = db.prepare("SELECT id FROM users WHERE email = ?").get(pending.email);
    if (already) {
      db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(pending.email);
      if (wantRedirect) return res.redirect(302, `${siteBase}/#/prijava?verified=1`);
      return res.json({ success: true });
    }

    db.prepare(
      "INSERT INTO users (username, email, password_hash, email_verified, email_verify_token, email_verify_expires_at) VALUES (?, ?, ?, 1, NULL, NULL)",
    ).run(pending.username, pending.email, pending.password_hash);

    db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(pending.email);
    seedForum(db);

    if (wantRedirect) return res.redirect(302, `${siteBase}/#/prijava?verified=1`);
    return res.json({ success: true });
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
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const verifyUrl = buildEmailVerifyUrl(req, verifyToken);

    db.prepare("UPDATE pending_registrations SET verify_token = ?, expires_at = ?, app_base_url = ? WHERE email = ?").run(
      verifyToken,
      expiresAt,
      publicAppOrigin(req),
      cleanEmail,
    );

    try {
      const mail = await sendVerificationEmail({ to: cleanEmail, username: pending.username, verifyUrl });
      if (!mail.sent) {
        return res.status(502).json({
          success: false,
          message: mail.error || "Ne mogu poslati email. Pokušaj kasnije.",
        });
      }
      const payload = { success: true };
      if (mail.previewUrl) payload.email_preview_url = mail.previewUrl;
      if (mail.previewUrl) payload.dev_verification_url = verifyUrl;
      return res.json(payload);
    } catch {
      return res.status(500).json({ success: false, message: "Ne mogu poslati email. Pokušaj kasnije." });
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
        .prepare("SELECT id, username, email, password_hash, created_at, email_verified FROM users WHERE email = ?")
        .get(cleanEmail);
      if (!row) {
        const pend = db
          .prepare("SELECT password_hash FROM pending_registrations WHERE email = ?")
          .get(cleanEmail);
        if (pend && bcrypt.compareSync(cleanPassword, pend.password_hash)) {
          return res.status(403).json({
            success: false,
            message: "Račun još nije aktiviran. Potvrdi email klikom na link u pismu.",
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

      const user = {
        id: row.id,
        username: row.username,
        email: row.email,
        created_at: row.created_at,
        email_verified: row.email_verified,
      };
      const token = signToken({ sub: user.id });
      setAuthCookie(res, token);
      return res.json({ success: true, user });
    } catch (err) {
      console.error("[auth/login] greška:", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.post("/api/auth/logout", (_req, res) => {
    clearAuthCookie(res);
    return res.json({ success: true });
  });

  app.get("/api/auth/me", authMiddleware(db), (req, res) => {
    return res.json({ success: true, user: req.user });
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
        SELECT m.id, m.text, m.created_at, u.id as user_id, u.username,
               (SELECT COUNT(*) FROM forum_likes l WHERE l.message_id = m.id) as like_count
        FROM forum_messages m
        JOIN users u ON u.id = m.user_id
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
      return { ...r, user_liked: userLiked };
    });

    return res.json({ success: true, data: withLiked });
  });

  app.post("/api/forum/conversations/:id/messages", authMiddleware(db), (req, res) => {
    const convId = Number(req.params.id);
    const { text } = req.body || {};
    const cleanText = String(text || "").trim();
    if (!Number.isFinite(convId)) return res.status(400).json({ success: false, message: "Neispravan ID." });
    if (!cleanText) return res.status(400).json({ success: false, message: "Poruka ne može biti prazna." });

    const conv = db.prepare("SELECT id FROM forum_conversations WHERE id = ?").get(convId);
    if (!conv) return res.status(404).json({ success: false, message: "Razgovor ne postoji." });

    const info = db
      .prepare("INSERT INTO forum_messages (conversation_id, user_id, text) VALUES (?, ?, ?)")
      .run(convId, req.user.id, cleanText);

    const msg = db
      .prepare(
        `
        SELECT m.id, m.text, m.created_at, u.id as user_id, u.username,
               0 as like_count
        FROM forum_messages m
        JOIN users u ON u.id = m.user_id
        WHERE m.id = ?
      `,
      )
      .get(info.lastInsertRowid);

    return res.json({ success: true, data: { ...msg, user_liked: false } });
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

  // AI Chatbot - Fakulteti, Studiji, Gradovi (PostgreSQL + Prisma)
  let chatService;
  try {
    chatService = require(path.join(__dirname, "server", "services", "chatService.cjs"));
  } catch (err) {
    console.warn("[chatbot] Prisma/chat service nije dostupan:", err?.message || err);
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

    app.post("/api/chat", async (req, res) => {
      const { messages } = req.body || {};
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: "Potrebna je poruka." });
      }

      try {
        const response = await chatService.chatLocal(messages);

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        res.write(`data: ${JSON.stringify({ content: response })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (err) {
        console.error("[api/chat]", err);
        res.status(500).json({
          success: false,
          message: err?.message || "Greška pri generiranju odgovora.",
        });
      }
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

  app.listen(PORT, () => {
    console.log(`🚀 API server pokrenut na http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

