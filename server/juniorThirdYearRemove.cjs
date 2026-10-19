"use strict";

/**
 * Jednokratno uklanja izmišljene teme "trećeg razreda" i njihove seed račune.
 * Ti su tekstovi bili u prvom licu, vezani uz prave škole, i u forumu su izgledali
 * kao živi učenici. Oznaka "primjer" to ne popravlja. Račune ne brišemo (zaštita
 * nad tablicom users) — gase se lozinka i nadimak, poruke i prazne teme se brišu.
 * Prave tuđe poruke u istoj temi ostaju.
 */

const REMOVED_KEY = "junior_third_year_forum_removed_v1";
const DEAD_PASSWORD = "!uklonjen-urednicki-seed";

const EDITORIAL_USERNAMES = [
  "OsmakEna",
  "Luka8",
  "IvanaUpis",
  "Petra8",
  "RoditeljPita",
  "Marta3Med",
  "Filip3Teh",
  "Maja3Gim",
  "Tomo3Med",
  "Ena3Teh",
  "Karlo3Gim",
  "Iva3Med",
  "Marko3Teh",
  "Sara3Gim",
  "Petra3Med",
  "Luka3Teh",
  "Nina3Gim",
  "Ana3Med",
  "Dino3Gim",
  "Ivan3Gim",
];

const EDITORIAL_SEED_EMAILS = EDITORIAL_USERNAMES.map(
  (username) => `seed.${username.toLowerCase()}@mojput.invalid`,
);

function placeholders(ids) {
  return ids.map(() => "?").join(", ");
}

function missingSchema(err) {
  const msg = String(err?.message || err);
  return /no such table|no such column|does not exist/i.test(msg);
}

async function deleteWhereIn(db, table, column, ids) {
  if (!ids.length) return 0;
  try {
    const info = await db
      .prepare(`DELETE FROM ${table} WHERE ${column} IN (${placeholders(ids)})`)
      .run(...ids);
    return Number(info?.changes ?? 0);
  } catch (err) {
    if (missingSchema(err)) return 0;
    throw err;
  }
}

async function removeJuniorThirdYearForum(db) {
  let marked = null;
  try {
    marked = await db.prepare("SELECT 1 AS ok FROM app_meta WHERE key = ?").get(REMOVED_KEY);
  } catch {
    return { removed: false, reason: "no-meta" };
  }
  if (marked) return { removed: false, reason: "already" };

  const users = await db
    .prepare(`SELECT id, email FROM users WHERE email IN (${placeholders(EDITORIAL_SEED_EMAILS)})`)
    .all(...EDITORIAL_SEED_EMAILS);
  const userIds = users.map((row) => Number(row.id)).filter((id) => Number.isFinite(id));

  let messagesRemoved = 0;
  let threadsRemoved = 0;

  if (userIds.length) {
    const messages = await db
      .prepare(`SELECT id FROM forum_messages WHERE user_id IN (${placeholders(userIds)})`)
      .all(...userIds);
    const messageIds = messages.map((row) => Number(row.id)).filter((id) => Number.isFinite(id));

    await deleteWhereIn(db, "forum_likes", "user_id", userIds);
    await deleteWhereIn(db, "forum_likes", "message_id", messageIds);
    await deleteWhereIn(db, "forum_reports", "reporter_user_id", userIds);
    await deleteWhereIn(db, "forum_reports", "message_id", messageIds);

    if (messageIds.length) {
      try {
        await db
          .prepare(`UPDATE forum_messages SET reply_to_id = NULL WHERE reply_to_id IN (${placeholders(messageIds)})`)
          .run(...messageIds);
      } catch (err) {
        if (!missingSchema(err)) throw err;
      }
      messagesRemoved = await deleteWhereIn(db, "forum_messages", "id", messageIds);
    }

    const emptyThreads = await db
      .prepare(
        `SELECT id FROM forum_conversations
         WHERE creator_user_id IN (${placeholders(userIds)})
           AND id NOT IN (SELECT conversation_id FROM forum_messages)`,
      )
      .all(...userIds);
    threadsRemoved = await deleteWhereIn(
      db,
      "forum_conversations",
      "id",
      emptyThreads.map((row) => Number(row.id)),
    );

    for (const id of userIds) {
      await db
        .prepare(
          `UPDATE users
           SET username = ?,
               password_hash = ?,
               email_verified = 0,
               email_verify_token = NULL,
               email_verify_expires_at = NULL
           WHERE id = ? AND email IN (${placeholders(EDITORIAL_SEED_EMAILS)})`,
        )
        .run(`uklonjeni-primjer-${id}`, DEAD_PASSWORD, id, ...EDITORIAL_SEED_EMAILS);
    }
  }

  await db.prepare("INSERT INTO app_meta (key, value) VALUES (?, '1')").run(REMOVED_KEY);
  if (userIds.length) {
    console.log(
      `[forum] uklonjen izmišljeni 3. razred: ${userIds.length} računa, ${messagesRemoved} poruka, ${threadsRemoved} tema.`,
    );
  }
  return { removed: true, users: userIds.length, messages: messagesRemoved, threads: threadsRemoved };
}

module.exports = {
  EDITORIAL_SEED_EMAILS,
  REMOVED_KEY,
  removeJuniorThirdYearForum,
};
