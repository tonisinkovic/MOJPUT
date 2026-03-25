/* eslint-disable no-console */
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
  const ts = Date.now();
  const email = `iperija82+mojputtest${ts}@gmail.com`;
  const password = "Test1234!";
  const username = "Test User";
  const base = "http://localhost:3000";

  const regRes = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const regJson = await readJson(regRes);
  console.log("REGISTER", regRes.status, regJson);

  const db = new Database(path.join(__dirname, "..", "data", "mojput.db"));
  const row = db.prepare("SELECT verify_token FROM pending_registrations WHERE email = ?").get(email);
  console.log("DB pending", row);
  if (!row?.verify_token) {
    process.exitCode = 2;
    return;
  }

  const verRes = await fetch(`${base}/api/auth/verify?token=${encodeURIComponent(row.verify_token)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const verJson = await readJson(verRes);
  console.log("VERIFY", verRes.status, verJson);

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

