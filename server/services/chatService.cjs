const path = require("path");
const fs = require("fs");

/** Bez ovoga `require` cijelog modula puca na deployu ako `prisma generate` nije pokrenut — tada nema /api/chat rute (404). */
let PrismaClient = null;
try {
  PrismaClient = require("@prisma/client").PrismaClient;
} catch (e) {
  console.warn("[chatService] @prisma/client nije dostupan — koristim samo universities_data.json:", e?.message || e);
}

if (!process.env.DATABASE_URL && PrismaClient) {
  const dbPath = path.join(__dirname, "..", "..", "prisma", "chatbot.db");
  process.env.DATABASE_URL = `file:${dbPath}`;
}

let prisma = null;
if (PrismaClient) {
  try {
    prisma = new PrismaClient();
  } catch (e) {
    prisma = null;
    console.warn("[chatService] PrismaClient init:", e?.message);
  }
}

if (String(process.env.OPENAI_API_KEY || "").trim()) {
  const m = String(process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini").trim();
  const out = String(process.env.OPENAI_MAX_OUTPUT_TOKENS || "1200");
  const h = String(process.env.OPENAI_CHAT_HISTORY_MAX || "14");
  console.log("[chatService] Chat: OpenAI + RAG | model:", m, "| max_out:", out, "| history msgs:", h);
}

function loadFromJson() {
  const jsonPath = path.join(__dirname, "..", "..", "universities_data.json");
  if (!fs.existsSync(jsonPath)) return { gradovi: [], fakulteti: [], studiji: [] };
  try {
    const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const inst = Array.isArray(raw) ? raw : [];
    const gradoviSet = new Set();
    const fakultetiMap = new Map();
    for (const i of inst) {
      const city = String(i.city || "").trim();
      const name = String(i.name || "").trim();
      if (!city || !name) continue;
      gradoviSet.add(city);
      const key = `${name}__${city}`;
      if (!fakultetiMap.has(key)) {
        fakultetiMap.set(key, {
          id: fakultetiMap.size + 1,
          naziv: name,
          grad: city,
          sveuciliste: i.provider || null,
          studiji: [],
        });
      }
      const f = fakultetiMap.get(key);
      for (const p of i.programs || []) {
        const pn = String(p.name || "").trim();
        if (!pn) continue;
        const cutoff = p.cutoffByYear?.["2025"];
        f.studiji.push({
          id: f.studiji.length + 1,
          naziv_studija: pn,
          razina: /diplomski/.test(pn) && !/preddiplomski/.test(pn) ? "diplomski" : /stručni|strucni/i.test(pn) ? "stručni" : "preddiplomski",
          fakultet_id: f.id,
          bodovni_prag_2025: typeof cutoff === "number" ? Math.round(cutoff * 10) / 10 : null,
          fakultet: f,
        });
      }
    }
    const gradovi = [...gradoviSet].sort((a, b) => a.localeCompare(b, "hr")).map((n, i) => ({ id: i + 1, naziv: n }));
    const fakulteti = [...fakultetiMap.values()];
    const studiji = fakulteti.flatMap((f) => f.studiji);
    return { gradovi, fakulteti, studiji };
  } catch (e) {
    console.error("[chatService] Greška učitavanja JSON:", e?.message);
    return { gradovi: [], fakulteti: [], studiji: [] };
  }
}

const FAKULTET_TIPOVI = [
  "pravni", "ekonomski", "medicinski", "filozofski", "elektrotehnike", "računarstva", "informatike",
  "kemijskog", "građevinski", "prometnih", "političkih", "organizacije", "strojarstva", "geodetski",
  "rudarski", "odgojno", "učiteljski", "farmaceutsko", "veterinarski", "agronomski", "šumarski",
  "tehnički", "prirodoslovno", "kineziološki", "grafički", "tekstilno", "arhitekture", "prehrambeno",
  "biotehnički", "biotehnološki", "stomatološki", "zdravstvenih", "turizma", "sporta", "umjetnosti", "muzičke",
];
const TIP_VARIJANTE = { pravne: "pravni", ekonomske: "ekonomski", medicinske: "medicinski", filozofske: "filozofski" };

// Alijasi za prepoznavanje fakulteta po kratici ili nazivu (iz baze / Karta fakulteta)
const FAKULTET_ALIJASI = {
  fer: "elektrotehnike i računarstva",
  fsb: "strojarstva i brodogradnje",
  fgag: "geodetski",
  fgagr: "građevinski",
  fkit: "kemijskog inženjerstva",
  foi: "organizacije i informatike",
  foof: "organizacije i informatike",
  fpz: "političkih znanosti",
  fpp: "prometnih znanosti",
  ffzg: "filozofski",
  efzg: "ekonomski",
  pfzg: "pravni",
  rgn: "rudarsko-geološko-naftni",
  pmf: "prirodoslovno-matematički",
  pmfzg: "prirodoslovno-matematički",
  algebra: "algebra",
  "algebra bernays": "algebra bernays",
  bernays: "algebra bernays",
  vern: "vern",
  "rit croatia": "rit croatia",
  rit: "rit croatia",
  tvz: "tehničko veleučilište",
  "tehničko veleučilište": "tehničko veleučilište",
  sjever: "sveučilište sjever",
  "sveučilište sjever": "sveučilište sjever",
  baltazar: "baltazar",
  "nikola tesla": "nikola tesla",
  mef: "medicinski",
  "međimursko": "međimursko",
  medimursko: "međimursko",
  aspira: "aspira",
  "veleučilište aspira": "aspira",
  arca: "arca",
  par: "par",
  "velika gorica": "velika gorica",
  "lavoslav ružička": "lavoslav ruzicka",
  "ružička": "lavoslav ruzicka",
  "marko marulić": "marko marulic",
  "marulić": "marko marulic",
  "franjo tuđman": "franjo tudman",
  "obrane i sigurnosti": "obrane i sigurnosti",
};

// Tip studija za pitanje "koji fakulteti imaju računarstvo"
const STUDIJ_TIPOVI = [
  { kljuc: "računarstvo", match: ["racunarstvo", "racunalstvo", "informatik", "informacijsk"] },
  { kljuc: "pravo", match: ["pravo"] },
  { kljuc: "medicina", match: ["medicin"] },
  { kljuc: "ekonomija", match: ["ekonomij", "poslovna"] },
  { kljuc: "psihologija", match: ["psihologij"] },
  { kljuc: "sestrinstvo", match: ["sestrinstv"] },
  { kljuc: "menadžment", match: ["menadzment", "menadžment"] },
  { kljuc: "elektrotehnika", match: ["elektrotehn", "elektro"] },
  { kljuc: "strojarstvo", match: ["strojarstvo"] },
  { kljuc: "građevina", match: ["gradevin", "gradjev"] },
];

const NEMA_PODATAKA = "Trenutno nemam podatke za to pitanje u bazi fakulteta.";

function normalizeForMatch(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/đ/g, "d")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

function extractKeywords(query) {
  const text = String(query || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
  return [...new Set(text)];
}

function parseQuestion(query, gradoviFromDb = []) {
  const q = String(query || "").trim();
  const qNorm = normalizeForMatch(q);
  const keywords = extractKeywords(query);

  const parsed = {
    grad: null,
    fakultetNaziv: null,
    fakultetTip: null,
    studijTip: null,
    pitanjeFakulteti: false,
    pitanjeStudiji: false,
    pitanjeBodovniPrag: false,
    pitanjeGradovi: false,
  };

  // Pitanje o gradovima ("koji gradovi imaju pravne fakultete") — NE miješati s imenom grada
  parsed.pitanjeGradovi = /koji\s*(sve\s*)?gradovi|u\s+kojim\s*gradovima|koji\s*gradovi\s+imaju/i.test(q);

  // Grad — koristi gradove iz baze; preskoči ako je pitanje O gradovima (ne filtriraj po gradu)
  const rijecGradovi = ["gradovi", "gradovima", "gradove"];
  const isRijecGradovi = (k) => rijecGradovi.includes(normalizeForMatch(k));
  const gradoviList = gradoviFromDb.length > 0 ? gradoviFromDb.map((g) => g.naziv) : ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Pula", "Dubrovnik", "Šibenik", "Varaždin", "Bjelovar", "Čakovec", "Karlovac", "Sisak", "Vinkovci", "Požega", "Slavonski Brod", "Biograd na Moru", "Opatija", "Gospić", "Ivanić-Grad", "Knin", "Kutina", "Nova Gradiška", "Pazin", "Petrinja", "Poreč", "Pregrada", "Križevci", "Koprivnica", "Krapina", "Đakovo", "Đurđevac", "Orahovica"];
  for (const g of gradoviList) {
    const gNorm = normalizeForMatch(g);
    if (parsed.pitanjeGradovi && gNorm.length <= 4) continue;
    const match = qNorm.includes(gNorm) || keywords.some((k) => !isRijecGradovi(k) && (gNorm.includes(normalizeForMatch(k)) || normalizeForMatch(k).includes(gNorm)));
    if (match) {
      parsed.grad = gNorm;
      break;
    }
  }

  // Specifični fakultet (FER, FSB, Algebra, Vern, itd.)
  for (const [alias, dio] of Object.entries(FAKULTET_ALIJASI)) {
    const aliasNorm = normalizeForMatch(alias);
    const dioNorm = normalizeForMatch(dio);
    if (qNorm.includes(aliasNorm) || qNorm.includes(dioNorm) || keywords.some((k) => normalizeForMatch(k) === aliasNorm || normalizeForMatch(k) === dioNorm)) {
      parsed.fakultetNaziv = dio;
      break;
    }
  }

  // Tip fakulteta (pravni, ekonomski, ...)
  if (!parsed.fakultetNaziv) {
    for (const kw of keywords) {
      const kwNorm = normalizeForMatch(kw);
      if (TIP_VARIJANTE[kwNorm]) {
        parsed.fakultetTip = TIP_VARIJANTE[kwNorm];
        break;
      }
    }
    if (!parsed.fakultetTip) {
      for (const tip of FAKULTET_TIPOVI) {
        const tipNorm = normalizeForMatch(tip);
        if (qNorm.includes(tipNorm) || keywords.some((k) => tipNorm.includes(normalizeForMatch(k)))) {
          parsed.fakultetTip = tip;
          break;
        }
      }
    }
  }

  // Tip studija (računarstvo, pravo, medicina - za "koji fakulteti imaju X")
  for (const st of STUDIJ_TIPOVI) {
    for (const m of st.match) {
      if (qNorm.includes(m) || keywords.some((k) => normalizeForMatch(k).includes(m) || m.includes(normalizeForMatch(k)))) {
        parsed.studijTip = st.kljuc;
        break;
      }
    }
    if (parsed.studijTip) break;
  }

  // Vrsta pitanja
  parsed.pitanjeFakulteti = /koji\s*fakultet|koje\s*fakultet|fakultet\s*u\s+|pravni\s*fakultet|ekonomski\s*fakultet|u\s+hrvatskoj/i.test(q) || (qNorm.includes("fakultet") && (qNorm.includes("koji") || qNorm.includes("koje") || qNorm.includes("imaju") || qNorm.includes("ima")));
  const pitanjeSmjerovaIliPrograma =
    /koje\s+smjer|koji\s+smjer|smjerov|smjerove|smjerovi|studijsk|studijske\s+programe|koje\s+studij|koji\s+studij|studij\s*ima|studije\s*ima|što\s+nudi|sto\s+nudi|koje\s+nudi|koji\s+nudi|koje\s+to\s+nudi|koji\s+to\s+nudi/i.test(
      q,
    ) ||
    /programi?\s+(ima|nudi|postoje)|koji\s+programi|koje\s+programi/i.test(q);
  parsed.pitanjeStudiji =
    pitanjeSmjerovaIliPrograma ||
    /koje\s*studij|koji\s*studij|ima\s+fer|ima\s+fsb|ima\s+algebra|ima\s+vern|ima\s+rit/i.test(q) ||
    (qNorm.includes("studij") && (qNorm.includes("koji") || qNorm.includes("koje"))) ||
    (qNorm.includes("fer") && qNorm.includes("ima")) ||
    (qNorm.includes("fsb") && qNorm.includes("ima")) ||
    (qNorm.includes("algebra") && qNorm.includes("ima")) ||
    (qNorm.includes("vern") && qNorm.includes("ima"));
  parsed.pitanjeBodovniPrag = /bodovn[iy]\s*prag|prag\s*bodov|bodovn[iy]\s*pragov/i.test(q) || (qNorm.includes("bod") && qNorm.includes("prag"));

  return parsed;
}

const STOP_RIJECI = new Set(["koji", "koje", "koja", "ima", "imaju", "studij", "studije", "fakultet", "fakulteti", "u", "za", "sve", "svi", "hrvatskoj", "grad", "gradovi", "bodovni", "prag", "pragovi", "veleuciliste", "sveuciliste", "veleučilište", "sveučilište", "nudi", "postoje", "kojima"]);

async function searchRelevantData(query) {
  let gradovi = [];
  let allFakulteti = [];
  let allStudiji = [];

  if (prisma != null) {
    try {
      gradovi = await prisma.grad.findMany({ orderBy: { naziv: "asc" } });
      allFakulteti = await prisma.fakultet.findMany({
        include: { studiji: true },
        orderBy: { naziv: "asc" },
      });
      allStudiji = await prisma.studij.findMany({
        include: { fakultet: true },
        orderBy: { naziv_studija: "asc" },
      });
    } catch (err) {
      console.warn("[chatService] Prisma greška, koristim JSON:", err?.message);
    }
  }

  if (gradovi.length === 0 || allFakulteti.length === 0) {
    const jsonData = loadFromJson();
    gradovi = jsonData.gradovi;
    allFakulteti = jsonData.fakulteti;
    allStudiji = jsonData.studiji;
  }

  const parsed = parseQuestion(query, gradovi);

  let fakulteti = [];
  let studiji = [];

  const gradNorm = parsed.grad ? normalizeForMatch(parsed.grad) : null;
  const tipNorm = parsed.fakultetTip ? normalizeForMatch(parsed.fakultetTip) : null;
  let fakultetNazivNorm = parsed.fakultetNaziv ? normalizeForMatch(parsed.fakultetNaziv) : null;

  // Dinamičko prepoznavanje fakulteta iz baze — bilo koje pitanje o fakultetu/veleučilištu
  if (!parsed.fakultetNaziv) {
    const keywords = extractKeywords(query).filter((k) => k.length >= 3 && !STOP_RIJECI.has(normalizeForMatch(k)));
    for (const kw of keywords) {
      const kwNorm = normalizeForMatch(kw);
      const match = allFakulteti.find((f) => normalizeForMatch(f.naziv).includes(kwNorm));
      if (match) {
        parsed.fakultetNaziv = kw;
        fakultetNazivNorm = kwNorm;
        parsed.pitanjeStudiji = true;
        break;
      }
    }
  }

  // 1. Specifični fakultet (npr. "Koje studije ima FER?", "Koje studije ima Algebra?")
  if (parsed.fakultetNaziv) {
    fakulteti = allFakulteti.filter((f) => {
      const fNorm = normalizeForMatch(f.naziv);
      return fNorm.includes(fakultetNazivNorm);
    });
    if (parsed.grad) {
      fakulteti = fakulteti.filter((f) => normalizeForMatch(f.grad) === gradNorm || normalizeForMatch(f.grad).includes(gradNorm));
    }
    studiji = allStudiji.filter((s) => fakulteti.some((f) => f.id === s.fakultet_id));
  }
  // 2. Fakulteti u gradu s određenim studijem (npr. "Koji fakulteti u Zagrebu imaju računarstvo?")
  else if (parsed.grad && parsed.studijTip) {
    const st = STUDIJ_TIPOVI.find((x) => x.kljuc === parsed.studijTip);
    let studijiMatch = allStudiji.filter((s) => {
      const sNorm = normalizeForMatch(s.naziv_studija);
      const fGradNorm = s.fakultet ? normalizeForMatch(s.fakultet.grad) : "";
      if (fGradNorm !== gradNorm && !fGradNorm.includes(gradNorm)) return false;
      if (!st) return false;
      return st.match.some((m) => sNorm.includes(m));
    });
    const fakultetIds = [...new Set(studijiMatch.map((s) => s.fakultet_id))];
    fakulteti = allFakulteti.filter((f) => fakultetIds.includes(f.id));
    studiji = studijiMatch;
  }
  // 3. Fakulteti određenog tipa (npr. "Koji su pravni fakulteti u Hrvatskoj?")
  else if (parsed.fakultetTip) {
    fakulteti = allFakulteti.filter((f) => normalizeForMatch(f.naziv).includes(tipNorm));
    if (parsed.grad) {
      fakulteti = fakulteti.filter((f) => normalizeForMatch(f.grad) === gradNorm || normalizeForMatch(f.grad).includes(gradNorm));
    }
    studiji = allStudiji.filter((s) => fakulteti.some((f) => f.id === s.fakultet_id));
  }
  // 4. Fakulteti koji imaju određeni studij (npr. "Koji fakulteti imaju računarstvo?")
  else if (parsed.studijTip) {
    const st = STUDIJ_TIPOVI.find((x) => x.kljuc === parsed.studijTip);
    let studijiMatch = allStudiji.filter((s) => {
      const sNorm = normalizeForMatch(s.naziv_studija);
      return st && st.match.some((m) => sNorm.includes(m));
    });
    if (parsed.grad) {
      studijiMatch = studijiMatch.filter((s) => s.fakultet && (normalizeForMatch(s.fakultet.grad) === gradNorm || normalizeForMatch(s.fakultet.grad).includes(gradNorm)));
    }
    const fakultetIds = [...new Set(studijiMatch.map((s) => s.fakultet_id))];
    fakulteti = allFakulteti.filter((f) => fakultetIds.includes(f.id));
    studiji = studijiMatch;
  }
  // 5. Samo grad (npr. "Koji fakulteti su u Zagrebu?")
  else if (parsed.grad) {
    fakulteti = allFakulteti.filter((f) => normalizeForMatch(f.grad) === gradNorm || normalizeForMatch(f.grad).includes(gradNorm));
    studiji = allStudiji.filter((s) => fakulteti.some((f) => f.id === s.fakultet_id));
  }
  // 6. Pitanje "koji gradovi imaju pravne fakultete" — gradovi s fakultetima određenog tipa
  else if (parsed.pitanjeGradovi && parsed.fakultetTip) {
    fakulteti = allFakulteti.filter((f) => normalizeForMatch(f.naziv).includes(tipNorm));
    studiji = [];
  }
  // 7. Opće pitanje — široki kontekst za AI (ključne riječi + uzorak cijele baze)
  else {
    const kws = extractKeywords(query).filter((k) => k.length >= 2);
    const kNorm = kws.map((k) => normalizeForMatch(k));

    let fMatch = allFakulteti;
    let sMatch = allStudiji;
    if (kNorm.length) {
      fMatch = allFakulteti.filter((f) => {
        const blob = normalizeForMatch(`${f.naziv} ${f.grad}`);
        return kNorm.some((k) => blob.includes(k) || k.length >= 4 && blob.includes(k.slice(0, 4)));
      });
      sMatch = allStudiji.filter((s) => {
        const fac = s.fakultet || {};
        const blob = normalizeForMatch(`${s.naziv_studija} ${fac.naziv || ""} ${fac.grad || ""}`);
        return kNorm.some((k) => blob.includes(k) || k.length >= 4 && blob.includes(k.slice(0, 4)));
      });
    }
    if (fMatch.length === 0 && sMatch.length === 0) {
      fMatch = allFakulteti.slice(0, 100);
      sMatch = allStudiji.slice(0, 150);
    } else {
      fMatch = fMatch.slice(0, 80);
      sMatch = sMatch.slice(0, 120);
    }
    return { fakulteti: fMatch, studiji: sMatch, gradovi, parsed };
  }

  return { fakulteti, studiji, gradovi, parsed };
}

function getGlavniStudij(fakultet) {
  const studiji = (fakultet.studiji || []).filter((s) => s.bodovni_prag_2025 != null);
  if (studiji.length === 0) return null;
  const fNorm = normalizeForMatch(fakultet.naziv);
  const parovi = [
    { tip: "pravni", studij: "pravo" },
    { tip: "ekonomski", studij: "ekonomij" },
    { tip: "medicinski", studij: "medicin" },
    { tip: "računarstva", studij: "racunarstvo" },
    { tip: "elektrotehnike", studij: "elektrotehn" },
  ];
  for (const p of parovi) {
    if (fNorm.includes(normalizeForMatch(p.tip))) {
      const glavni = studiji.find((s) => {
        const n = normalizeForMatch(s.naziv_studija);
        return n.includes(p.studij) && !n.includes("izvanredn") && s.razina === "preddiplomski";
      });
      if (glavni) return glavni;
    }
  }
  const preddiplomski = studiji.filter((s) => s.razina === "preddiplomski" && !normalizeForMatch(s.naziv_studija).includes("izvanredn"));
  return preddiplomski.length > 0 ? preddiplomski.sort((a, b) => (b.bodovni_prag_2025 || 0) - (a.bodovni_prag_2025 || 0))[0] : studiji[0];
}

function formatOdgovor(parsed, fakulteti, studiji) {

  // Bodovni prag
  if (parsed.pitanjeBodovniPrag) {
    if (fakulteti.length === 0 && studiji.length === 0) return NEMA_PODATAKA;
    if (fakulteti.length === 1) {
      const f = fakulteti[0];
      const glavni = getGlavniStudij(f);
      if (glavni) return `Bodovni prag za **${glavni.naziv_studija}** na **${f.naziv}** (${f.grad}) iznosi **${glavni.bodovni_prag_2025}** bodova (2025.).`;
      const svi = (f.studiji || []).filter((s) => s.bodovni_prag_2025 != null);
      if (svi.length > 0) return `Bodovni pragovi na **${f.naziv}** (${f.grad}) za 2025.:\n\n` + svi.map((s) => `• ${s.naziv_studija}: **${s.bodovni_prag_2025}** bodova`).join("\n");
    }
    if (fakulteti.length > 1 && fakulteti.length <= 15) {
      const linije = fakulteti.map((f) => {
        const glavni = getGlavniStudij(f);
        if (glavni) return `• **${f.naziv}** (${f.grad}): ${glavni.naziv_studija} — **${glavni.bodovni_prag_2025}** bodova (2025.)`;
        return `• **${f.naziv}** (${f.grad}): nema podataka`;
      });
      return `Bodovni pragovi (glavni preddiplomski studij, 2025.):\n\n${linije.join("\n")}`;
    }
  }

  // Koje studije / smjerove ima X (specifični fakultet ili tip + grad, npr. ekonomski u Splitu)
  if (parsed.pitanjeStudiji && fakulteti.length > 0) {
    const dijelovi = fakulteti.map((f) => {
      const fromRel = (f.studiji || []).map((s) => s.naziv_studija);
      const fromFlat = studiji.filter((s) => s.fakultet_id === f.id).map((s) => s.naziv_studija);
      const svi = [...new Set([...fromRel, ...fromFlat])];
      if (svi.length === 0) return `**${f.naziv}** (${f.grad}): nema podataka o studijima u bazi`;
      return `**${f.naziv}** (${f.grad}):\n\n` + svi.map((s, i) => `${i + 1}. ${s}`).join("\n");
    });
    return dijelovi.join("\n\n");
  }

  // Koji fakulteti imaju X (s filtriranim studijima)
  if (parsed.studijTip && studiji.length > 0) {
    const uniqueFakulteti = [];
    const seen = new Set();
    for (const s of studiji) {
      if (s.fakultet && !seen.has(s.fakultet_id)) {
        seen.add(s.fakultet_id);
        uniqueFakulteti.push(s.fakultet);
      }
    }
    if (uniqueFakulteti.length === 0) return NEMA_PODATAKA;
    const naslov = parsed.grad
      ? `Fakulteti u ${parsed.grad.charAt(0).toUpperCase() + parsed.grad.slice(1)} s studijem ${parsed.studijTip}:\n\n`
      : `Fakulteti s studijem ${parsed.studijTip}:\n\n`;
    return naslov + uniqueFakulteti.map((f, i) => `${i + 1}. ${f.naziv} (${f.grad})`).join("\n");
  }

  // Koji gradovi imaju pravne/ekonomske/... fakultete
  if (parsed.pitanjeGradovi && fakulteti.length > 0) {
    const gradoviSet = new Map();
    for (const f of fakulteti) {
      const g = f.grad;
      if (!gradoviSet.has(g)) gradoviSet.set(g, f.naziv);
    }
    const gradoviLista = [...gradoviSet.keys()].sort((a, b) => a.localeCompare(b, "hr"));
    const tipCap = parsed.fakultetTip ? (parsed.fakultetTip.charAt(0).toUpperCase() + parsed.fakultetTip.slice(1)) : "";
    return `Gradovi u kojima postoje ${tipCap.toLowerCase()} fakulteti:\n\n` + gradoviLista.map((g, i) => `${i + 1}. ${g}`).join("\n");
  }

  // Pravni/ekonomski fakulteti u Hrvatskoj
  if (parsed.pitanjeFakulteti && fakulteti.length > 0) {
    const tipCap = parsed.fakultetTip ? parsed.fakultetTip.charAt(0).toUpperCase() + parsed.fakultetTip.slice(1) : "";
    const naslov = parsed.fakultetTip
      ? `${tipCap} fakulteti u Hrvatskoj:\n\n`
      : parsed.grad
        ? `Fakulteti u ${parsed.grad.charAt(0).toUpperCase() + parsed.grad.slice(1)}:\n\n`
        : `Fakulteti:\n\n`;
    return naslov + fakulteti.map((f, i) => `${i + 1}. ${f.naziv} (${f.grad})`).join("\n");
  }

  // Samo grad — popis ustanova (ne smjerova); ako ima studija u kontekstu, ne bi smjelo doći prije grane pitanjeStudiji
  if (parsed.grad && fakulteti.length > 0) {
    const gradIme = fakulteti[0]?.grad || (parsed.grad.charAt(0).toUpperCase() + parsed.grad.slice(1));
    return `Fakulteti u ${gradIme}:\n\n` + fakulteti.map((f, i) => `${i + 1}. ${f.naziv} (${f.grad})`).join("\n");
  }

  // Fallback: imamo podatke ali nijedan specifični format
  if (fakulteti.length > 0) {
    return fakulteti.map((f, i) => `${i + 1}. ${f.naziv} (${f.grad})`).join("\n");
  }

  return NEMA_PODATAKA;
}

function generateResponse(query, data) {
  const { fakulteti, studiji, parsed } = data;

  if (fakulteti.length === 0 && studiji.length === 0) {
    return NEMA_PODATAKA;
  }

  return formatOdgovor(parsed, fakulteti, studiji);
}

/** Tekst za RAG — namjerno kraći rezovi da ulaz u API bude jeftiniji (manje tokena). */
function buildDatabaseContextSnippet(data) {
  const { fakulteti = [], studiji = [] } = data || {};
  const lines = [];
  if (fakulteti.length) {
    lines.push("=== Fakulteti (iz baze) ===");
    for (const f of fakulteti.slice(0, 55)) {
      const n = f.naziv || f.name || "";
      const g = f.grad || f.city || "";
      if (n) lines.push(`- ${n} (${g})`);
    }
  }
  if (studiji.length) {
    lines.push("=== Studiji i bodovni prag 2025. (ako je u bazi) ===");
    for (const s of studiji.slice(0, 70)) {
      const ns = s.naziv_studija || s.name || "";
      const fac = s.fakultet || {};
      const fn = fac.naziv || "";
      const fg = fac.grad || "";
      const prag = s.bodovni_prag_2025;
      const p = prag != null && prag !== undefined ? ` | prag 2025: ${prag} bod.` : "";
      if (ns) lines.push(`- ${ns} — ${fn} (${fg})${p}`);
    }
  }
  const out = lines.join("\n");
  if (!out.trim()) {
    return "";
  }
  return out.length > 12000 ? `${out.slice(0, 12000)}\n…(skraćeno)` : out;
}

/** Kratki opći kontekst (manje tokena nego duga lista). */
const OPENAI_FACULTY_CONTEXT =
  "FER: zahtjevan, jak za IT karijeru. FOI: praktičniji, više projekata, često lakši za neke. PMF: matematika/teorija. TVZ: praksa, manje teorije.";

const OPENAI_SYSTEM_PROMPT = `
Ti si Dražen — asistent u aplikaciji MojPut. Piši kao ChatGPT u dobrom razgovoru: prirodno, toplo, u odlomcima i povezanim rečenicama.
Na hrvatskom jeziku. Izbjegavaj „robotski” nabrajalice i suhe popise kao glavni oblik odgovora — radije objasni, usporedi, daj primjere.
Kratke liste ili točke koristi samo kad korisnik traži pregled ili kad stvarno pomaže čitljivosti; inače pričaj kao čovjek.

Kad ispod imaš PODACI IZ BAZE, to su činjenice o fakultetima i studijima iz naše baze — ugradi ih u odgovor (nazivi gradova, pragovi ako postoje), ne kopiraj ih kao suhi katalog bez komentara.
Za pitanja tipa „koje smjerove/studije/program nudi fakultet X” ili „što nudi ekonomski u Splitu”: popis studija i točnih naziva mora biti isključivo iz PODACI IZ BAZE ispod — ne izmišljaj programe ni predmete. Ako u bloku nema dovoljno redaka, reci da u bazi nema cijelog popisa i predloži provjeru službene stranice fakulteta.
Ako u bazi nema konkretnog retka za pitanje, reci to kratko i svejedno pomogni savjetom; za službene datume i uvjete preporuči provjeru na stranicama fakulteta ili NISMO-a.

Za IT / matematiku / srodne smjerove često su relevantni FER, FOI, PMF, TVZ — koristi i opći kontekst ispod kad pomaže usporedbi (prednosti i mane u rečenicama, ne samo bulleti).

Budi dovoljno kratak: jasno i konkretno, bez dugog ponavljanja — štedi token korisnika.
`.trim();

/**
 * OpenAI + RAG: odgovor u razgovornom tonu, uz kontekst iz baze.
 */
async function chatOpenAI(messages, databaseContextSnippet) {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY nije postavljen");
  }

  // Zadano jeftiniji model; za jače modele postavi OPENAI_CHAT_MODEL u .env
  const model = String(process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini").trim();

  // Štednja: ograniči duljinu odgovora (izlazni tokeni) — povećaj u .env ako treba duže odgovore
  const maxOut = Number(process.env.OPENAI_MAX_OUTPUT_TOKENS || 1200);
  const maxTokens = Number.isFinite(maxOut) ? Math.min(4096, Math.max(200, maxOut)) : 1200;

  // Štednja: šalji samo zadnjih N poruka (ulazni tokeni)
  const histN = Number(process.env.OPENAI_CHAT_HISTORY_MAX || 14);
  const historyMax = Number.isFinite(histN) ? Math.min(32, Math.max(4, histN)) : 14;

  const dbBlock =
    databaseContextSnippet && databaseContextSnippet.trim()
      ? `--- PODACI IZ BAZE (MojPut) — koristi za točne nazive i brojke ---\n${databaseContextSnippet}\n--- kraj podataka iz baze ---`
      : `--- PODACI IZ BAZE: za ovo pitanje nema dovoljno redaka u bazi — odgovori svejedno prijateljski i predloži što dodatno pitati. ---`;

  const system = `${OPENAI_SYSTEM_PROMPT}\n\n${dbBlock}\n\n--- Opći kontekst (FER, FOI, PMF, TVZ) ---\n${OPENAI_FACULTY_CONTEXT}`;

  const history = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      const c = m.content;
      if (m.role === "assistant") {
        return { role: "assistant", content: String(c ?? "") };
      }
      if (typeof c === "string") {
        return { role: "user", content: c };
      }
      if (Array.isArray(c)) {
        return { role: "user", content: c };
      }
      return { role: "user", content: String(c ?? "") };
    })
    .slice(-historyMax);

  const openaiMessages = [{ role: "system", content: system }, ...history];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: openaiMessages,
      temperature: 0.65,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[chatOpenAI]", res.status, errText.slice(0, 400));
    throw new Error(`OpenAI API (${res.status}). Provjeri OPENAI_API_KEY i model.`);
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Prazan odgovor od OpenAI");
  }
  return text;
}

function getMessageTextForRag(m) {
  const c = m?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    return c
      .filter((p) => p && p.type === "text" && p.text)
      .map((p) => p.text)
      .join("\n");
  }
  return "";
}

async function chatLocal(messages, mode = "senior") {
  // Junior mode: High schools chatbot - simplified for now
  if (mode === "junior") {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const query = getMessageTextForRag(lastUserMsg) || "";
    
    return `Hvala na pitanju o srednjim školama! 

Za sada preporučujem da koristiš **Kartu srednjih škola** na MojPut Junior platformi gdje možeš pregledati sve 443 srednje škole u Hrvatskoj, filtrirati ih po gradu i tipu škole, te vidjeti kontakte i web stranice.

Naprednije odgovore temeljene na AI-ju za srednje škole trenutno razvijamo. Uskoro ćeš moći postavljati detaljnija pitanja o upisu, smjerovima i usporedbi škola.

Možeš pitati:
- "Koje gimnazije ima u Zagrebu?"
- "Pokaz mi strukovne škole u Splitu"
- "Škole s IT smjerom"

U međuvremenu, karta srednjih škola i Forum za roditelje su ti na raspolaganju! 🎓`;
  }

  // Senior mode: Universities/faculties
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const query = getMessageTextForRag(lastUserMsg) || "";

  const useOpenAI = Boolean(String(process.env.OPENAI_API_KEY || "").trim());
  if (useOpenAI) {
    let relevantData;
    try {
      relevantData = await searchRelevantData(query);
    } catch (e0) {
      console.warn("[chatLocal] searchRelevantData (OpenAI put):", e0?.message || e0);
      relevantData = { fakulteti: [], studiji: [], gradovi: [], parsed: {} };
    }
    const dbSnippet = buildDatabaseContextSnippet(relevantData);
    try {
      return await chatOpenAI(messages, dbSnippet);
    } catch (err) {
      console.warn("[chatLocal] OpenAI neuspjeh, padam na odgovor iz lokalne baze:", err?.message || err);
      let relevantData;
      try {
        relevantData = await searchRelevantData(query);
      } catch (e2) {
        console.error("[chatLocal] searchRelevantData", e2);
        throw new Error(err?.message || "Greška pri generiranju odgovora.");
      }
      try {
        return generateResponse(query, relevantData);
      } catch (e2) {
        console.error("[chatLocal]", e2);
        throw new Error(err?.message || "Greška pri generiranju odgovora.");
      }
    }
  }

  let relevantData;
  try {
    relevantData = await searchRelevantData(query);
  } catch (err) {
    console.error("[chatLocal] searchRelevantData", err);
    throw new Error("Greška pri pretraživanju baze. Provjeri je li baza postavljena (npm run db:seed).");
  }

  try {
    return generateResponse(query, relevantData);
  } catch (err) {
    console.error("[chatLocal]", err);
    throw new Error("Greška pri pretraživanju baze. Provjeri je li baza postavljena (npm run db:seed).");
  }
}

const prismaOrFallback = prisma || {
  grad: { findMany: async () => loadFromJson().gradovi },
  fakultet: { findMany: async (opts = {}) => {
    const { grad } = opts?.where || {};
    let f = loadFromJson().fakulteti;
    if (grad) f = f.filter((x) => x.grad === grad);
    return f;
  }},
  studij: { findMany: async (opts = {}) => {
    const { fakultet_id } = opts?.where || {};
    let s = loadFromJson().studiji;
    if (fakultet_id) s = s.filter((x) => x.fakultet_id === fakultet_id);
    return s;
  }},
};

module.exports = { chatLocal, searchRelevantData, prisma: prismaOrFallback };
