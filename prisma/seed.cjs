const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

function getRazina(programName) {
  const n = (programName || "").toLowerCase();
  if (n.includes("diplomski") && !n.includes("preddiplomski")) return "diplomski";
  if (n.includes("stručni") || n.includes("strucni")) return "stručni";
  return "preddiplomski";
}

function cleanProgramName(name) {
  let s = (name || "").trim();
  s = s.replace(/\s*\(izvanredni[^)]*\)/gi, "").replace(/\s*\(stručni\)/gi, "").replace(/\s*\(diplomski\)/gi, "").replace(/\s*\(preddiplomski\)/gi, "").replace(/\s*\(na engleskom[^)]*\)/gi, "").replace(/\s*\(završili prije[^)]*\)/gi, "").replace(/\s*\(on-line\)/gi, "").replace(/\s*\(Hrvati izvan RH\)/gi, "").replace(/\s*\(izvanredni\)/gi, "").trim();
  return (s || name).slice(0, 250);
}

async function main() {
  console.log("🌱 Seeding database from universities_data.json...");

  const dataPath = path.join(__dirname, "..", "universities_data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("universities_data.json not found!");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const institutions = Array.isArray(raw) ? raw : [];

  const gradoviSet = new Set();
  const fakultetiMap = new Map();

  for (const inst of institutions) {
    const city = String(inst.city || "").trim();
    const name = String(inst.name || "").trim();
    if (!city || !name) continue;

    gradoviSet.add(city);
    const key = `${name}__${city}`;
    if (!fakultetiMap.has(key)) {
      fakultetiMap.set(key, {
        naziv: name,
        grad: city,
        sveuciliste: String(inst.provider || "").trim() || null,
        web_stranica: null,
        opis: `${inst.institutionType || "Visoko učilište"} u ${city}.`,
        programs: [],
      });
    }
    const f = fakultetiMap.get(key);
    for (const prog of inst.programs || []) {
      const progName = String(prog.name || "").trim();
      if (!progName) continue;
      const cutoff = prog.cutoffByYear?.["2025"];
      const cutoffVal = typeof cutoff === "number" && !Number.isNaN(cutoff) ? Math.round(cutoff * 10) / 10 : null;
      f.programs.push({
        naziv_studija: cleanProgramName(progName).slice(0, 200) || progName.slice(0, 200),
        razina: getRazina(progName),
        bodovni_prag_2025: cutoffVal,
      });
    }
  }

  await prisma.studij.deleteMany();
  await prisma.fakultet.deleteMany();
  await prisma.grad.deleteMany();

  const gradoviList = [...gradoviSet].sort((a, b) => a.localeCompare(b, "hr"));
  await prisma.grad.createMany({
    data: gradoviList.map((naziv) => ({ naziv })),
  });

  const allGradovi = await prisma.grad.findMany();
  const gradMap = {};
  for (const g of allGradovi) gradMap[g.naziv] = g.id;

  const fakultetiList = [...fakultetiMap.values()];
  const createdFakulteti = [];

  for (const f of fakultetiList) {
    const created = await prisma.fakultet.create({
      data: {
        naziv: f.naziv,
        grad: f.grad,
        sveuciliste: f.sveuciliste,
        web_stranica: f.web_stranica,
        opis: f.opis,
        gradId: gradMap[f.grad] ?? null,
      },
    });
    createdFakulteti.push({ ...created, programs: f.programs });
  }

  let studijiCount = 0;
  const seenStudiji = new Set();
  for (const f of createdFakulteti) {
    for (const p of f.programs) {
      const key = `${f.id}-${p.naziv_studija}-${p.razina}`;
      if (seenStudiji.has(key)) continue;
      seenStudiji.add(key);
      await prisma.studij.create({
        data: {
          naziv_studija: p.naziv_studija,
          razina: p.razina,
          fakultet_id: f.id,
          bodovni_prag_2025: p.bodovni_prag_2025 ?? null,
        },
      });
      studijiCount++;
    }
  }

  const fakultetiCount = await prisma.fakultet.count();
  const gradoviCount = await prisma.grad.count();

  console.log(`✅ Seeded: ${gradoviCount} gradova, ${fakultetiCount} fakulteta/veleučilišta, ${studijiCount} studija`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
