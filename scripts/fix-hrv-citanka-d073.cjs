const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../src/data/maturaHrvatskiCitankaD073.ts");
let s = fs.readFileSync(p, "utf8");
const F = "\uFFFD";

const reps = [
  ["\u0160" + F + "u pozajmit", "\u0160\u0107u pozajmit"],
  ["D" + F + "e i sama Marie", "Doda da \u0107e i sama Marie"],
  ["MARKIZ (tiho Mirand" + F + "ete rup\u010di\u0107", "MARKIZ (tiho Mirandolini): (Taj \u0107ete rup\u010di\u0107"],
  ["Eh, od" + F + "u ga", "Eh, odlo\u017eit \u0107u ga"],
  ["uzet " + F + F + "u ga", "uzet \u0107u ga"],
  ["I tako " + F + F + "u, slatke", "I tako \u0107u, slatke"],
  ["Re\u0107i " + F + F + "emo Vam", "Re\u0107i \u0107emo Vam"],
  ["Prihvatit " + F + F + "emo Va\u0161", "Prihvatit \u0107emo Va\u0161"],
  [
    "tijelo " + F + F + "e dobiti brz izvor energ" + F + "e tu energiju",
    "tijelo \u0107e dobiti brz izvor energije, ali \u0107e tu energiju",
  ],
  ["nagradnoj" + F + "e sretni", "nagradnoj igri u kojoj \u0107e sretni"],
  ["vratit " + F + F + "e se u narednim", "vratit \u0107e se u narednim"],
  ["svoj " + F + F + "e razvoj u postromanti\u010darskome", "svoj \u0107e razvoj u postromanti\u010darskome"],
  ["1888., kojom " + F + F + "e se oprostiti", "1888., kojom \u0107e se oprostiti"],
  ["koje " + F + F + "e uskoro skladati", "koje \u0107e uskoro skladati"],
  ["a u kojemu " + F + F + "e on sam skladati", "a u kojemu \u0107e on sam skladati"],
  ["Shvatio je da " + F + F + "e umrijeti", "Shvatio je da \u0107e umrijeti"],
  ["Shvatio je da " + F + F + "e ga bogovi", "Shvatio je da \u0107e ga bogovi"],
];

let hits = 0;
for (const [a, b] of reps) {
  const c = s.split(a).length - 1;
  hits += c;
  s = s.split(a).join(b);
}

fs.writeFileSync(p, s, "utf8");
const left = (s.match(/\uFFFD/g) || []).length;
const out = { hitReplacements: hits, ufffdRemaining: left };
process.stdout.write(JSON.stringify(out) + "\n");
fs.writeFileSync(path.join(__dirname, "_fixresult.json"), JSON.stringify(out, null, 2), "utf8");
