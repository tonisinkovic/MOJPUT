import {
  adventSeason,
  calendarDayOfMonth,
  getCalendarEndDate,
  getCalendarStartDate,
  getQuizEndDate,
  getQuizStartDate,
  isAfterSeasonCalendarDay,
  isChristmasCalendarDay,
  isDayKeyQuizDay,
  isFinalListCalendarDay,
  isPreSeasonCalendarDay,
  listCalendarDayKeys,
} from "@/lib/adventSeasonConfig";
import { isQuizDayUnlockedNow } from "@/lib/adventLeagueTime";

export type AdventDayStatus =
  | "locked"
  | "available"
  | "played"
  | "missed"
  | "catch_up"
  | "before_join"
  | "pre_season"
  | "christmas"
  | "final_list"
  | "after_season";

export type AdventCalendarDay = {
  dayNumber: number;
  dayKey: string;
  status: AdventDayStatus;
  score?: number;
  label?: string;
};

export type AdventSeasonPhase = "before" | "active" | "after";

export type { CountdownTarget } from "@/lib/adventLeagueTime";
export {
  ADVENT_FIRST_QUIZ_OPEN_HOUR,
  getCountdownTarget,
  getFirstQuizOpenMs,
  getNextMidnightZagrebMs,
  getQuizDayUnlockMs,
  getZagrebLocalInstantMs,
  isQuizDayUnlockedNow,
} from "@/lib/adventLeagueTime";

const TZ = adventSeason.timezone || "Europe/Zagreb";

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
  if (todayKey < getCalendarStartDate()) return "before";
  if (todayKey > getCalendarEndDate()) return "after";
  return "active";
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
  return listCalendarDayKeys();
}

export function buildAdventCalendarDays(
  playedByDay: Record<string, number> = {},
  todayKey = getZagrebDayKey(),
  options?: { joinDayKey?: string | null; catchUpDayKey?: string | null },
): AdventCalendarDay[] {
  const joinDayKey = options?.joinDayKey || getQuizStartDate();
  const catchUpDayKey = options?.catchUpDayKey ?? null;
  const dayKeys = listCalendarDayKeys();
  return dayKeys.map((dayKey) => {
    const dayNum = calendarDayOfMonth(dayKey);

    if (isChristmasCalendarDay(dayKey)) {
      return {
        dayNumber: dayNum,
        dayKey,
        status: "christmas",
        label: "Božić — bez kviza",
      };
    }

    if (isFinalListCalendarDay(dayKey)) {
      return {
        dayNumber: dayNum,
        dayKey,
        status: dayKey > todayKey ? "locked" : "final_list",
        label: "Konačna lista",
      };
    }

    if (isPreSeasonCalendarDay(dayKey)) {
      return { dayNumber: dayNum, dayKey, status: "pre_season", label: "Prije kviza (1.–4.)" };
    }

    if (isAfterSeasonCalendarDay(dayKey)) {
      return { dayNumber: dayNum, dayKey, status: "after_season", label: "Nakon lige" };
    }

    const score = playedByDay[dayKey];
    const isQuiz = isDayKeyQuizDay(dayKey);
    let status: AdventDayStatus = "locked";

    if (!isQuiz) status = "locked";
    else if (dayKey > todayKey) status = "locked";
    else if (dayKey < joinDayKey) status = "before_join";
    else if (score != null) status = "played";
    else if (catchUpDayKey === dayKey) status = "catch_up";
    else if (dayKey < todayKey) status = "missed";
    else status = "available";

    const realToday = getZagrebDayKey();
    if (status === "available" && dayKey === todayKey && realToday === todayKey && !isQuizDayUnlockedNow(dayKey)) {
      status = "locked";
    }

    const label = dayKey === getQuizEndDate() ? "Badnjak + kviz" : undefined;

    return {
      dayNumber: dayNum,
      dayKey,
      status,
      score,
      label,
    };
  });
}

export const ADVENT_RULES_SHORT = [
  "Bodove možeš dobiti isključivo rješavanjem dnevnog kviza — ni referral, ni nagradna igra ne dodaju bodove.",
  "Jedan MojPut račun — jedan pokušaj po adventskom danu kviza.",
  "Točan odgovor donosi bodove prema brzini; brži točan odgovor vrijedi više.",
  "Kalendar 1.–31. 12.: kviz 5.–24. (zadnji dan Badnjak), 25. 12. Božić (nema kviza), 26. 12. objava konačne ljestvice.",
  "Došao preko referral linka? Možeš jednom nadoknaditi najraniji propušteni dan nakon prijave.",
  "Za igru trebaš prijavljen i potvrđen MojPut račun.",
] as const;

export { adventSeason as adventSeasonMeta };