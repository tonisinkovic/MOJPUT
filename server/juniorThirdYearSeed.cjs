"use strict";

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

function metaTag(thread) {
  const city = String(thread.city || "").replace(/[;\n]/g, " ").trim();
  const track = String(thread.track || "ostalo");
  return `<!--mp:city=${city};track=${track};ask=1-->\n${thread.question}`;
}

async function ensureUser(db, hash, username) {
  const email = `seed.${username.toLowerCase()}@mojput.invalid`;
  const existing = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing?.id) return Number(existing.id);
  const info = await db
    .prepare(
      "INSERT INTO users (username, email, password_hash, user_type, email_verified) VALUES (?, ?, ?, 'srednjoskolac', 1)",
    )
    .run(username, email, hash);
  return Number(info.lastInsertRowid);
}

async function seedJuniorThirdYearForum(db) {
  let marked = null;
  try {
    marked = await db.prepare("SELECT 1 FROM app_meta WHERE key = 'junior_third_year_forum_v1'").get();
  } catch {
    return;
  }
  if (marked) return;

  const jsonPath = path.join(__dirname, "..", "src", "data", "junior-forum", "third-year.json");
  if (!fs.existsSync(jsonPath)) {
    console.warn("[seed] junior third-year JSON nije pronađen:", jsonPath);
    return;
  }
  const seed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const threads = Array.isArray(seed.threads) ? seed.threads : [];
  if (threads.length === 0) return;

  const hash = bcrypt.hashSync("mojput-seed-no-login", 8);
  const idByName = new Map();

  const remember = async (username) => {
    if (idByName.has(username)) return idByName.get(username);
    const id = await ensureUser(db, hash, username);
    idByName.set(username, id);
    return id;
  };

  for (const thread of threads) {
    const already = await db.prepare("SELECT id FROM forum_conversations WHERE title = ?").get(thread.title);
    if (already) continue;
    const creatorId = await remember(thread.asker);
    const info = await db
      .prepare(
        "INSERT INTO forum_conversations (title, description, creator_user_id, audience) VALUES (?, ?, ?, 'junior')",
      )
      .run(thread.title, metaTag(thread), creatorId);
    const conversationId = Number(info.lastInsertRowid);
    if (!conversationId) continue;
    await db
      .prepare("INSERT INTO forum_messages (conversation_id, user_id, text) VALUES (?, ?, ?)")
      .run(conversationId, creatorId, thread.question);
    for (const reply of thread.replies || []) {
      const uid = await remember(reply.username);
      await db
        .prepare("INSERT INTO forum_messages (conversation_id, user_id, text) VALUES (?, ?, ?)")
        .run(conversationId, uid, reply.text);
    }
  }

  await db.prepare("INSERT INTO app_meta (key, value) VALUES ('junior_third_year_forum_v1', '1')").run();
  console.log("[seed] junior 3. razred forum: 5 pitanja s odgovorima.");
}

module.exports = { seedJuniorThirdYearForum };
