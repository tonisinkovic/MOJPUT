const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../src/data/maturaHrvatskiCitankaD073.ts");
let s = fs.readFileSync(p, "utf8");

const ce = "ć";

const reps = [
  [/Š[^\n]{0,6}u pozajmit klasičnu strofu/, "Što " + ce + "u pozajmit klasičnu strofu"],
  [
    /pregledao program kino-predstava toga dana\.[^\n]{0,8}e i sama Marie reći/,
    "pregledao program kino-predstava toga dana. Doda da " + ce + "e i sama Marie reći",
  ],
  [/ali mu ipak dade[^\n]{0,6}mu se želja ispuniti/, "ali mu ipak dade znak da " + ce + "e mu se želja ispuniti"],
  [/Taj[^\n]{0,6}ete rupčić u džepu/, "Taj " + ce + "ete rupčić u džepu"],
  [/Eh, od[^\n]{0,6}u ga u pamuk/, "Eh, odložit " + ce + "u ga u pamuk"],
  [/Da Vas ne uvrijedim[^\n]{0,6}u ga\./, "Da Vas ne uvrijedim, uzet " + ce + "u ga."],
  [/I tako[^\n]{0,6}u, slatke gospođe/, "I tako " + ce + "u, slatke gospođe"],
  [/gospodine grofe\.[^\n]{0,8}emo Vam reći/, "gospodine grofe. Poslije " + ce + "emo Vam reći"],
  [/Prihvatit[^\n]{0,8}emo Vaš ljubazni/, "Prihvatit " + ce + "emo Vaš ljubazni"],
  [/Gospodin mark[^\n]{0,8}e nas društvom/, "Gospodin markiz svojim " + ce + "e nas društvom"],
  [/tijelo[^\n]{0,8}e dobiti brz izvor/, "tijelo " + ce + "e dobiti brz izvor"],
  [/ali[^\n]{0,8}e tu energiju još brže/, "ali " + ce + "e tu energiju još brže"],
  [/igri jer[^\n]{0,8}e sretni dobitnici/, "igri jer " + ce + "e sretni dobitnici"],
  [/Te teme vratit[^\n]{0,8}e se u narednim/, "Te teme vratit " + ce + "e se u narednim"],
  [/Violinistički virtuoz Eug[^\n]{0,8}e nije od Francka/, "Violinistički virtuoz Eugène Ysaye nije od Francka"],
  [/1949\.\) svoj[^\n]{0,8}e razvoj u postromantičarskome/, "1949.) svoj " + ce + "e razvoj u postromantičarskome"],
  [/1888\., kojom[^\n]{0,8}e se oprostiti od sonatne/, "1888., kojom " + ce + "e se oprostiti od sonatne"],
  [/pjesama, koje[^\n]{0,8}e uskoro skladati/, "pjesama, koje " + ce + "e uskoro skladati"],
  [/kojemu[^\n]{0,8}e on sam skladati simfonijsku/, "kojemu " + ce + "e on sam skladati simfonijsku"],
  [/C: "Shv[^\n]{0,12}e umrijeti od gladi/, 'C: "Shvatio je da ' + ce + "e umrijeti od gladi"],
  [/D: "Shv[^\n]{0,12}e ga bogovi kazniti/, 'D: "Shvatio je da ' + ce + "e ga bogovi kazniti"],
];

for (const [re, rep] of reps) {
  const before = s;
  s = s.replace(re, rep);
  if (s === before) console.warn("no match:", re);
}

fs.writeFileSync(p, s, "utf8");
console.log("done");
