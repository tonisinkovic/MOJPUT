const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../src/data/maturaHrvatskiCitankaPassagesD073.ts");
let s = fs.readFileSync(p, "utf8");
const F = "\uFFFD";

const reps = [
  ["\u0160to" + F + "u pozajmit", "\u0160to \u0107u pozajmit"],
  ["Doda" + F + "e i sama", "Doda da \u0107e i sama"],
  ["): Taj" + F + "ete", "): Taj \u0107ete"],
  ["Eh, odlo\u017eit " + F + "u ga", "Eh, odlo\u017eit \u0107u ga"],
  ["uvrijedim" + F + "u ga", "uvrijedim, uzet \u0107u ga"],
  ["MARKIZ:" + F + "u, slatke", "MARKIZ: I tako \u0107u, slatke"],
  ["Re\u0107i " + F + "emo", "Re\u0107i \u0107emo"],
  ["Prihvatit " + F + "emo", "Prihvatit \u0107emo"],
  [
    "tijelo " + F + "e dobiti brz izvor energije" + F + "e tu energiju",
    "tijelo \u0107e dobiti brz izvor energije, ali \u0107e tu energiju",
  ],
  ["jer " + F + "e sretni", "jer \u0107e sretni"],
  ["Te teme" + F + "e se", "Te teme vratit \u0107e se"],
  ["(1864. \u2013 194" + F + "e razvoj", "(1864. \u2013 1949.) svoj \u0107e razvoj"],
  ["(1864. - 194" + F + "e razvoj", "(1864. - 1949.) svoj \u0107e razvoj"],
  ["1888" + F + "e se oprostiti", "1888., kojom \u0107e se oprostiti"],
  ["koje " + F + "e uskoro", "koje \u0107e uskoro"],
  ["u kojemu " + F + "e on sam", "u kojemu \u0107e on sam"],
];

let hits = 0;
for (const [a, b] of reps) {
  const c = s.split(a).length - 1;
  hits += c;
  s = s.split(a).join(b);
}

fs.writeFileSync(p, s, "utf8");
const left = (s.match(/\uFFFD/g) || []).length;
process.stdout.write(JSON.stringify({ replacementRuns: hits, ufffdRemaining: left }) + "\n");
