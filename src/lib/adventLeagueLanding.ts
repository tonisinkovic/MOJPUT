import { addDays, format, parseISO } from "date-fns";
import season from "@/data/advent-league/season.json";

export type AdventDayStatus = "locked" | "available" | "played" | "missed";

export type AdventCalendarDay = {
  dayNumber: number;
  dayKey: string;
  status: AdventDayStatus;
  score?: number;
};

export type AdventSeasonPhase = "before" | "active" | "after";

export type CountdownTarget = {
  phase: AdventSeasonPhase;
  label: string;
  targetIso: string | null;
};

const TZ = season.timezone || "Europe/Zagreb";

/** Samo za prikaz na landing stranici — nije izvor istine za kviz API. */
export function getZagrebDayKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

export function getSeasonPhase(todayKey = getZagrebDayKey()): AdventSeasonPhase {
  if (todayKey < season.startDate) return "before";
  if (todayKey > season.endDate) return "after";
  return "active";
}

/** Polnoć sljedećeg dana u Europe/Zagreb (približno preko offseta u klijentu). */
export function getNextMidnightZagrebMs(now = new Date()): number {
  const key = getZagrebDayKey(now);
  const [y, m, d] = key.split("-").map(Number);
  const guessUtc = Date.UTC(y, m - 1, d + 1, 0, 0, 0);
  for (let delta = -4 * 3600_000; delta <= 4 * 3600_000; delta += 60_000) {
    const candidate = new Date(guessUtc + delta);
    if (getZagrebDayKey(candidate) !== key && getZagrebDayKey(new Date(candidate.getTime() - 60_000)) === key) {
      return candidate.getTime();
    }
  }
  return guessUtc;
}

export function getCountdownTarget(now = new Date()): CountdownTarget {
  const phase = getSeasonPhase(getZagrebDayKey(now));
  if (phase === "before") {
    const startMs = new Date(`${season.startDate}T00:00:00`).getTime();
    return {
      phase,
      label: "Do početka lige",
      targetIso: new Date(startMs).toISOString(),
    };
  }
  if (phase === "after") {
    return { phase, label: "Liga je završila", targetIso: null };
  }
  return {
    phase,
    label: "Do sljedećeg dnevnog kviza",
    targetIso: new Date(getNextMidnightZagrebMs(now)).toISOString(),
  };
}

export function splitCountdown(ms: number) {
  const total = Math.max(0, ms);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

export function listAdventSeasonDayKeys(): string[] {
  const start = parseISO(season.startDate);
  return Array.from({ length: 24 }, (_, i) => format(addDays(start, i), "yyyy-MM-dd"));
}

export function buildAdventCalendarDays(
  playedByDay: Record<string, number> = {},
  todayKey = getZagrebDayKey(),
): AdventCalendarDay[] {
  const dayKeys = listAdventSeasonDayKeys();
  return dayKeys.map((dayKey, index) => {
    const score = playedByDay[dayKey];
    let status: AdventDayStatus = "locked";
    if (dayKey > todayKey) status = "locked";
    else if (dayKey < todayKey) status = score != null ? "played" : "missed";
    else status = score != null ? "played" : "available";
    return {
      dayNumber: index + 1,
      dayKey,
      status,
      score,
    };
  });
}

export const ADVENT_PRIZES_INFO = [
  {
    id: "top3",
    title: "Top 3 na ljestvici",
    description: "Posebne nagrade za najbolja tri mjesta nakon 24. dana.",
    emoji: "🏆",
  },
  {
    id: "streak",
    title: "Serija dana",
    description: "Nagrade za one koji redovito igraju — svaki otvoreni dan se računa.",
    emoji: "🔥",
  },
  {
    id: "draw",
    title: "Izvlačenje među igračima",
    description: "Svi koji sudjeluju imaju šansu u nagradnom izvlačenju (prema pravilima kampanje).",
    emoji: "🎁",
  },
] as const;

/** @deprecated Koristi ADVENT_PRIZES_INFO */
export const ADVENT_PRIZES_DEMO = ADVENT_PRIZES_INFO;

export const ADVENT_RULES_SHORT = [
  "Jedan MojPut račun — jedan pokušaj po adventskom danu.",
  "Točan odgovor donosi bodove; brži točan odgovor može donijeti vremenski bonus.",
  "Ljestvica rangira ukupne bodove tijekom sezone (1.–24. prosinca).",
  "Za igru trebaš prijavljen i potvrđen MojPut račun.",
  "Propušteni dan u MVP-u se ne može nadoknaditi — vrati se sutra.",
] as const;

export { season as adventSeasonMeta };