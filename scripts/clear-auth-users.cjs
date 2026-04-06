/**
 * Briše sve korisnike, nepotvrđene prijave i forum (SQLite ovisi o users).
 * Zaustavi server prije pokretanja ili će WAL možda zaključati datoteku.
 */
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "data", "mojput.db");
const db = new Database(dbPath);

db.exec("PRAGMA foreign_keys = OFF");
db.exec("DELETE FROM forum_likes");
db.exec("DELETE FROM forum_messages");
db.exec("DELETE FROM forum_conversations");
db.exec("DELETE FROM pending_registrations");
db.exec("DELETE FROM users");
db.exec("PRAGMA foreign_keys = ON");
db.close();

console.log("[clear-auth-users] Očišćeno: users, pending_registrations, forum —", dbPath);
