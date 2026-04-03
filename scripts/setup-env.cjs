/**
 * Jednokratno: kopira .env iz .env.example ako .env ne postoji (SMTP, APP_ORIGIN, …).
 * Pokreće se nakon npm install.
 * U Docker/CI (npm ci u imageu) ne kreirati .env — varijable dolaze s hosta (Render).
 */
const fs = require("fs");
const path = require("path");

if (process.env.CI === "true" || process.env.SKIP_SETUP_ENV === "1") {
  process.exit(0);
}

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log("[setup] Kreiran .env iz .env.example — obavezno popuni SMTP_USER i SMTP_PASS (Gmail app lozinka).");
} else if (!fs.existsSync(examplePath)) {
  console.warn("[setup] Nema .env.example.");
}
