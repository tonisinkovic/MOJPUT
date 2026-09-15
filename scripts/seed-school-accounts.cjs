/**
 * Idempotentno kreira SCHOOL račune za sve škole iz src/data/highSchools.ts.
 * Početne lozinke ispisuje samo za NOVE račune (hash ide u bazu).
 *
 * Pokretanje: node scripts/seed-school-accounts.cjs
 */
"use strict";

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { createAppDb } = require("../server/appDb.cjs");
const { loadHighSchools } = require("../server/schoolCatalog.cjs");
const { generateSchoolPassword, credentialsCsv, credentialsHtml } = require("../server/schoolPasswords.cjs");
const { credentialsDir, SCHOOL_INTERNAL_EMAIL_DOMAIN } = require("../server/schoolCms.cjs");

function schoolUsername(slug, highSchoolId) {
  const base = String(slug || highSchoolId)
    .toLowerCase()
    .slice(0, 60);
  return base || highSchoolId;
}

function pickEmail(school, usedEmails) {
  const candidates = Array.isArray(school.emails) ? school.emails : [];
  for (const raw of candidates) {
    const email = String(raw || "")
      .trim()
      .toLowerCase();
    if (!email || !email.includes("@")) continue;
    if (usedEmails.has(email)) continue;
    return email;
  }
  return `${String(school.id).toLowerCase()}@${SCHOOL_INTERNAL_EMAIL_DOMAIN}`;
}

async function main() {
  const db = await createAppDb();
  await db.migrate();
  const { schools } = loadHighSchools();
  const usedEmails = new Set(
    (await db.prepare("SELECT lower(email) AS e FROM users").all()).map((r) => r.e),
  );
  const usedUsernames = new Set(
    (await db.prepare("SELECT lower(username) AS u FROM users").all()).map((r) => r.u),
  );

  const created = [];
  let skipped = 0;

  for (const school of schools) {
    const existing = await db.prepare("SELECT id FROM school_accounts WHERE high_school_id = ?").get(school.id);
    if (existing) {
      skipped += 1;
      continue;
    }

    let username = schoolUsername(school.slug, school.id);
    let n = 2;
    while (usedUsernames.has(username)) {
      username = `${schoolUsername(school.slug, school.id)}-${n}`;
      n += 1;
    }
    const email = pickEmail(school, usedEmails);
    const password = generateSchoolPassword();
    const passwordHash = bcrypt.hashSync(password, 12);

    await db
      .prepare(
        "INSERT INTO users (username, email, password_hash, user_type, email_verified, email_verify_token, email_verify_expires_at) VALUES (?, ?, ?, 'skola', 1, NULL, NULL)",
      )
      .run(username, email, passwordHash);
    const user = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (!user) throw new Error(`Nije kreiran korisnik za ${school.id}`);

    await db
      .prepare(
        "INSERT INTO school_accounts (high_school_id, user_id, slug, is_active, must_change_password) VALUES (?, ?, ?, 1, 1)",
      )
      .run(school.id, user.id, school.slug);

    usedEmails.add(email);
    usedUsernames.add(username);
    created.push({
      schoolName: school.name,
      username,
      email,
      password,
    });
  }

  const loginUrl = "https://mojput.com/srednje-skole/prijava";
  if (created.length > 0) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dir = credentialsDir();
    const csvPath = path.join(dir, `school-credentials-${stamp}.csv`);
    const htmlPath = path.join(dir, `school-credentials-${stamp}.html`);
    fs.writeFileSync(csvPath, credentialsCsv(created, loginUrl), "utf8");
    fs.writeFileSync(htmlPath, credentialsHtml(created, loginUrl), "utf8");
    console.log(`[seed:schools] kreirano ${created.length} računa`);
    console.log(`[seed:schools] CSV: ${csvPath}`);
    console.log(`[seed:schools] HTML/PDF (print): ${htmlPath}`);
  } else {
    console.log("[seed:schools] nema novih računa — postojeće lozinke nisu dirane.");
  }
  console.log(`[seed:schools] preskočeno (već postoji): ${skipped}`);
}

main().catch((err) => {
  console.error("[seed:schools]", err);
  process.exitCode = 1;
});
