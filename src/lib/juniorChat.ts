/**
 * Junior chatbot — samo baza: škole, programi, pragovi, upisni rokovi.
 * Ako nema podatka, kaže da ne zna. Ne izmišlja škole ni savjete.
 */

import { juniorEvents, nextUpcomingEvent, formatEventDate } from "@/data/calendarEvents";
import { highSchools } from "@/data/highSchools";
import { srednjaProgramCounties } from "@/data/srednjaPrograms";
import { findCutoff, findKalkulatorSchool, normalizeJuniorText } from "@/lib/juniorPath";
import { JUNIOR_NUMBERS_NOTE_SHORT } from "@/lib/juniorHonesty";
import { programHref } from "@/lib/juniorProgramGuide";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";

const UNKNOWN =
  "To nemam u svojoj bazi. Mogu ti reći samo o hrvatskim srednjim školama, smjerovima, lanjskim pragovima i upisnim rokovima. Ako pitaš konkretnije (grad + smjer), pogledam popis.";

function hasAny(q: string, words: string[]): boolean {
  return words.some((w) => q.includes(w));
}

function findCity(q: string): string | null {
  const hay = ` ${q} `;
  const cities = [...new Set(highSchools.map((s) => s.city))];
  let best: { city: string; len: number } | null = null;
  for (const city of cities) {
    const n = normalizeJuniorText(city);
    if (n.length < 3) continue;
    const hit = hay.includes(` ${n} `) || hay.includes(` u ${n}`);
    if (hit && (!best || n.length > best.len)) best = { city, len: n.length };
  }
  return best?.city ?? null;
}

function findProgram(q: string) {
  let best: { program: (typeof highSchoolPrograms)[number]; score: number } | null = null;
  for (const program of highSchoolPrograms) {
    let score = 0;
    const name = normalizeJuniorText(program.name);
    if (q.includes(name) && name.length >= 6) score += name.length + 8;
    for (const kw of program.matchKeywords) {
      const n = normalizeJuniorText(kw);
      if (n.length >= 5 && q.includes(n)) score += n.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { program, score };
  }
  return best?.score && best.score >= 5 ? best.program : null;
}

function findSchoolByName(q: string) {
  let best: { name: string; city: string; score: number } | null = null;
  for (const school of highSchools) {
    const n = normalizeJuniorText(school.name);
    if (n.length < 8) continue;
    if (!q.includes(n)) continue;
    if (!best || n.length > best.score) best = { name: school.name, city: school.city, score: n.length };
  }
  for (const county of srednjaProgramCounties) {
    for (const school of county.schools) {
      const n = normalizeJuniorText(school.name);
      if (n.length < 8 || !q.includes(n)) continue;
      if (!best || n.length > best.score) best = { name: school.name, city: school.city, score: n.length };
    }
  }
  return best;
}

function schoolsInCity(city: string, keyword?: string | null, limit = 10) {
  const cityN = normalizeJuniorText(city);
  const kw = keyword ? normalizeJuniorText(keyword) : null;
  const rows: { name: string; city: string; programs: string[] }[] = [];
  for (const county of srednjaProgramCounties) {
    for (const school of county.schools) {
      if (normalizeJuniorText(school.city) !== cityN) continue;
      if (kw && !school.programs.some((p) => normalizeJuniorText(p).includes(kw)) && !normalizeJuniorText(school.name).includes(kw)) {
        continue;
      }
      rows.push({ name: school.name, city: school.city, programs: school.programs });
    }
  }
  if (rows.length === 0) {
    return highSchools
      .filter((s) => normalizeJuniorText(s.city) === cityN)
      .filter((s) => !kw || normalizeJuniorText(s.name).includes(kw) || normalizeJuniorText(s.category).includes(kw))
      .slice(0, limit)
      .map((s) => ({ name: s.name, city: s.city, programs: [] as string[] }));
  }
  return rows.slice(0, limit);
}

function isOffTopic(q: string): boolean {
  return hasAny(q, [
    "fer ",
    "foi",
    "tvz",
    "pmf",
    "fakultet",
    "studij",
    "studentski dom",
    "bitcoin",
    "kriptoval",
    "recept",
    "nogometna utakmica",
    "domaca zadaca",
    "zadaća iz",
    "napiši esej",
    "napiši kod",
    "chatgpt",
  ]);
}

function listLines(items: string[]): string {
  return items.map((x) => `- ${x}`).join("\n");
}

export function answerJuniorFromBase(question: string): string {
  const q = normalizeJuniorText(question);
  if (q.length < 2) {
    return "Pitaj me konkretno: grad, smjer, ime škole, prag ili upisni rok. Drugo ne izmišljam.";
  }

  if (isOffTopic(q) && !hasAny(q, ["srednj", "gimnaz", "strukov", "upis"])) {
    return "To nije u bazi srednjih škola. Za fakultete prebaci se u MojPut Senior. Ovdje odgovaram samo o srednjoj: škole, smjerovi, pragovi i rokovi.";
  }

  if (hasAny(q, ["bok", "hej", "hello", "pomoc", "što mozes", "sto mozes", "tko si"])) {
    return "Ja sam Dražen. Gledam samo našu bazu: 443 srednje škole, smjerove, lanjski prag gdje ga imamo i upisne rokove. Ako nešto nije u bazi, reći ću da ne znam.";
  }

  if (hasAny(q, ["rok", "prijava", "kalendar", "ljestvic", "upisni"])) {
    const next = nextUpcomingEvent(juniorEvents);
    const upcoming = juniorEvents
      .filter((e) => new Date(e.year, e.month, e.day, 23, 59, 59).getTime() >= Date.now())
      .slice(0, 4);
    if (!next && upcoming.length === 0) {
      return "U kalendaru trenutno nemam sljedeći upisni rok. Provjeri službeni natječaj na stranici škole ili ministarstva.";
    }
    const lines = (upcoming.length ? upcoming : next ? [next] : []).map(
      (e) => `- ${formatEventDate(e)}: ${e.title}`,
    );
    return `Upisni rokovi iz našeg kalendara (2026.):\n${listLines(lines)}\n\nTočan datum za tvoju školu uvijek potvrdi na službenoj stranici — kalendar je orijentacija.`;
  }

  const named = findSchoolByName(q);
  if (named && hasAny(q, ["prag", "bodov", "upisni prag", "koliko bod"])) {
    const kalk = findKalkulatorSchool(named.name, named.city);
    if (!kalk) {
      return `Školu ${named.name} (${named.city}) imam na karti, ali lanjski prag za nju nisam našao u bazi kalkulatora. Neću ga pogoditi — pogledaj kalkulator ili stranicu škole.`;
    }
    const withPrag = kalk.programs.filter((p) => p.prag?.min != null).slice(0, 8);
    if (withPrag.length === 0) {
      return `Za ${kalk.name} nemam upisan prag u bazi. Znam školu, ali ne izmišljam brojke.`;
    }
    return `Lanjski pragovi koje imam za ${kalk.name}:\n${listLines(
      withPrag.map((p) => `${p.name}: ${p.prag!.min} bodova (${p.prag!.year ?? "zadnja godina"})`),
    )}\n\n${JUNIOR_NUMBERS_NOTE_SHORT}`;
  }

  const program = findProgram(q);
  const city = findCity(q);

  if (program && city) {
    const keyword = program.matchKeywords[0] ?? program.name;
    const schools = schoolsInCity(city, keyword, 8);
    if (schools.length === 0) {
      return `U bazi nemam školu u mjestu ${city} s programom „${program.name}”. Neću izmisliti popis. Probaj susjedni veći grad ili kartu srednjih škola.`;
    }
    const lines = schools.map((s) => {
      const cutoff = findCutoff(s.name, s.city, program);
      const prag = cutoff?.min != null ? ` · prag ${cutoff.min}` : "";
      return `${s.name} (${s.city})${prag}`;
    });
    return `Iz baze, u/oko mjesta ${city} za „${program.name}”:\n${listLines(lines)}\n\nViše: [${program.name}](${programHref(program)})\n\n${JUNIOR_NUMBERS_NOTE_SHORT}`;
  }

  if (program && hasAny(q, ["prag", "bodov"])) {
    return `Za program „${program.name}” prag ovisi o školi, nije jedan broj za cijelu Hrvatsku. Pitaj: „prag + ime škole” ili „${program.name} u [grad]”.`;
  }

  if (program) {
    const examples: string[] = [];
    for (const county of srednjaProgramCounties) {
      for (const school of county.schools) {
        const kw = program.matchKeywords.map(normalizeJuniorText);
        if (school.programs.some((p) => kw.some((k) => normalizeJuniorText(p).includes(k)))) {
          examples.push(`${school.name} (${school.city})`);
        }
        if (examples.length >= 8) break;
      }
      if (examples.length >= 8) break;
    }
    if (examples.length === 0) {
      return `Program „${program.name}” postoji u kvizu, ali u popisu škola nisam našao poklapanje po ključnim riječima. Ne izmišljam škole — potraži na karti.`;
    }
    return `„${program.name}” (${program.duration} god.) — ${program.description}\n\nNakon škole: ${program.afterSchool}\n\nŠkole iz baze koje nude sličan program:\n${listLines(examples)}\n\nViše: [${program.name}](${programHref(program)})\n\nDodaj grad ako želiš bliže tebi.`;
  }

  if (city && hasAny(q, ["gimnaz"])) {
    const schools = schoolsInCity(city, "gimnazija", 10);
    if (schools.length === 0) return `U bazi nemam gimnaziju u mjestu ${city}.`;
    return `Gimnazije u bazi za ${city}:\n${listLines(schools.map((s) => `${s.name}`))}`;
  }

  if (city && hasAny(q, ["strukov", "obrt", "tehnic"])) {
    const schools = highSchools
      .filter((s) => normalizeJuniorText(s.city) === normalizeJuniorText(city))
      .filter((s) => /strukov|obrt|tehnič/i.test(`${s.name} ${s.category}`))
      .slice(0, 10);
    if (schools.length === 0) return `U bazi nemam strukovnu/tehničku školu za ${city} pod tim filterom.`;
    return `Strukovne/tehničke škole u bazi za ${city}:\n${listLines(schools.map((s) => `${s.name} (${s.category})`))}`;
  }

  if (city) {
    const schools = schoolsInCity(city, null, 10);
    if (schools.length === 0) return `U bazi nemam srednju školu za grad „${city}”.`;
    return `Srednje škole u bazi za ${city} (prvih ${schools.length}):\n${listLines(
      schools.map((s) => s.name),
    )}\n\nSuzbi s smjerom, npr. „gimnazija u ${city}” ili „medicinska u ${city}”.`;
  }

  if (named) {
    const kalk = findKalkulatorSchool(named.name, named.city);
    const mapHit = highSchools.find(
      (s) => s.name === named.name && s.city === named.city,
    );
    const programs = kalk?.programs.slice(0, 8).map((p) => p.name)
      ?? srednjaProgramCounties
        .flatMap((c) => c.schools)
        .find((s) => s.name === named.name && s.city === named.city)
        ?.programs.slice(0, 8);
    const bits = [
      `${named.name} (${named.city}) je u našoj bazi.`,
      mapHit?.category ? `Vrsta: ${mapHit.category}.` : "",
      mapHit?.website ? `Web: ${mapHit.website}` : "",
      programs?.length ? `Programi koje imam:\n${listLines(programs)}` : "Popis programa za tu školu nisam našao.",
    ].filter(Boolean);
    return bits.join("\n");
  }

  if (hasAny(q, ["koliko skola", "koliko srednjih", "baza"])) {
    return `U bazi karte imam ${highSchools.length} srednjih škola i ${highSchoolPrograms.length} tipova programa u kvizu. Pitaj grad ili smjer.`;
  }

  return UNKNOWN;
}
