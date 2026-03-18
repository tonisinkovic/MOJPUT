const fs = require("fs");
const path = require("path");

function parseCroFloat(s) {
  const cleaned = String(s || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function normalizeSpace(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

function extractProgramAndCity(studijCol) {
  const s = normalizeSpace(studijCol);
  const lastComma = s.lastIndexOf(",");
  if (lastComma === -1) return { program: s, city: "" };
  const program = s.slice(0, lastComma).trim();
  const city = s.slice(lastComma + 1).trim();
  return { program, city };
}

function tryParseRow(line) {
  const raw = String(line || "").trim();
  if (!raw) return null;
  if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(raw)) return null;
  if (/^Nositelj\s+Izvođač\s+Studij\s+Potrebno bodova/i.test(raw)) return null;

  // Best case: tab separated
  let parts = raw.split(/\t+/).map((p) => p.trim()).filter(Boolean);

  // Fallback: multi-space separated (some lines lose tabs)
  if (parts.length < 4) {
    parts = raw.split(/\s{2,}/).map((p) => p.trim()).filter(Boolean);
  }

  let nositelj, izvodac, studij, bodovi;

  if (parts.length >= 4) {
    // Sometimes there are extra columns due to wrapping; take last as points, first 3 as fields.
    bodovi = parts[parts.length - 1];
    nositelj = parts[0];
    izvodac = parts[1];
    studij = parts.slice(2, parts.length - 1).join(" ");
  } else {
    // Last resort: detect number at end, split remainder into 3 chunks by double spaces-ish
    const m = raw.match(/^(.*?)(\d{1,4}(?:[.,]\d+)?)\s*$/);
    if (!m) return null;
    bodovi = m[2];
    const left = m[1].trim();
    const leftParts = left.split(/\s{2,}/).map((p) => p.trim()).filter(Boolean);
    if (leftParts.length < 3) return null;
    nositelj = leftParts[0];
    izvodac = leftParts[1];
    studij = leftParts.slice(2).join(" ");
  }

  const cutoff = parseCroFloat(bodovi);
  if (cutoff === null) return null;

  const { program, city } = extractProgramAndCity(studij);
  return {
    provider: normalizeSpace(nositelj),
    faculty: normalizeSpace(izvodac),
    program: normalizeSpace(program),
    city: normalizeSpace(city),
    cutoff,
  };
}

function guessInstitutionType(provider) {
  const s = normalizeSpace(provider).toLowerCase();
  if (s.includes("veleučilište")) return "Veleučilište";
  if (s.includes("sveučilište")) return "Sveučilište";
  if (s.includes("visoka škola") || s.includes("visoka skola")) return "Visoka škola";
  if (s.includes("učilište") || s.includes("uciliste")) return "Učilište";
  return "Ostalo";
}

function buildDataset(rows) {
  // Group by (faculty, city) so every faculty entry has exactly one city
  const byKey = new Map();

  for (const r of rows) {
    if (!r.city) continue;
    const key = `${r.faculty}__${r.city}`;
    if (!byKey.has(key)) {
      byKey.set(key, {
        name: r.faculty,
        city: r.city,
        provider: r.provider,
        institutionType: guessInstitutionType(r.provider),
        programs: [],
      });
    }
    const entry = byKey.get(key);
    if (!entry.provider && r.provider) entry.provider = r.provider;

    // Deduplicate by program name; keep the max cutoff if duplicates appear
    const existing = entry.programs.find((p) => p.name === r.program);
    if (existing) {
      existing.cutoffByYear["2025"] = Math.max(existing.cutoffByYear["2025"], r.cutoff);
    } else {
      entry.programs.push({
        name: r.program,
        cutoffByYear: { "2025": r.cutoff },
      });
    }
  }

  const data = Array.from(byKey.values())
    .map((f) => ({
      ...f,
      programs: f.programs.sort((a, b) => a.name.localeCompare(b.name, "hr")),
    }))
    .sort((a, b) => (a.city.localeCompare(b.city, "hr") || a.name.localeCompare(b.name, "hr")));

  return data;
}

async function main() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const repoRoot = path.join(__dirname, "..");
  const pdfPath = path.join(repoRoot, "data", "bodovni-prag-za-upis-fakulteta-2025.pdf");
  const outPath = path.join(repoRoot, "universities_data.json");

  if (!fs.existsSync(pdfPath)) {
    console.error(
      `[import] Ne mogu pronaći PDF na: ${pdfPath}\n` +
        `Kopiraj priloženi PDF u /data kao 'bodovni-prag-za-upis-fakulteta-2025.pdf' pa pokreni opet.`,
    );
    process.exitCode = 1;
    return;
  }

  const buf = fs.readFileSync(pdfPath);
  const data = new Uint8Array(buf);
  const doc = await pdfjs.getDocument({ data }).promise;

  // Derive column boundaries from the header on the first page
  const firstPage = await doc.getPage(1);
  const firstText = await firstPage.getTextContent();
  const headerItems = firstText.items
    .map((it) => ({
      str: String(it.str || "").trim(),
      x: it.transform?.[4] ?? 0,
      y: it.transform?.[5] ?? 0,
    }))
    .filter((it) => it.str);

  const headerX = {};
  for (const it of headerItems) {
    const s = it.str.toLowerCase();
    if (s === "nositelj") headerX.nositelj = it.x;
    if (s === "izvođač" || s === "izvodac") headerX.izvodac = it.x;
    if (s === "studij") headerX.studij = it.x;
    if (s.startsWith("potrebno")) headerX.bodovi = it.x;
  }

  // Fallback defaults if header isn't perfectly separated
  const xNos = Number.isFinite(headerX.nositelj) ? headerX.nositelj : 0;
  const xIzv = Number.isFinite(headerX.izvodac) ? headerX.izvodac : 160;
  const xStu = Number.isFinite(headerX.studij) ? headerX.studij : 340;
  const xBod = Number.isFinite(headerX.bodovi) ? headerX.bodovi : 520;
  const b1 = (xNos + xIzv) / 2;
  const b2 = (xIzv + xStu) / 2;
  const b3 = (xStu + xBod) / 2;

  const rows = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();

    const items = tc.items
      .map((it) => ({
        str: String(it.str || ""),
        x: it.transform?.[4] ?? 0,
        y: it.transform?.[5] ?? 0,
      }))
      .filter((it) => it.str && it.str.trim());

    // Group into visual lines by Y coordinate (rounded)
    const byY = new Map();
    for (const it of items) {
      const yKey = Math.round(it.y);
      if (!byY.has(yKey)) byY.set(yKey, []);
      byY.get(yKey).push(it);
    }

    const yKeys = Array.from(byY.keys()).sort((a, b) => b - a); // top -> bottom
    for (const y of yKeys) {
      const lineItems = byY.get(y).sort((a, b) => a.x - b.x);

      // Build 4 columns by X boundaries
      const cols = [[], [], [], []];
      for (const it of lineItems) {
        const x = it.x;
        const s = normalizeSpace(it.str);
        if (!s) continue;
        const colIdx = x < b1 ? 0 : x < b2 ? 1 : x < b3 ? 2 : 3;
        cols[colIdx].push({ x, s });
      }

      const nositelj = cols[0].map((i) => i.s).join(" ").trim();
      const izvodac = cols[1].map((i) => i.s).join(" ").trim();
      const studij = cols[2].map((i) => i.s).join(" ").trim();
      const bodovi = cols[3].map((i) => i.s).join(" ").trim();

      const parsed = tryParseRow([nositelj, izvodac, studij, bodovi].join("\t"));
      if (parsed) rows.push(parsed);
    }
  }

  const dataset = buildDataset(rows);

  fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2) + "\n", "utf-8");
  console.log(`[import] OK: zapisano ${dataset.length} fakulteta u ${outPath}`);
}

main().catch((err) => {
  console.error("[import] Greška:", err);
  process.exitCode = 1;
});

