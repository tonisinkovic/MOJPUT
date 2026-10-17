/**
 * Revizija src/data/scoringFormulas.json: duplikati, zbrojevi komponenti, pragovi, natjecanja.
 * Pokretanje: node scripts/audit-scoring-formulas.cjs [--json]
 */
const path = require("path");
const formulas = require(path.join(__dirname, "../src/data/scoringFormulas.json"));

const byId = new Map();
for (const f of formulas) byId.set(f.programId, (byId.get(f.programId) ?? 0) + 1);
const duplicates = [...byId].filter(([, n]) => n > 1).map(([id, n]) => ({ id, n }));

const sumMismatch = [];
const noCutoff = [];
const levelStats = { A: 0, B: 0, none: 0 };
const natjecanjaFormats = new Map();
for (const f of formulas) {
  const sum = f.komponente.reduce((s, c) => s + (Number(c.max) || 0), 0);
  if (Math.abs(sum - f.maxBodovi) > 0.5) sumMismatch.push({ id: f.programId, sum, max: f.maxBodovi });
  const cutoffs = Object.values(f.pragovi ?? {}).filter((v) => v != null);
  if (cutoffs.length === 0) noCutoff.push(f.programId);
  for (const c of f.komponente) {
    if (c.type === "matura" || c.type === "matura_izborni") levelStats[c.razina ?? "none"]++;
  }
  for (const n of f.natjecanja ?? []) {
    const key = String(n.vrednovanje).replace(/[\d,.]+/g, "#");
    natjecanjaFormats.set(key, (natjecanjaFormats.get(key) ?? 0) + 1);
  }
}

const report = {
  programs: formulas.length,
  duplicates,
  sumMismatch: sumMismatch.length,
  sumOver: sumMismatch.filter((m) => m.sum > m.max).length,
  sumUnder: sumMismatch.filter((m) => m.sum < m.max).length,
  sumMismatchExamples: sumMismatch.slice(0, 15),
  noCutoff: noCutoff.length,
  levelStats,
  natjecanjaFormats: Object.fromEntries(natjecanjaFormats),
  izvor: formulas.reduce((m, f) => ((m[f.izvor ?? "?"] = (m[f.izvor ?? "?"] ?? 0) + 1), m), {}),
};
console.log(JSON.stringify(report, null, 2));
if (process.argv.includes("--strict") && (duplicates.length > 0 || report.sumOver > 0)) process.exit(1);
