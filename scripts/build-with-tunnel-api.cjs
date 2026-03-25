/**
 * Build za test na mobitelu: VITE_API_URL = API_PUBLIC_URL iz .env.local (tunel nakon npm run dev:public).
 * Zatim upload dist/ na GitHub Pages ili ručno kopiraj u gh-pages branch.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const envLocal = path.join(root, ".env.local");

function readApiPublicUrl() {
  if (!fs.existsSync(envLocal)) return "";
  const raw = fs.readFileSync(envLocal, "utf8");
  const m = raw.match(/^API_PUBLIC_URL\s*=\s*(.+)$/m);
  if (!m) return "";
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v.replace(/\/$/, "");
}

const url = readApiPublicUrl();
if (!url || !/^https?:\/\//i.test(url)) {
  console.error(
    "[build:phone] Nema valjanog API_PUBLIC_URL u .env.local.\n" +
      "  1) Pokreni: npm run dev:public\n" +
      "  2) Pričekaj u konzoli: [tunnel] Javni URL API-ja: https://....loca.lt\n" +
      "  3) Ponovi: npm run build:phone",
  );
  process.exit(1);
}

console.log("[build:phone] VITE_API_URL =", url);
execSync("npx vite build", {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env, VITE_API_URL: url },
});
console.log(
  "\n[build:phone] dist/ je spreman. Push na main (GitHub Actions deploy) ili ručno objavi dist na GitHub Pages.\n" +
    "  Na mobitelu otvori link iz Gmaila (tonisinkovic.github.io/...). Backend mora biti dostupan na gornjem URL-u.",
);
