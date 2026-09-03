// Dohvat prošlogodišnjih pragova bodova za sve programe srednjih škola
// sa srednja.hr kalkulatora (endpoint /get-school-program-result).
// Generira: src/data/srednjaKalkulator.ts
// Pokretanje: node scripts/fetch-srednja-pragovi.cjs

const fs = require("fs");
const path = require("path");

const PAGE_URL = "https://www.srednja.hr/srednja-kalkulator";
const RESULT_URL = "https://www.srednja.hr/get-school-program-result";
const OUT_PATH = path.join(__dirname, "..", "src", "data", "srednjaKalkulator.ts");
const CONCURRENCY = 8;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "X-Requested-With": "XMLHttpRequest",
  Accept: "application/json",
};

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
      if (depth === 0) return JSON.parse(html.slice(start, i + 1));
    }
  }
  throw new Error(`Niz "${varName}" nije zatvoren`);
}

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

function cleanProgramName(name) {
  return String(name || "").replace(/\s*\((\d{4,})\)\s*$/, "").trim();
}

function toNum(v) {
  const n = Number.parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/**
 * Parsiraj HTML tablicu pragova: vrati sektor i redak najnovije školske godine.
 * Stupci: Školska godina | Redovna kvota | Upisani | minimalni | prosječan | maksimalni | Prosjek s prijemnim
 */
function parsePragHtml(htmlStr) {
  const sectorMatch = htmlStr.match(/<tr class="sector-row">\s*<th[^>]*>([^<]+)<\/th>/);
  const sector = sectorMatch ? sectorMatch[1].trim() : null;

  const rows = [];
  for (const rowMatch of htmlStr.matchAll(/<tr>\s*((?:<td[\s\S]*?<\/td>\s*)+)<\/tr>/g)) {
    const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) =>
      c[1].replace(/<[^>]+>/g, "").trim(),
    );
    if (cells.length >= 6 && /^\d{4}\/\d{4}$/.test(cells[0])) {
      rows.push({
        year: cells[0],
        kvota: toNum(cells[1]),
        upisani: toNum(cells[2]),
        min: toNum(cells[3]),
        avg: toNum(cells[4]),
        max: toNum(cells[5]),
      });
    }
  }
  if (rows.length === 0) return { sector, prag: null };
  // Najnovija školska godina
  rows.sort((a, b) => b.year.localeCompare(a.year));
  return { sector, prag: rows[0] };
}

async function fetchPrag(programId, schoolId, attempt = 0) {
  try {
    const url = `${RESULT_URL}?school_program_id=${programId}&school_id=${schoolId}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return parsePragHtml(String(json?.html || ""));
  } catch (err) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      return fetchPrag(programId, schoolId, attempt + 1);
    }
    return { sector: null, prag: null, error: String(err?.message || err) };
  }
}

async function main() {
  console.log("[pragovi] Dohvaćam", PAGE_URL);
  const res = await fetch(PAGE_URL, { headers: { "User-Agent": HEADERS["User-Agent"] } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const regions = extractRegions(html);
  const cities = extractArray(html, "cities");
  const schools = extractArray(html, "schools");
  const schoolPrograms = extractArray(html, "schoolPrograms");
  console.log(
    `[pragovi] Županija: ${regions.size} | Gradova: ${cities.length} | Škola: ${schools.length} | Programa: ${schoolPrograms.length}`,
  );

  const cityById = new Map(cities.map((c) => [c.id, c]));
  const activePrograms = schoolPrograms.filter((p) => p.active !== 0);

  // Dohvati pragove uz ograničenu paralelnost
  const results = new Map(); // programId -> {sector, prag}
  let done = 0;
  let failed = 0;
  const queue = [...activePrograms];

  async function worker() {
    while (queue.length > 0) {
      const p = queue.shift();
      if (!p) break;
      const r = await fetchPrag(p.id, p.school_id);
      if (r.error) failed++;
      results.set(p.id, r);
      done++;
      if (done % 100 === 0) {
        console.log(`[pragovi] ${done}/${activePrograms.length} (neuspjelih: ${failed})`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`[pragovi] Gotovo dohvaćanje: ${done}, neuspjelih: ${failed}`);

  // Složi izlaz: škole s programima i pragovima
  const outSchools = [];
  for (const s of schools) {
    if (s.active === 0) continue;
    const city = cityById.get(s.city_id);
    const county = regions.get(city ? Number(city.state_id) : NaN) || "";
    const programs = activePrograms
      .filter((p) => p.school_id === s.id)
      .map((p) => {
        const r = results.get(p.id) || { sector: null, prag: null };
        return {
          id: p.id,
          name: cleanProgramName(p.name),
          sector: r.sector || null,
          prag: r.prag || null,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "hr"));
    if (programs.length === 0) continue;
    outSchools.push({
      id: s.id,
      name: String(s.name || "").trim(),
      city: city ? String(city.name || "").trim() : "",
      county,
      programs,
    });
  }
  outSchools.sort(
    (a, b) =>
      a.county.localeCompare(b.county, "hr") ||
      a.city.localeCompare(b.city, "hr") ||
      a.name.localeCompare(b.name, "hr"),
  );

  const withPrag = outSchools.reduce(
    (n, s) => n + s.programs.filter((p) => p.prag && p.prag.min != null).length,
    0,
  );
  const totalPrograms = outSchools.reduce((n, s) => n + s.programs.length, 0);
  console.log(
    `[pragovi] Škola: ${outSchools.length} | Programa: ${totalPrograms} | S pragom: ${withPrag}`,
  );

  const ts = `// Automatski generirano iz https://www.srednja.hr/srednja-kalkulator — ne uređivati ručno.
// Regeneracija: node scripts/fetch-srednja-pragovi.cjs
// Pragovi se odnose na ljetni upisni rok navedene školske godine.

export type KalkulatorPrag = {
  year: string;
  kvota: number | null;
  upisani: number | null;
  min: number | null;
  avg: number | null;
  max: number | null;
};

export type KalkulatorProgram = {
  id: number;
  name: string;
  sector: string | null;
  prag: KalkulatorPrag | null;
};

export type KalkulatorSchool = {
  id: number;
  name: string;
  city: string;
  county: string;
  programs: KalkulatorProgram[];
};

export const kalkulatorSchools: KalkulatorSchool[] = ${JSON.stringify(outSchools, null, 1)};
`;

  fs.writeFileSync(OUT_PATH, ts, "utf-8");
  console.log(`[pragovi] Zapisano: ${OUT_PATH} (${(ts.length / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error("[pragovi] Greška:", e?.message || e);
  process.exit(1);
});
