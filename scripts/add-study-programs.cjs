/**
 * Jednokratno (idempotentno) dodaje studije koji postoje u careers-database
 * facultyPaths, a nedostajali su u study-programs.json.
 *   node scripts/add-study-programs.cjs
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "data", "career-quiz", "study-programs.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const additions = [
  {
    name: "Logopedija i edukacijska rehabilitacija",
    area: "health",
    faculties: ["ERF (Zagreb)", "Filozofski fakultet (Osijek)"],
    description: "Procjena i terapija govora, jezika i komunikacije te podrška osobama s teškoćama u razvoju.",
    interestWeights: { social: 3, investigative: 2 },
    competencyWeights: { patience: 3, communication: 3, emotional_intelligence: 2, attention_to_detail: 1 },
    boostSignals: { social_help_interest: 2, medicine_health_interest: 1, teaching_mentoring_interest: 1 },
    mathDemand: 0,
    keyDemands: ["strpljenje", "rad s djecom i odraslima", "precizno opažanje"],
  },
  {
    name: "Nautika i brodostrojarstvo",
    area: "security",
    faculties: ["PFRI (Rijeka)", "PFST (Split)", "Pomorski odjel (Zadar)", "Pomorski odjel (Dubrovnik)"],
    description: "Školovanje za pomorske časnike — upravljanje brodom, navigacija i brodski strojevi.",
    interestWeights: { realistic: 3, enterprising: 1 },
    competencyWeights: { technical: 3, safety: 2, stress_management: 2, organization: 1 },
    boostSignals: { machines_tech_interest: 2, nature_outdoor_interest: 1 },
    mathDemand: 1,
    keyDemands: ["dugi periodi na moru", "odgovornost za posadu", "tehnička znanja"],
  },
  {
    name: "Rudarstvo, geologija i naftno inženjerstvo",
    area: "stem",
    faculties: ["RGN fakultet (Zagreb)"],
    description: "Istraživanje i eksploatacija mineralnih sirovina, nafte i plina, geološka istraživanja.",
    interestWeights: { realistic: 3, investigative: 2 },
    competencyWeights: { technical: 3, problem_solving: 2, safety: 2, numerical: 1 },
    boostSignals: { nature_outdoor_interest: 2, materials_construction_interest: 1, science_lab_interest: 1 },
    mathDemand: 2,
    keyDemands: ["matematika i fizika", "terenski rad", "sigurnost na radu"],
  },
  {
    name: "Tekstilni i modni dizajn",
    area: "creative",
    faculties: ["TTF (Zagreb)"],
    description: "Modni i tekstilni dizajn te tekstilna tehnologija — od ideje do gotovog proizvoda.",
    interestWeights: { artistic: 3, realistic: 1 },
    competencyWeights: { design: 3, creativity: 3, attention_to_detail: 2 },
    boostSignals: { design_visual_interest: 3 },
    mathDemand: 0,
    keyDemands: ["prijemni ispit (crtež, portfolio)", "osjećaj za materijale", "kreativnost"],
  },
  {
    name: "Aeronautika i pilotiranje",
    area: "security",
    faculties: ["FPZ (Zagreb)"],
    description: "Civilni ili vojni pilot, kontrola leta i zrakoplovna tehnika.",
    interestWeights: { realistic: 3, investigative: 1 },
    competencyWeights: { stress_management: 3, technical: 2, attention_to_detail: 2, safety: 2 },
    boostSignals: { machines_tech_interest: 2, security_defense_interest: 1 },
    mathDemand: 2,
    keyDemands: ["zdravstveni pregled (medicinska klasa)", "matematika i fizika", "brze odluke pod pritiskom"],
  },
  {
    name: "Nutricionizam",
    area: "health",
    faculties: ["PBF (Zagreb)", "PTF (Osijek)"],
    description: "Znanost o prehrani — planiranje prehrane, kvaliteta hrane i zdravlje.",
    interestWeights: { investigative: 3, social: 1 },
    competencyWeights: { research: 2, analytical: 2, communication: 2, learning: 1 },
    boostSignals: { science_lab_interest: 2, medicine_health_interest: 2 },
    mathDemand: 1,
    keyDemands: ["kemija i biologija", "rad s ljudima", "laboratorij"],
  },
  {
    name: "Medicinsko-laboratorijska dijagnostika i radiologija",
    area: "health",
    faculties: ["ZVU (Zagreb)", "FZS (Rijeka)", "FDMZ (Osijek)", "Sveučilišni odjel zdravstvenih studija (Split)"],
    description: "Laboratorijske analize i slikovna dijagnostika u bolnicama i laboratorijima.",
    interestWeights: { investigative: 3, conventional: 2 },
    competencyWeights: { attention_to_detail: 3, technical: 2, analytical: 2 },
    boostSignals: { science_lab_interest: 2, medicine_health_interest: 2 },
    mathDemand: 1,
    keyDemands: ["preciznost", "kemija i biologija", "rad u smjenama"],
  },
  {
    name: "Rani i predškolski odgoj",
    area: "social",
    faculties: ["UFZG (Zagreb)", "FOOZOS (Osijek)", "UFRI (Rijeka)", "UNIZD (Zadar)", "FFST (Split)"],
    description: "Rad s djecom vrtićke dobi — odgoj, igra i poticanje razvoja.",
    interestWeights: { social: 3, artistic: 1 },
    competencyWeights: { patience: 3, emotional_intelligence: 2, creativity: 2, communication: 2 },
    boostSignals: { teaching_mentoring_interest: 3, social_help_interest: 1 },
    mathDemand: 0,
    keyDemands: ["strpljenje", "kreativnost", "odgovornost za djecu"],
  },
  {
    name: "Brodogradnja",
    area: "stem",
    faculties: ["FSB (Zagreb)", "Tehnički fakultet (Rijeka)", "FESB (Split)"],
    description: "Projektiranje i gradnja brodova i pomorskih konstrukcija.",
    interestWeights: { realistic: 3, investigative: 2 },
    competencyWeights: { technical: 3, problem_solving: 2, numerical: 2 },
    boostSignals: { machines_tech_interest: 2, materials_construction_interest: 2 },
    mathDemand: 2,
    keyDemands: ["matematika i fizika", "tehničko crtanje", "projektiranje"],
  },
];

const inline = (v) =>
  Array.isArray(v)
    ? `[${v.map((x) => JSON.stringify(x)).join(", ")}]`
    : `{ ${Object.entries(v)
        .map(([k, x]) => `${JSON.stringify(k)}: ${JSON.stringify(x)}`)
        .join(", ")} }`;

const serialize = (p, eol) =>
  [
    "    {",
    ...Object.entries(p).map(
      ([k, v], i, arr) =>
        `      ${JSON.stringify(k)}: ${typeof v === "object" ? inline(v) : JSON.stringify(v)}${
          i < arr.length - 1 ? "," : ""
        }`,
    ),
    "    }",
  ].join(eol);

const raw = fs.readFileSync(file, "utf8");
const eol = raw.includes("\r\n") ? "\r\n" : "\n";
let nextId = Math.max(...data.programs.map((p) => p.id)) + 1;
const fresh = additions
  .filter((a) => !data.programs.some((p) => p.name === a.name))
  .map((a) => ({ id: nextId++, ...a }));

if (fresh.length > 0) {
  const closing = `${eol}  ]${eol}}`;
  const at = raw.lastIndexOf(closing);
  if (at < 0) throw new Error("Neočekivan format study-programs.json");
  const insert = fresh.map((p) => `,${eol}${serialize(p, eol)}`).join("");
  fs.writeFileSync(file, raw.slice(0, at) + insert + raw.slice(at));
}
JSON.parse(fs.readFileSync(file, "utf8"));
console.log(`Dodano ${fresh.length} studija, ukupno ${data.programs.length + fresh.length}.`);
