/**
 * App baza (korisnici, forum, …): SQLite lokalno ili PostgreSQL (Neon/Supabase) ako je postavljen MOJPUT_DATABASE_URL.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { Pool } = require("pg");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function resolveSqliteDataDir() {
  const raw = String(process.env.MOJPUT_DATA_DIR || "").trim();
  if (!raw) return path.join(__dirname, "..", "data");
  return path.isAbsolute(raw) ? raw : path.join(__dirname, "..", raw);
}

function isPostgresUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /^postgres(ql)?:\/\//i.test(url.trim());
}

function pgSslOption(connectionString) {
  try {
    const u = new URL(connectionString.replace(/^postgresql:/, "postgres:"));
    if (/localhost$|127\.0\.0\.1$/i.test(u.hostname)) return false;
    if (u.searchParams.get("sslmode") === "disable") return false;
  } catch {
    /* ignore */
  }
  return { rejectUnauthorized: false };
}

function getChatDayKey() {
  const { fromZonedTime, toZonedTime } = require("date-fns-tz");
  const { addDays, startOfDay } = require("date-fns");
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

function toPgSql(sql) {
  let i = 0;
  const text = String(sql).replace(/\?/g, () => `$${++i}`);
  return text
    .replace(/datetime\('now'\)/gi, "CURRENT_TIMESTAMP")
    .replace(/datetime\("now"\)/gi, "CURRENT_TIMESTAMP");
}

const INSERT_RETURNING_TABLES = new Set([
  "users",
  "forum_conversations",
  "forum_messages",
  "forum_likes",
  "career_quiz_results",
  "site_feedback",
  "user_saved_faculties",
]);

function needsReturningId(sql) {
  const s = String(sql).trim();
  if (!/^\s*INSERT\s+/i.test(s)) return false;
  if (/ON\s+CONFLICT/i.test(s)) return false;
  if (/RETURNING/i.test(s)) return false;
  const m = /INSERT\s+INTO\s+(\w+)/i.exec(s);
  if (!m) return false;
  return INSERT_RETURNING_TABLES.has(m[1].toLowerCase());
}

function isTruthyEnv(v) {
  const s = String(v || "").trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

function allowsDestructiveUserSql() {
  return isTruthyEnv(process.env.MOJPUT_ALLOW_DESTRUCTIVE_USER_SQL);
}

function normalizeSqlForGuard(sql) {
  return String(sql || "")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--.*$/gm, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function assertNoDestructiveUsersSql(sql, source) {
  if (allowsDestructiveUserSql()) return;
  const normalized = normalizeSqlForGuard(sql);
  if (!normalized) return;
  const destructiveUsersSql =
    /\bDELETE\s+FROM\s+USERS\b/.test(normalized) ||
    /\bTRUNCATE(?:\s+TABLE)?\s+USERS\b/.test(normalized) ||
    /\bDROP\s+TABLE(?:\s+IF\s+EXISTS)?\s+USERS\b/.test(normalized);
  if (!destructiveUsersSql) return;
  throw new Error(
    `[db-guard] Blokiran destruktivan SQL nad users (${source}). ` +
      "Ako je namjerno, privremeno postavi MOJPUT_ALLOW_DESTRUCTIVE_USER_SQL=1.",
  );
}

function migrateSqlite(db) {
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
      user_type TEXT DEFAULT 'srednjoskolac',
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
        user_type TEXT DEFAULT 'srednjoskolac',
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
  if (pendingCols.length && !pendingCols.includes("user_type")) {
    db.exec("ALTER TABLE pending_registrations ADD COLUMN user_type TEXT DEFAULT 'srednjoskolac'");
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
    db.prepare("INSERT INTO app_meta (key, value) VALUES ('pending_registration_flow_v1', '1')").run();
    console.log("[migrate] pending_registration_flow_v1 označen bez brisanja korisnika.");
  }

  const otpMigrated = db.prepare("SELECT 1 FROM app_meta WHERE key = 'email_verify_otp_v1'").get();
  if (!otpMigrated) {
    db.prepare("INSERT INTO app_meta (key, value) VALUES ('email_verify_otp_v1', '1')").run();
    console.log("[migrate] email_verify_otp_v1 označen bez brisanja korisnika.");
  }
}

async function migratePg(pool) {
  const run = async (sql) => {
    await pool.query(sql);
  };

  const ddl = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      email_verify_token TEXT,
      email_verify_expires_at TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_type TEXT DEFAULT 'srednjoskolac',
      last_login_at TEXT,
      password_reset_token_hash TEXT,
      password_reset_expires_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS forum_conversations (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      creator_user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS forum_messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES forum_conversations(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reply_to_id INTEGER REFERENCES forum_messages(id),
      deleted_by_user_at TIMESTAMPTZ
    )`,
    `CREATE TABLE IF NOT EXISTS forum_likes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      message_id INTEGER NOT NULL REFERENCES forum_messages(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, message_id)
    )`,
    `CREATE TABLE IF NOT EXISTS pending_registrations (
      email TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      user_type TEXT DEFAULT 'srednjoskolac',
      verify_token TEXT NOT NULL UNIQUE,
      verify_code_hash TEXT,
      expires_at TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      app_base_url TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS site_feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      message TEXT NOT NULL,
      page_path TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS career_quiz_results (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      payload TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS user_saved_faculties (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      faculty_id TEXT NOT NULL,
      label TEXT NOT NULL,
      city TEXT,
      excerpt TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, faculty_id)
    )`,
    `CREATE TABLE IF NOT EXISTS chatbot_daily_usage (
      user_id INTEGER NOT NULL REFERENCES users(id),
      day TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, day)
    )`,
  ];
  for (const sql of ddl) await run(sql);
  await run("ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'srednjoskolac'");
  await run("ALTER TABLE pending_registrations ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'srednjoskolac'");

  let migrated;
  try {
    migrated = (await pool.query("SELECT 1 FROM app_meta WHERE key = 'pending_registration_flow_v1'")).rows[0];
  } catch {
    migrated = null;
  }
  if (!migrated) {
    await run("INSERT INTO app_meta (key, value) VALUES ('pending_registration_flow_v1', '1')");
    console.log("[migrate:pg] pending_registration_flow_v1 označen bez brisanja korisnika.");
  }

  let otpMigrated;
  try {
    otpMigrated = (await pool.query("SELECT 1 FROM app_meta WHERE key = 'email_verify_otp_v1'")).rows[0];
  } catch {
    otpMigrated = null;
  }
  if (!otpMigrated) {
    await run("INSERT INTO app_meta (key, value) VALUES ('email_verify_otp_v1', '1')");
    console.log("[migrate:pg] email_verify_otp_v1 označen bez brisanja korisnika.");
  }
}

function wrapPrepare(driver) {
  return {
    ...driver,
    prepare(sql) {
      return {
        get: (...params) => driver.get(sql, ...params),
        all: (...params) => driver.all(sql, ...params),
        run: (...params) => driver.run(sql, ...params),
      };
    },
  };
}

function createSqliteDriver(dbPath) {
  ensureDir(path.dirname(dbPath));
  const raw = new Database(dbPath);
  raw.pragma("journal_mode = WAL");
  raw.pragma("foreign_keys = ON");

  const driver = {
    isPostgres: false,
    pool: null,
    _sqlite: raw,
    async migrate() {
      migrateSqlite(raw);
    },
    async get(sql, ...params) {
      return raw.prepare(sql).get(...params);
    },
    async all(sql, ...params) {
      return raw.prepare(sql).all(...params);
    },
    async run(sql, ...params) {
      assertNoDestructiveUsersSql(sql, "sqlite.run");
      const info = raw.prepare(sql).run(...params);
      return { lastInsertRowid: Number(info.lastInsertRowid) || 0, changes: info.changes };
    },
    async exec(sql) {
      assertNoDestructiveUsersSql(sql, "sqlite.exec");
      raw.exec(sql);
    },
    async getChatUsageToday(userId) {
      const day = getChatDayKey();
      const row = raw.prepare("SELECT message_count FROM chatbot_daily_usage WHERE user_id = ? AND day = ?").get(userId, day);
      return row ? row.message_count : 0;
    },
    async reserveChatSlot(userId, limit) {
      const day = getChatDayKey();
      const txn = raw.transaction(() => {
        const row = raw.prepare("SELECT message_count FROM chatbot_daily_usage WHERE user_id = ? AND day = ?").get(userId, day);
        const used = row ? row.message_count : 0;
        if (used >= limit) return false;
        raw
          .prepare(
            `INSERT INTO chatbot_daily_usage (user_id, day, message_count) VALUES (?, ?, 1)
             ON CONFLICT(user_id, day) DO UPDATE SET message_count = message_count + 1`,
          )
          .run(userId, day);
        return true;
      });
      return txn();
    },
    async refundChatSlot(userId) {
      const day = getChatDayKey();
      raw
        .prepare(
          "UPDATE chatbot_daily_usage SET message_count = message_count - 1 WHERE user_id = ? AND day = ? AND message_count > 0",
        )
        .run(userId, day);
    },
  };

  return wrapPrepare(driver);
}

function createPgDriver(connectionString) {
  const ssl = pgSslOption(connectionString);
  const pool = new Pool({
    connectionString,
    max: 10,
    ...(ssl ? { ssl } : {}),
  });

  const driver = {
    isPostgres: true,
    pool,
    async migrate() {
      await migratePg(pool);
    },
    async get(sql, ...params) {
      const text = toPgSql(sql);
      const r = await pool.query(text, params);
      return r.rows[0] ?? null;
    },
    async all(sql, ...params) {
      const text = toPgSql(sql);
      const r = await pool.query(text, params);
      return r.rows;
    },
    async run(sql, ...params) {
      assertNoDestructiveUsersSql(sql, "postgres.run");
      let text = toPgSql(sql);
      if (needsReturningId(sql)) {
        text = `${text.trim()} RETURNING id`;
      }
      const r = await pool.query(text, params);
      const id = r.rows[0]?.id;
      return {
        lastInsertRowid: id != null ? Number(id) : 0,
        changes: r.rowCount ?? 0,
      };
    },
    async exec(sql) {
      assertNoDestructiveUsersSql(sql, "postgres.exec");
      await pool.query(toPgSql(sql));
    },
    async getChatUsageToday(userId) {
      const day = getChatDayKey();
      const r = await pool.query(
        toPgSql("SELECT message_count FROM chatbot_daily_usage WHERE user_id = ? AND day = ?"),
        [userId, day],
      );
      const row = r.rows[0];
      return row ? Number(row.message_count) : 0;
    },
    async reserveChatSlot(userId, limit) {
      const day = getChatDayKey();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const cur = await client.query(
          toPgSql("SELECT message_count FROM chatbot_daily_usage WHERE user_id = ? AND day = ? FOR UPDATE"),
          [userId, day],
        );
        const used = cur.rows[0] ? Number(cur.rows[0].message_count) : 0;
        if (used >= limit) {
          await client.query("ROLLBACK");
          return false;
        }
        await client.query(
          toPgSql(`INSERT INTO chatbot_daily_usage (user_id, day, message_count) VALUES (?, ?, 1)
            ON CONFLICT (user_id, day) DO UPDATE SET message_count = chatbot_daily_usage.message_count + 1`),
          [userId, day],
        );
        await client.query("COMMIT");
        return true;
      } catch (e) {
        try {
          await client.query("ROLLBACK");
        } catch {
          /* ignore */
        }
        throw e;
      } finally {
        client.release();
      }
    },
    async refundChatSlot(userId) {
      const day = getChatDayKey();
      await pool.query(
        toPgSql(
          "UPDATE chatbot_daily_usage SET message_count = message_count - 1 WHERE user_id = ? AND day = ? AND message_count > 0",
        ),
        [userId, day],
      );
    },
  };

  return wrapPrepare(driver);
}

async function createAppDb() {
  const pgUrl = String(process.env.MOJPUT_DATABASE_URL || "").trim();
  if (isPostgresUrl(pgUrl)) {
    console.log("[config] App DB: PostgreSQL (MOJPUT_DATABASE_URL)");
    return createPgDriver(pgUrl);
  }
  const dataDir = resolveSqliteDataDir();
  ensureDir(dataDir);
  const dbPath = path.join(dataDir, "mojput.db");
  console.log("[config] App DB: SQLite", dbPath);
  return createSqliteDriver(dbPath);
}

async function seedForum(db) {
  const row = await db.prepare("SELECT COUNT(*) as c FROM forum_conversations").get();
  const count = Number(row?.c ?? 0);
  if (count > 0) return;

  const anyUser = await db.prepare("SELECT id FROM users ORDER BY id ASC LIMIT 1").get();
  if (!anyUser) return;

  await db.prepare("INSERT INTO forum_conversations (title, description, creator_user_id) VALUES (?, ?, ?)").run(
    "Najbolji fakulteti za informatiku",
    "Diskusija o fakultetima sa najboljim IT programima",
    anyUser.id,
  );
  await db.prepare("INSERT INTO forum_conversations (title, description, creator_user_id) VALUES (?, ?, ?)").run(
    "Iskustva sa maturom",
    "Savjeti i trikovi za maturu",
    anyUser.id,
  );
}

async function finalizePendingRegistration(db, pending) {
  const already = await db.prepare("SELECT id FROM users WHERE email = ?").get(pending.email);
  if (already) {
    await db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(pending.email);
    return { alreadyUser: true };
  }
  await db
    .prepare(
      "INSERT INTO users (username, email, password_hash, user_type, email_verified, email_verify_token, email_verify_expires_at) VALUES (?, ?, ?, ?, 1, NULL, NULL)",
    )
    .run(pending.username, pending.email, pending.password_hash, pending.user_type || "srednjoskolac");
  await db.prepare("DELETE FROM pending_registrations WHERE email = ?").run(pending.email);
  await seedForum(db);
  return { alreadyUser: false };
}

module.exports = {
  createAppDb,
  seedForum,
  finalizePendingRegistration,
  getChatDayKey,
};
