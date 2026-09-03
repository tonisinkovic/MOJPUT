// Dohvat programa srednjih škola sa srednja.hr kalkulatora.
// Podaci su ugrađeni u HTML stranice kao JS nizovi (cities, schools, schoolPrograms).
// Generira: src/data/srednjaPrograms.ts
// Pokretanje: node scripts/fetch-srednja-programi.cjs

const fs = require("fs");
const path = require("path");

const PAGE_URL = "https://www.srednja.hr/srednja-kalkulator";
const OUT_PATH = path.join(__dirname, "..", "src", "data", "srednjaPrograms.ts");

/** Izvuci JS niz `let name = [...]` iz HTML-a balansiranjem zagrada. */
function extractArray(html, varName) {
  const re = new RegExp(`let\\s+${varName}\\s*=\\s*\\[`);
  const m = html.match(re);
  if (!m) throw new Error(`Niz "${varName}" nije pronađen`);
  const start = m.index + m[0].length - 1;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        return JSON.parse(html.slice(start, i + 1));
      }
    }
  }
  throw new Error(`Niz "${varName}" nije zatvoren`);
}

/** Izvuci opcije županija iz <select name="region"> (id → naziv). */
function extractRegions(html) {
  const selStart = html.indexOf('name="region"');
  const selEnd = html.indexOf("</select>", selStart);
  const chunk = html.slice(selStart, selEnd);
  const regions = new Map();
  for (const m of chunk.matchAll(/<option value="(\d+)"[^>]*>\s*([^<]+?)\s*<\/option>/g)) {
    const id = Number(m[1]);
    if (id > 0) regions.set(id, m[2].trim());
  }
  return regions;
}

/** Ukloni šifru programa s kraja naziva, npr. "Kuhar (071294)" -> "Kuhar". */
function cleanProgramName(name) {
  return String(name || "")
    .replace(/\s*\((\d{4,})\)\s*$/, "")
    .trim();
}

async function main() {
  console.log("[srednja-programi] Dohvaćam", PAGE_URL);
  const res = await fetch(PAGE_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  console.log("[srednja-programi] HTML:", html.length, "znakova");

  const regions = extractRegions(html);
  const cities = extractArray(html, "cities");
  const schools = extractArray(html, "schools");
  const schoolPrograms = extractArray(html, "schoolPrograms");
  console.log(
    `[srednja-programi] Županija: ${regions.size} | Gradova: ${cities.length} | Škola: ${schools.length} | Programa: ${schoolPrograms.length}`,
  );

  const cityById = new Map(cities.map((c) => [c.id, c]));

  // Programi grupirani po školi
  const programsBySchool = new Map();
  for (const p of schoolPrograms) {
    if (p.active === 0) continue;
    const list = programsBySchool.get(p.school_id) || [];
    const name = cleanProgramName(p.name);
    if (name && !list.includes(name)) list.push(name);
    programsBySchool.set(p.school_id, list);
  }

  // Škole grupirane po županiji (preko grada -> state_id)
  const countiesMap = new Map(); // countyName -> [{name, city, programs}]
  let skipped = 0;
  for (const s of schools) {
    if (s.active === 0) continue;
    const city = cityById.get(s.city_id);
    const stateId = city ? Number(city.state_id) : NaN;
    const countyName = regions.get(stateId);
    if (!countyName) { skipped++; continue; }
    const programs = (programsBySchool.get(s.id) || []).sort((a, b) => a.localeCompare(b, "hr"));
    const list = countiesMap.get(countyName) || [];
    list.push({
      name: String(s.name || "").trim(),
      city: city ? String(city.name || "").trim() : "",
      programs,
    });
    countiesMap.set(countyName, list);
  }
  if (skipped) console.warn(`[srednja-programi] Preskočeno škola bez županije: ${skipped}`);

  // Sortiraj: županije abecedno, škole unutar županije po gradu pa imenu
  const counties = [...countiesMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "hr"))
    .map(([name, schoolList]) => ({
      name,
      schools: schoolList.sort(
        (a, b) => a.city.localeCompare(b.city, "hr") || a.name.localeCompare(b.name, "hr"),
      ),
    }));

  const totalSchools = counties.reduce((n, c) => n + c.schools.length, 0);
  const totalPrograms = counties.reduce(
    (n, c) => n + c.schools.reduce((m, s) => m + s.programs.length, 0),
    0,
  );
  console.log(`[srednja-programi] Izlaz: ${counties.length} županija, ${totalSchools} škola, ${totalPrograms} programa`);

  const ts = `// Automatski generirano iz https://www.srednja.hr/srednja-kalkulator — ne uređivati ručno.
// Regeneracija: node scripts/fetch-srednja-programi.cjs

export type SrednjaProgramSchool = {
  name: string;
  city: string;
  programs: string[];
};

export type SrednjaProgramCounty = {
  name: string;
  schools: SrednjaProgramSchool[];
};

export const srednjaProgramCounties: SrednjaProgramCounty[] = ${JSON.stringify(counties, null, 2)};
`;

  fs.writeFileSync(OUT_PATH, ts, "utf-8");
  console.log("[srednja-programi] Zapisano:", OUT_PATH, `(${(ts.length / 1024).toFixed(0)} kB)`);
}

main().catch((e) => {
  console.error("[srednja-programi] Greška:", e?.message || e);
  process.exit(1);
});
