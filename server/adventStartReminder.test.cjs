const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");
const { optInAdventReminder, sendDueAdventReminders } = require("./adventStartReminder.cjs");

function createDb() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE advent_start_reminders (
      user_id INTEGER PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL,
      sent_at TEXT
    );
  `);
  db.prepare("INSERT INTO users (id, username, email, email_verified) VALUES (1, 'Ana', 'ana@test.com', 1)").run();
  db.prepare("INSERT INTO users (id, username, email, email_verified) VALUES (2, 'Ivo', 'ivo@test.com', 0)").run();
  return db;
}

describe("adventStartReminder", () => {
  it("4. prosinca šalje obavijest samo potvrđenom računu, i samo jednom", async () => {
    const db = createDb();
    await optInAdventReminder(db, { id: 1, email: "ana@test.com" });
    await optInAdventReminder(db, { id: 1, email: "ana@test.com" });
    await optInAdventReminder(db, { id: 2, email: "ivo@test.com" });
    const sentTo = [];
    const early = await sendDueAdventReminders(db, async () => ({ sent: true }), "2026-12-03");
    assert.equal(early.sent, 0);
    const due = await sendDueAdventReminders(
      db,
      async ({ to, subject }) => {
        sentTo.push({ to, subject });
        return { sent: true };
      },
      "2026-12-04",
    );
    assert.equal(due.sent, 1);
    assert.deepEqual(sentTo, [{ to: "ana@test.com", subject: "Sutra kreće MojPut adventska liga" }]);
    const again = await sendDueAdventReminders(db, async () => ({ sent: true }), "2026-12-04");
    assert.equal(again.sent, 0);
    const ana = db.prepare("SELECT sent_at FROM advent_start_reminders WHERE user_id = 1").get();
    const ivo = db.prepare("SELECT sent_at FROM advent_start_reminders WHERE user_id = 2").get();
    assert.ok(ana.sent_at);
    assert.equal(ivo.sent_at, null);
  });
});
