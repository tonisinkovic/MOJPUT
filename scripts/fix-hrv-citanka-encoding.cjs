const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../src/data/maturaHrvatskiCitankaD073.ts");
let s = fs.readFileSync(p, "utf8");
const ce = "\u0107e";

const pairs = [
  [/Š\uFFFD\uFFFDu pozajmit/g, "Što \u0107u pozajmit"],
  [/toga dana\.\uFFFDe i sama Marie/g, "toga dana. Doda da " + ce + " i sama Marie"],
  [/dade\uFFFDe mu se želja/g, "dade znak da " + ce + " mu se želja"],
  [/Taj \uFFFD\uFFFDete rupčić/g, "Taj " + ce + "ete rupčić"],
  [/Eh, od\uFFFDu ga u pamuk/g, "Eh, odlo\u017Eit " + ce + "u ga u pamuk"],
  [/uvrijedim\uFFFDu ga\./g, "uvrijedim, uzet " + ce + "u ga."],
  [/I tako \uFFFD\uFFFDu, slatke/g, "I tako " + ce + "u, slatke"],
  [/grofe\.\uFFFDe/g, "grofe. Poslije " + ce + "e"],
  [/Prihvatit \uFFFD\uFFFDe/g, "Prihvatit " + ce + "e"],
  [/Gospodin mark\uFFFDe nas/g, "Gospodin markiz svojim " + ce + " nas"],
  [/tijelo \uFFFD\uFFFDe dobiti/g, "tijelo " + ce + " dobiti"],
  [/ali \uFFFD\uFFFDe tu energiju/g, "ali " + ce + " tu energiju"],
  [/igri jer \uFFFD\uFFFDe sretni/g, "igri jer " + ce + " sretni"],
  [/vratit \uFFFD\uFFFDe se u narednim/g, "vratit " + ce + " se u narednim"],
  [/Eug\uFFFD\uFFFDe nije od Francka/g, "Eug\u00E8ne Ysaye nije od Francka"],
  [/1949\.\) svoj \uFFFD\uFFFDe razvoj/g, "1949.) svoj " + ce + " razvoj"],
  [/1888\., kojom \uFFFD\uFFFDe se oprostiti/g, "1888., kojom " + ce + " se oprostiti"],
  [/pjesama, koje \uFFFD\uFFFDe uskoro skladati/g, "pjesama, koje " + ce + " uskoro skladati"],
  [/kojemu \uFFFD\uFFFDe on sam skladati/g, "kojemu " + ce + " on sam skladati"],
  [/Shv\uFFFDe umrijeti od gladi/g, "Shvatio je da " + ce + " umrijeti od gladi"],
  [/Shv\uFFFDe ga bogovi kazniti/g, "Shvatio je da " + ce + " ga bogovi kazniti"],
];

for (const [re, rep] of pairs) {
  s = s.replace(re, rep);
}

fs.writeFileSync(p, s, "utf8");
console.log("fixed", p);
