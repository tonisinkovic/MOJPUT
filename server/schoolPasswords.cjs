"use strict";

const crypto = require("crypto");

const BODY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const SPECIALS = "!@#$%";

/** Kriptografski nasumična početna lozinka. Format: MojPut- + slučajni znakovi. */
function generateSchoolPassword() {
  const bodyBytes = crypto.randomBytes(10);
  let body = "";
  for (let i = 0; i < bodyBytes.length; i += 1) {
    body += BODY_CHARS[bodyBytes[i] % BODY_CHARS.length];
  }
  const spec = SPECIALS[crypto.randomBytes(1)[0] % SPECIALS.length];
  return `MojPut-${body}${spec}`;
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function htmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function credentialsCsv(rows, loginUrl) {
  const header = ["Škola", "Korisničko ime", "Email", "Početna lozinka", "URL za prijavu"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        csvEscape(row.schoolName),
        csvEscape(row.username),
        csvEscape(row.email),
        csvEscape(row.password),
        csvEscape(loginUrl),
      ].join(","),
    );
  }
  return `${lines.join("\r\n")}\r\n`;
}

function credentialsHtml(rows, loginUrl) {
  const items = rows
    .map(
      (row) => `
    <article class="card">
      <h2>${htmlEscape(row.schoolName)}</h2>
      <p><strong>Korisničko ime:</strong> ${htmlEscape(row.username)}</p>
      <p><strong>Email:</strong> ${htmlEscape(row.email)}</p>
      <p><strong>Početna lozinka:</strong> <code>${htmlEscape(row.password)}</code></p>
      <p><strong>Prijava:</strong> ${htmlEscape(loginUrl)}</p>
      <p class="note">Nakon prve prijave škola mora promijeniti lozinku.</p>
    </article>`,
    )
    .join("\n");
  return `<!doctype html>
<html lang="hr">
<head>
  <meta charset="utf-8" />
  <title>MojPut — pristupni podaci škola</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; color: #123; }
    h1 { font-size: 1.4rem; }
    .card { border: 1px solid #c9d4dc; border-radius: 12px; padding: 16px; margin: 0 0 16px; page-break-inside: avoid; }
    code { font-size: 1rem; }
    .note { color: #555; font-size: 0.9rem; }
    @media print { a { color: inherit; text-decoration: none; } }
  </style>
</head>
<body>
  <h1>MojPut Junior — pristupni podaci za škole</h1>
  <p>Ovaj dokument sadrži početne lozinke. Čuvaj ga izvan javnog repozitorija. Škola mora promijeniti lozinku nakon prve prijave.</p>
  ${items}
</body>
</html>`;
}

module.exports = {
  generateSchoolPassword,
  credentialsCsv,
  credentialsHtml,
  htmlEscape,
};
