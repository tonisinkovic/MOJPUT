const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "../src/data/maturaHrvatskiCitankaD073.ts");
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
const head = lines.slice(0, 31);
const tail = lines.slice(190);
fs.writeFileSync(p, `${head.join("\n")}\n${tail.join("\n")}\n`);
