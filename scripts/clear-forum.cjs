/**
 * Briše sve forum lajkove, poruke i razgovore. Korisnici i ostali podaci ostaju.
 * Zaustavi API server prije pokretanja (SQLite: WAL zaključak).
 */
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
require("dotenv").config({ path: path.join(root, ".env") });
const local = path.join(root, ".env.local");
if (fs.existsSync(local)) {
  const onRender = String(process.env.RENDER || "").toLowerCase() === "true" || process.env.RENDER === "1";
  require("dotenv").config({ path: local, override: !onRender });
}

function isPostgresUrl(url) {
  return url && typeof url === "string" && /^postgres(ql)?:\/\//i.test(url.trim());
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

async function clearPostgres(connectionString) {
  const { Pool } = require("pg");
  const ssl = pgSslOption(connectionString);
  const pool = new Pool({ connectionString, max: 2, ...(ssl ? { ssl } : {}) });
  try {
    await pool.query("DELETE FROM forum_likes");
    await pool.query("DELETE FROM forum_messages");
    await pool.query("DELETE FROM forum_conversations");
  } finally {
    await pool.end();
  }
  console.log("[clear-forum] PostgreSQL: uklonjeni svi forum razgovori, poruke i lajkovi.");
}

function clearSqlite() {
  const rawDir = String(process.env.MOJPUT_DATA_DIR || "").trim();
  const dataDir = rawDir
    ? path.isAbsolute(rawDir)
      ? rawDir
      : path.join(root, rawDir)
    : path.join(root, "data");
  const dbPath = path.join(dataDir, "mojput.db");
  if (!fs.existsSync(dbPath)) {
    console.error("[clear-forum] Nema baze:", dbPath);
    process.exit(1);
  }
  const Database = require("better-sqlite3");
  const db = new Database(dbPath);
  try {
    db.exec("PRAGMA foreign_keys = OFF");
    db.exec("DELETE FROM forum_likes");
    db.exec("DELETE FROM forum_messages");
    db.exec("DELETE FROM forum_conversations");
    db.exec("PRAGMA foreign_keys = ON");
  } finally {
    db.close();
  }
  console.log("[clear-forum] SQLite: uklonjeni svi forum razgovori, poruke i lajkovi —", dbPath);
}

async function main() {
  const pgUrl = String(process.env.MOJPUT_DATABASE_URL || "").trim();
  if (isPostgresUrl(pgUrl)) {
    await clearPostgres(pgUrl);
    return;
  }
  clearSqlite();
}

main().catch((e) => {
  console.error("[clear-forum]", e?.message || e);
  process.exit(1);
});
