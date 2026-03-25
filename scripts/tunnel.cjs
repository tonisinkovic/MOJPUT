/* eslint-disable no-console */
/**
 * Javni HTTPS URL do lokalnog API-ja (port 3000) — piše .env.local za API_PUBLIC_URL.
 * Pokreće se nakon što backend sluša (npr. wait-on tcp:3000).
 */
const fs = require("fs");
const path = require("path");
const localtunnel = require("localtunnel");

async function main() {
  const port = Number(process.env.TUNNEL_PORT || process.env.PORT || 3000);
  const tunnel = await localtunnel({ port });
  const url = tunnel.url.replace(/\/$/, "");
  const envLocal = path.join(__dirname, "..", ".env.local");
  let lines = [];
  if (fs.existsSync(envLocal)) {
    lines = fs.readFileSync(envLocal, "utf8").split(/\r?\n/);
  }
  const filtered = lines.filter((line) => {
    const t = line.trim();
    if (t.startsWith("API_PUBLIC_URL=")) return false;
    if (t === "# Automatski (npm run dev:public). Ne commitaj.") return false;
    if (t.includes("NE stavljaj VITE_API_URL")) return false;
    return true;
  });
  while (filtered.length && filtered[filtered.length - 1] === "") filtered.pop();
  const block = [
    "",
    "# Automatski (npm run dev:public). Ne commitaj.",
    "# Samo API_PUBLIC_URL — NE stavljaj VITE_API_URL ovdje (Vite bi slao sve API pozive na tunel).",
    `API_PUBLIC_URL=${url}`,
    "",
  ];
  fs.writeFileSync(envLocal, [...filtered, ...block].join("\n"), "utf8");
  console.log("[tunnel] Javni URL API-ja (link u mailu):", url);
  console.log("[tunnel] Spremljeno u .env.local — frontend i dalje koristi Vite proxy (relativni /api).");

  tunnel.on("close", () => {
    console.error("[tunnel] Tunel zatvoren.");
    process.exit(1);
  });
}

main().catch((err) => {
  console.error("[tunnel]", err);
  process.exit(1);
});
