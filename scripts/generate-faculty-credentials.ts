import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { facultyCatalog } from "../src/lib/facultyCatalog.ts";
import type { FacultyUser } from "../src/types/faculty.ts";

const BODY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const SPECIALS = "!@#$%";
const LOGIN_URL = "https://mojput.com/fakulteti/prijava";

type CredentialRow = {
  facultyName: string;
  university: string;
  city: string;
  username: string;
  email: string;
  password: string;
};

function generatePassword(): string {
  const bodyBytes = crypto.randomBytes(10);
  let body = "";
  for (let i = 0; i < bodyBytes.length; i += 1) {
    body += BODY_CHARS[bodyBytes[i] % BODY_CHARS.length];
  }
  const spec = SPECIALS[crypto.randomBytes(1)[0] % SPECIALS.length];
  return `MojPut-${body}${spec}`;
}

function htmlEscape(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function csvEscape(value: string): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function readExistingUsers(tsPath: string, jsonPath: string): FacultyUser[] {
  if (fs.existsSync(jsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      if (Array.isArray(parsed)) return parsed as FacultyUser[];
    } catch {
      /* ignore */
    }
  }
  if (fs.existsSync(tsPath)) {
    const src = fs.readFileSync(tsPath, "utf8");
    const start = src.indexOf("[");
    const end = src.lastIndexOf("]");
    if (start >= 0 && end > start) {
      try {
        const parsed = JSON.parse(src.slice(start, end + 1));
        if (Array.isArray(parsed)) return parsed as FacultyUser[];
      } catch {
        /* ignore */
      }
    }
  }
  return [];
}

function credentialsCsv(rows: CredentialRow[]): string {
  const header = ["Fakultet", "Ustanova", "Grad", "Korisničko ime", "Email", "Lozinka", "URL za prijavu"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        csvEscape(row.facultyName),
        csvEscape(row.university),
        csvEscape(row.city),
        csvEscape(row.username),
        csvEscape(row.email),
        csvEscape(row.password),
        csvEscape(LOGIN_URL),
      ].join(","),
    );
  }
  return `${lines.join("\r\n")}\r\n`;
}

function credentialsHtml(rows: CredentialRow[]): string {
  const body = rows
    .map(
      (row) => `
    <tr>
      <td>${htmlEscape(row.facultyName)}</td>
      <td>${htmlEscape(row.university)}</td>
      <td>${htmlEscape(row.city)}</td>
      <td><code>${htmlEscape(row.username)}</code></td>
      <td><code>${htmlEscape(row.email)}</code></td>
      <td><code>${htmlEscape(row.password)}</code></td>
    </tr>`,
    )
    .join("");
  return `<!doctype html>
<html lang="hr">
<head>
  <meta charset="utf-8" />
  <title>MojPut — pristupni podaci fakulteta</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; color: #123; }
    h1 { font-size: 1.35rem; }
    p { max-width: 52rem; }
    table { border-collapse: collapse; width: 100%; font-size: 11px; }
    th, td { border: 1px solid #c9d4dc; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #eef3f7; }
    code { font-size: 11px; }
    @media print {
      a { color: inherit; text-decoration: none; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>MojPut Senior — pristupni podaci za fakultete</h1>
  <p>Ovaj dokument sadrži korisnička imena, email adrese i početne lozinke. Čuvaj ga izvan javnog repozitorija. Prijava: ${htmlEscape(LOGIN_URL)}</p>
  <table>
    <thead>
      <tr>
        <th>Fakultet</th>
        <th>Ustanova</th>
        <th>Grad</th>
        <th>Korisničko ime</th>
        <th>Email</th>
        <th>Lozinka</th>
      </tr>
    </thead>
    <tbody>${body}
    </tbody>
  </table>
</body>
</html>`;
}

function tryPrintPdf(htmlPath: string, pdfPath: string): boolean {
  const bins = [
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Microsoft/Edge/Application/msedge.exe"),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft/Edge/Application/msedge.exe"),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google/Chrome/Application/chrome.exe"),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
  ].filter((bin): bin is string => Boolean(bin && fs.existsSync(bin)));

  const fileUrl = pathToFileURL(htmlPath).href;
  for (const bin of bins) {
    const result = spawnSync(
      bin,
      ["--headless=new", "--disable-gpu", `--print-to-pdf=${pdfPath}`, "--no-pdf-header-footer", fileUrl],
      { timeout: 90000, encoding: "utf8" },
    );
    if (result.status === 0 && fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 1000) return true;
  }
  return false;
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const credDir = path.join(root, "data", "faculty-credentials");
  const tsPath = path.join(root, "src", "data", "facultyUsers.generated.ts");
  const jsonPath = path.join(credDir, "users.json");
  fs.mkdirSync(credDir, { recursive: true });

  const existing = readExistingUsers(tsPath, jsonPath);
  const byFaculty = new Map(existing.map((user) => [user.facultyId, user]));
  let created = 0;

  const users: FacultyUser[] = facultyCatalog.map((faculty) => {
    const prev = byFaculty.get(faculty.id);
    if (prev?.password && prev.email && prev.username) return prev;
    created += 1;
    return {
      id: `fu-${faculty.id}`,
      email: `${faculty.id}@fakultet.mojput.hr`,
      username: faculty.id,
      password: generatePassword(),
      facultyId: faculty.id,
    };
  });

  const byId = new Map(facultyCatalog.map((faculty) => [faculty.id, faculty]));
  const rows: CredentialRow[] = users
    .map((user) => {
      const faculty = byId.get(user.facultyId);
      if (!faculty) return null;
      return {
        facultyName: faculty.name,
        university: faculty.university,
        city: faculty.city,
        username: user.username || faculty.id,
        email: user.email,
        password: user.password,
      };
    })
    .filter((row): row is CredentialRow => Boolean(row))
    .sort((a, b) => a.facultyName.localeCompare(b.facultyName, "hr") || a.city.localeCompare(b.city, "hr"));

  const ts = `import type { FacultyUser } from "@/types/faculty";\n\nexport const facultyUsersGenerated: FacultyUser[] = ${JSON.stringify(users, null, 2)};\n`;
  fs.writeFileSync(tsPath, ts, "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(users, null, 2)}\n`, "utf8");

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const csvPath = path.join(credDir, `faculty-credentials-${stamp}.csv`);
  const htmlPath = path.join(credDir, `faculty-credentials-${stamp}.html`);
  const latestHtml = path.join(credDir, "faculty-credentials.html");
  const latestCsv = path.join(credDir, "faculty-credentials.csv");
  const pdfPath = path.join(credDir, "faculty-credentials.pdf");

  const html = credentialsHtml(rows);
  const csv = credentialsCsv(rows);
  fs.writeFileSync(htmlPath, html, "utf8");
  fs.writeFileSync(latestHtml, html, "utf8");
  fs.writeFileSync(csvPath, csv, "utf8");
  fs.writeFileSync(latestCsv, csv, "utf8");

  const pdfOk = tryPrintPdf(latestHtml, pdfPath);

  console.log(`[seed:faculties] katalog: ${facultyCatalog.length}`);
  console.log(`[seed:faculties] računi: ${users.length} (novih lozinki: ${created})`);
  console.log(`[seed:faculties] HTML: ${latestHtml}`);
  console.log(`[seed:faculties] CSV: ${latestCsv}`);
  console.log(pdfOk ? `[seed:faculties] PDF: ${pdfPath}` : "[seed:faculties] PDF nije spremljen — otvori HTML i ispiši u PDF.");
}

main();
