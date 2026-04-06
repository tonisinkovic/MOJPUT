/* eslint-disable no-console */
/**
 * End-to-end auth: register → verify s kodom → login.
 * Pokreni API s: set MOJPUT_E2E=1 (Windows: set MOJPUT_E2E=1) pa node server.cjs
 * — inače nema načina pročitati kod iz baze (samo hash).
 */
const path = require("path");
const Database = require("better-sqlite3");

async function readJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

async function main() {
  if (String(process.env.MOJPUT_E2E || "").trim() !== "1") {
    console.error("Postavi MOJPUT_E2E=1 i ponovno pokreni ovu skriptu (i server mora biti s istim env).");
    process.exitCode = 2;
    return;
  }

  const ts = Date.now();
  const email = `iperija82+mojputtest${ts}@gmail.com`;
  const password = "Test1234!";
  const username = "Test User";
  const base = "http://127.0.0.1:3000";

  const regRes = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const regJson = await readJson(regRes);
  console.log("REGISTER", regRes.status, regJson);

  const code = regJson?.dev_verification_code;
  if (!code || String(code).length !== 6) {
    console.error("Nema dev_verification_code u odgovoru — server nema MOJPUT_E2E=1?");
    process.exitCode = 2;
    return;
  }

  const db = new Database(path.join(__dirname, "..", "data", "mojput.db"));
  const row = db.prepare("SELECT verify_code_hash FROM pending_registrations WHERE email = ?").get(email);
  console.log("DB pending has code hash:", Boolean(row?.verify_code_hash));
  if (!row?.verify_code_hash) {
    process.exitCode = 2;
    return;
  }

  const verRes = await fetch(`${base}/api/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, code: String(code) }),
  });
  const verJson = await readJson(verRes);
  console.log("VERIFY-CODE", verRes.status, verJson);

  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const loginJson = await readJson(loginRes);
  console.log("LOGIN", loginRes.status, loginJson);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
