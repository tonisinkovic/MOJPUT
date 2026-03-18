require("dotenv").config({ path: require("path").join(__dirname, ".env") });

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

const hasSmtp = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
);
console.log("[config] SMTP konfiguriran:", hasSmtp, hasSmtp ? "(pravi email)" : "(Ethereal testni inbox)");
console.log("[config] APP_ORIGIN:", APP_ORIGIN);

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
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

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

async function sendVerificationEmail({ to, username, verifyUrl }) {
  const { transport, isEthereal } = await getMailTransport();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "MojPut <noreply@mojput.hr>";
  try {
    const info = await transport.sendMail({
      from,
      to,
      subject: "MojPut - Potvrda email adrese",
      text: `Pozdrav ${username},\n\nKlikni na link za potvrdu računa:\n${verifyUrl}\n\nAko nisi ti napravio račun, ignoriraj ovu poruku.\n`,
      html: `
        <p>Pozdrav ${username},</p>
        <p>Klikni na link za potvrdu računa:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Ako nisi ti napravio račun, ignoriraj ovu poruku.</p>
      `,
    });
    const previewUrl = isEthereal && nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    if (previewUrl) {
      console.log("[mail] Ethereal preview (email nije stigao korisniku):", previewUrl);
    } else {
      console.log("[mail] verification email sent:", { to, messageId: info?.messageId });
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
  app.disable("x-powered-by");
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => res.json({ success: true }));

  // Auth
  app.post("/api/auth/register", async (req, res) => {
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

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: "Email je već registriran." });
    }

    const passwordHash = bcrypt.hashSync(cleanPassword, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const info = db
      .prepare(
        "INSERT INTO users (username, email, password_hash, email_verified, email_verify_token, email_verify_expires_at) VALUES (?, ?, ?, 0, ?, ?)",
      )
      .run(cleanUsername, cleanEmail, passwordHash, verifyToken, expiresAt);
    const userId = info.lastInsertRowid;

    const user = db
      .prepare("SELECT id, username, email, created_at, email_verified FROM users WHERE id = ?")
      .get(userId);

    seedForum(db);

    const verifyUrl = `${APP_ORIGIN}/#/prijava?verify=${verifyToken}`;
    const mail = await sendVerificationEmail({ to: cleanEmail, username: cleanUsername, verifyUrl });

    if (!mail.sent) {
      db.prepare("DELETE FROM users WHERE id = ?").run(userId);
      return res.status(502).json({
        success: false,
        message:
          "Ne mogu poslati potvrdu emailom. Provjeri SMTP postavke ili pokušaj ponovno.",
      });
    }

    const payload = { success: true, user, verification_required: true };
    if (mail.previewUrl) payload.email_preview_url = mail.previewUrl;
    if (mail.previewUrl) payload.dev_verification_url = verifyUrl;
    return res.json(payload);
  });

  app.get("/api/auth/verify", (req, res) => {
    const token = String(req.query.token || "").trim();
    if (!token) return res.status(400).json({ success: false, message: "Nedostaje token." });

    const row = db
      .prepare(
        "SELECT id, email_verified, email_verify_expires_at FROM users WHERE email_verify_token = ?",
      )
      .get(token);

    if (!row) return res.status(400).json({ success: false, message: "Link nije važeći." });
    if (row.email_verified) return res.json({ success: true });

    if (row.email_verify_expires_at) {
      const exp = new Date(row.email_verify_expires_at).getTime();
      if (Number.isFinite(exp) && exp < Date.now()) {
        return res.status(400).json({ success: false, message: "Link je istekao. Registriraj se ponovno." });
      }
    }

    db.prepare(
      "UPDATE users SET email_verified = 1, email_verify_token = NULL, email_verify_expires_at = NULL WHERE id = ?",
    ).run(row.id);

    return res.json({ success: true });
  });

  app.post("/api/auth/resend-verification", async (req, res) => {
    const { email } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Unesi valjanu email adresu." });
    }

    const row = db
      .prepare("SELECT id, username, email_verified FROM users WHERE email = ?")
      .get(cleanEmail);
    if (!row) {
      return res.json({ success: true });
    }
    if (row.email_verified) return res.json({ success: true });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    db.prepare("UPDATE users SET email_verify_token = ?, email_verify_expires_at = ? WHERE id = ?").run(
      verifyToken,
      expiresAt,
      row.id,
    );

    const verifyUrl = `${APP_ORIGIN}/#/prijava?verify=${verifyToken}`;
    try {
      const mail = await sendVerificationEmail({ to: cleanEmail, username: row.username, verifyUrl });
      const payload = { success: true };
      if (mail.previewUrl) payload.email_preview_url = mail.previewUrl;
      if (mail.previewUrl) payload.dev_verification_url = verifyUrl;
      return res.json(payload);
    } catch {
      return res.status(500).json({ success: false, message: "Ne mogu poslati email. Pokušaj kasnije." });
    }
  });

  app.post("/api/auth/login", (req, res) => {
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
    if (!row) return res.status(401).json({ success: false, message: "Neispravan email ili lozinka." });

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

  app.listen(PORT, () => {
    console.log(`🚀 API server pokrenut na http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

