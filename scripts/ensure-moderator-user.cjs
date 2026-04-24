/**
 * Kreira ili ažurira moderator račun (email u ADMIN_EMAILS – vidi server.cjs).
 * Lozinka se zadaje samo u okruženju (ne u repou).
 *
 * Primjer (PowerShell):  $env:MOJPUT_MODERATOR_PASSWORD="tvoja-lozinka"; node scripts/ensure-moderator-user.cjs
 * Primjer (bash):       MOJPUT_MODERATOR_PASSWORD='tvoja-lozinka' node scripts/ensure-moderator-user.cjs
 *
 * PostgreSQL: postavi MOJPUT_DATABASE_URL kao na Renderu.
 * SQLite: lokalno data/mojput.db (ili MOJPUT_DATA_DIR).
 */
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const root = path.join(__dirname, "..");
require("dotenv").config({ path: path.join(root, ".env") });
const local = path.join(root, ".env.local");
if (fs.existsSync(local)) {
  const onRender = String(process.env.RENDER || "").toLowerCase() === "true" || process.env.RENDER === "1";
  require("dotenv").config({ path: local, override: !onRender });
}

const { createAppDb } = require(path.join(root, "server", "appDb.cjs"));

async function main() {
  const email = String(process.env.MOJPUT_MODERATOR_EMAIL || "mojputhr@gmail.com")
    .trim()
    .toLowerCase();
  const username = String(process.env.MOJPUT_MODERATOR_USERNAME || "MojPut").trim().slice(0, 120) || "MojPut";
  const password = String(process.env.MOJPUT_MODERATOR_PASSWORD || "").trim();

  if (!password || password.length < 6) {
    console.error(
      "[ensure-moderator-user] Postavi MOJPUT_MODERATOR_PASSWORD u okruženju (min. 6 znakova). Ne spremaj lozinku u git.",
    );
    process.exit(1);
  }

  const db = await createAppDb();
  await db.migrate();

  const hash = bcrypt.hashSync(password, 12);
  const row = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);

  if (row) {
    await db.prepare("UPDATE users SET password_hash = ?, email_verified = 1 WHERE id = ?").run(hash, row.id);
    console.log("[ensure-moderator-user] Ažurirana lozinka (postojeći račun):", email);
  } else {
    await db
      .prepare(
        "INSERT INTO users (username, email, password_hash, user_type, email_verified, email_verify_token, email_verify_expires_at) VALUES (?, ?, ?, 'srednjoskolac', 1, NULL, NULL)",
      )
      .run(username, email, hash);
    console.log("[ensure-moderator-user] Kreiran račun:", email, "|", username);
  }
  console.log(
    "[ensure-moderator-user] Prijavi se na forumu; u user payloadu is_admin=true jer je email u ADMIN_EMAILS (ili dodaj u Render ADMIN_EMAILS).",
  );
}

main().catch((e) => {
  console.error("[ensure-moderator-user]", e?.message || e);
  process.exit(1);
});
