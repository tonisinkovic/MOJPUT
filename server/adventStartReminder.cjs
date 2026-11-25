"use strict";

const REMINDER_DAY = "2026-12-04";

function isMissingTableError(err) {
  const msg = String(err?.message || err || "").toLowerCase();
  return msg.includes("no such table") || msg.includes("does not exist") || msg.includes("undefined table");
}

function reminderMail(username) {
  const name = String(username || "").trim() || "hej";
  const link = "https://mojput.com/adventska-liga";
  const subject = "Sutra kreće MojPut adventska liga";
  const text = `Pozdrav ${name},\n\nSutra, 5. prosinca 2026. u 10:00, kreće adventska liga.\n\nUđi i riješi prvih 10 pitanja. Tko propusti prvi dan, taj dan nema na ljestvici.\n\n${link}\n`;
  const html = `<p>Pozdrav ${name},</p><p><strong>Sutra, 5. prosinca 2026. u 10:00</strong>, kreće adventska liga.</p><p>Uđi i riješi prvih 10 pitanja. Tko propusti prvi dan, taj dan nema na ljestvici.</p><p><a href="${link}">${link}</a></p>`;
  return { subject, text, html };
}

async function getAdventReminderStatus(db, userId) {
  try {
    const row = await db.prepare("SELECT user_id, sent_at FROM advent_start_reminders WHERE user_id = ?").get(userId);
    if (!row) return { optedIn: false, sent: false };
    return { optedIn: true, sent: Boolean(row.sent_at) };
  } catch (err) {
    if (isMissingTableError(err)) return { optedIn: false, sent: false };
    throw err;
  }
}

async function optInAdventReminder(db, user) {
  const userId = Number(user?.id);
  const email = String(user?.email || "").trim().toLowerCase();
  if (!Number.isInteger(userId) || userId <= 0 || !email) {
    const err = new Error("Prijava nije spremna za podsjetnik.");
    err.status = 400;
    throw err;
  }
  const existing = await getAdventReminderStatus(db, userId);
  if (existing.optedIn) return existing;
  await db
    .prepare("INSERT INTO advent_start_reminders (user_id, email, created_at) VALUES (?, ?, ?)")
    .run(userId, email, new Date().toISOString());
  return { optedIn: true, sent: false };
}

async function sendDueAdventReminders(db, sendEmail, todayKey) {
  if (String(todayKey || "") !== REMINDER_DAY) return { sent: 0, skipped: 0 };
  let rows;
  try {
    rows = await db
      .prepare(
        `SELECT r.user_id, u.email, u.username, u.email_verified
         FROM advent_start_reminders r
         INNER JOIN users u ON u.id = r.user_id
         WHERE r.sent_at IS NULL`,
      )
      .all();
  } catch (err) {
    if (isMissingTableError(err)) return { sent: 0, skipped: 0 };
    throw err;
  }
  let sent = 0;
  let skipped = 0;
  for (const row of rows || []) {
    if (!row.email_verified || !row.email) {
      skipped += 1;
      continue;
    }
    const mail = reminderMail(row.username);
    const result = await sendEmail({ to: row.email, ...mail });
    if (!result?.sent) {
      skipped += 1;
      continue;
    }
    await db.prepare("UPDATE advent_start_reminders SET sent_at = ? WHERE user_id = ?").run(new Date().toISOString(), row.user_id);
    sent += 1;
  }
  return { sent, skipped };
}

module.exports = {
  REMINDER_DAY,
  reminderMail,
  getAdventReminderStatus,
  optInAdventReminder,
  sendDueAdventReminders,
};
