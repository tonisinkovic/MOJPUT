/**
 * Sigurno čišćenje samo privremenih auth podataka.
 * Ne briše korisničke profile.
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
db.exec("PRAGMA foreign_keys = ON");
db.close();

console.log("[clear-auth-users] Očišćeno: pending_registrations i forum sadržaj (korisnici nisu dirani) —", dbPath);
