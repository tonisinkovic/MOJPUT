/**
 * Idempotentni popravci src/data/scoringFormulas.json:
 * - izborni predmet s max 0, a napomena kaže „vrednovat će se s X %” → max = X % od maxBodovi
 * - jedinstveni programId (duplikati dobivaju sufiks grada, pa redni broj)
 * - nepokriveni dio bodovnog fonda → komponenta „Ostali elementi vrednovanja” (potpuna: false)
 * - izvorUrl / provjereno
 * Pokretanje: node scripts/fix-scoring-formulas.cjs
 */
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "../src/data/scoringFormulas.json");
const formulas = JSON.parse(fs.readFileSync(file, "utf-8"));

const SOURCE_URL = "https://www.postani-student.hr/Ucilista/Nositelji.aspx";
const OTHER_ID = "ostali_elementi";

const slug = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let electiveFixed = 0;
let gapAdded = 0;
for (const f of formulas) {
  const notePct = (f.napomene ?? [])
    .map((t) => t.match(/vrednovat\S*\s[^.]*?(\d+[.,]\d+)\s*%/i))
    .find(Boolean);
  if (notePct) {
    const pts = Math.round((parseFloat(notePct[1].replace(",", ".")) / 100) * f.maxBodovi);
    const elective = f.komponente.filter((c) => c.type === "matura_izborni" && c.max === 0);
    if (elective.length === 1 && pts > 0) {
      elective[0].max = pts;
      elective[0].postotak = pts / (f.maxBodovi / 100);
      elective[0].opis = "Nije obavezno; najbolji rezultat donosi dodatne bodove.";
      electiveFixed++;
    }
  }

  f.komponente = f.komponente.filter((c) => c.id !== OTHER_ID);
  const sum = f.komponente.reduce((s, c) => s + (Number(c.max) || 0), 0);
  const gap = Math.round(f.maxBodovi - sum);
  if (gap >= 10) {
    f.komponente.push({
      id: OTHER_ID,
      label: "Ostali elementi vrednovanja",
      max: gap,
      type: "dodatno",
      obavezno: false,
      opis:
        "Dio bodova koji kalkulator nema raspisan (npr. dodatna provjera, prijemni, izborni predmet). Ako znaš svoj rezultat, upiši bodove; inače ostavi 0.",
    });
    f.potpuna = false;
    gapAdded++;
  } else {
    f.potpuna = true;
  }
  f.izvorUrl = f.izvorUrl ?? SOURCE_URL;
  f.provjereno = f.provjereno ?? false;
}

const seen = new Map();
let renamed = 0;
for (const f of formulas) seen.set(f.programId, (seen.get(f.programId) ?? 0) + 1);
const used = new Set();
for (const f of formulas) {
  if (seen.get(f.programId) > 1) {
    let id = `${f.programId}--${slug(f.grad)}`;
    let n = 2;
    while (used.has(id)) id = `${f.programId}--${slug(f.grad)}-${n++}`;
    f.programId = id;
    renamed++;
  }
  used.add(f.programId);
}

fs.writeFileSync(file, JSON.stringify(formulas, null, 2) + "\n", "utf-8");
console.log({ electiveFixed, gapAdded, renamed, total: formulas.length });
