/**
 * Jednokratno: kopira .env iz .env.example ako .env ne postoji (SMTP, APP_ORIGIN, …).
 * Pokreće se nakon npm install.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log("[setup] Kreiran .env iz .env.example — obavezno popuni SMTP_USER i SMTP_PASS (Gmail app lozinka).");
} else if (!fs.existsSync(examplePath)) {
  console.warn("[setup] Nema .env.example.");
}
