import { formatEventLine, seniorEvents, upcomingEvents } from "@/data/calendarEvents";
import type { Faculty } from "@/types/faculty";
import { areaCounts } from "./seniorHomeData";

export type SeniorDemoQuestion = { q: string; answer: (catalog: Faculty[], from?: Date) => string };

const ESTIMATE_NOTE =
  "„Okvirno” znači da je datum procijenjen prema prošloj godini dok službeni nije objavljen.";

function deadlines(from: Date): string {
  const next = upcomingEvents(seniorEvents, from, 4);
  if (next.length === 0) return "U kalendaru trenutno nema najavljenih rokova. [Pogledaj kalendar](/kalendar).";
  return `Sljedeći rokovi iz MojPut kalendara:\n- ${next.map(formatEventLine).join("\n- ")}\n\n${ESTIMATE_NOTE} [Cijeli kalendar](/kalendar)`;
}

function inCity(catalog: Faculty[], city: string): string {
  const list = catalog.filter((f) => f.city.trim().toLowerCase() === city.toLowerCase());
  if (list.length === 0) return `Za ${city} trenutno nemam ustanova u bazi.`;
  const shown = list.slice(0, 6).map((f) => f.name);
  const rest = list.length - shown.length;
  return `U gradu ${city} u bazi je **${list.length}** ustanova:\n- ${shown.join("\n- ")}${rest > 0 ? `\n- i još ${rest}` : ""}\n\n[Otvori kartu fakulteta](/karta)`;
}

function areas(catalog: Faculty[]): string {
  const top = areaCounts(catalog).slice(0, 6);
  return `Ustanove u bazi po područjima:\n- ${top.map((a) => `${a.area}: ${a.count}`).join("\n- ")}\n\nProfil svake ustanove vidiš na [popisu fakulteta](/fakulteti).`;
}

function dorms(from: Date): string {
  const next = upcomingEvents(
    seniorEvents.filter((e) => e.type === "Dom"),
    from,
    3,
  );
  if (next.length === 0) return "U kalendaru trenutno nema najavljenih natječaja za domove. [Kalendar](/kalendar)";
  return `Natječaji za studentske domove iz MojPut kalendara:\n- ${next.map(formatEventLine).join("\n- ")}\n\n${ESTIMATE_NOTE} Bodove možeš procijeniti u [kalkulatoru domova](/kalkulator-doma).`;
}

export const SENIOR_DEMO_QUESTIONS: SeniorDemoQuestion[] = [
  { q: "Koji su sljedeći rokovi?", answer: (_c, from = new Date()) => deadlines(from) },
  { q: "Koje ustanove ima u Splitu?", answer: (c) => inCity(c, "Split") },
  { q: "Koja područja studija postoje?", answer: (c) => areas(c) },
  { q: "Kada su natječaji za domove?", answer: (_c, from = new Date()) => dorms(from) },
];
