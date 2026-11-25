import {
  adventSeason,
  getCalendarStartDate,
  getFinalResultsDate,
  getQuizEndDate,
  getQuizStartDate,
} from "@/lib/adventSeasonConfig";

const TZ = adventSeason.timezone || "Europe/Zagreb";

/** Prvi dan kviza otvara se u 10:00 (Zagreb); sljedeći dani u ponoć. */
export const ADVENT_FIRST_QUIZ_OPEN_HOUR = 10;

export function getZagrebTimeParts(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    dayKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

/** Lokalno vrijeme u Europe/Zagreb za YYYY-MM-DD → UTC ms. */
export function getZagrebLocalInstantMs(dayKey: string, hour = 0, minute = 0, second = 0): number {
  const [y, m, d] = dayKey.split("-").map(Number);
  const guessUtc = Date.UTC(y, m - 1, d, hour - 1, minute, second);
  for (let delta = -5 * 3600_000; delta <= 5 * 3600_000; delta += 60_000) {
    const candidate = new Date(guessUtc + delta);
    const tp = getZagrebTimeParts(candidate);
    if (tp.dayKey === dayKey && tp.hour === hour && tp.minute === minute && tp.second === second) {
      return candidate.getTime();
    }
  }
  for (let delta = -5 * 3600_000; delta <= 5 * 3600_000; delta += 1000) {
    const candidate = new Date(guessUtc + delta);
    const tp = getZagrebTimeParts(candidate);
    if (tp.dayKey === dayKey && tp.hour === hour && tp.minute === minute && tp.second === second) {
      return candidate.getTime();
    }
  }
  return guessUtc;
}

export function getQuizDayUnlockMs(dayKey: string): number {
  if (dayKey === getQuizStartDate()) {
    return getZagrebLocalInstantMs(dayKey, ADVENT_FIRST_QUIZ_OPEN_HOUR, 0, 0);
  }
  return getZagrebLocalInstantMs(dayKey, 0, 0, 0);
}

export function getFirstQuizOpenMs(): number {
  return getQuizDayUnlockMs(getQuizStartDate());
}

export function isQuizDayUnlockedNow(dayKey: string, now = new Date()): boolean {
  if (dayKey < getQuizStartDate() || dayKey > getQuizEndDate()) return false;
  return now.getTime() >= getQuizDayUnlockMs(dayKey);
}

/** Polnoć sljedećeg dana u Europe/Zagreb. */
export function getNextMidnightZagrebMs(now = new Date()): number {
  const key = getZagrebTimeParts(now).dayKey;
  const [y, m, d] = key.split("-").map(Number);
  const guessUtc = Date.UTC(y, m - 1, d + 1, 0, 0, 0);
  for (let delta = -4 * 3600_000; delta <= 4 * 3600_000; delta += 60_000) {
    const candidate = new Date(guessUtc + delta);
    const ck = getZagrebTimeParts(candidate).dayKey;
    const prev = getZagrebTimeParts(new Date(candidate.getTime() - 60_000)).dayKey;
    if (ck !== key && prev === key) return candidate.getTime();
  }
  return guessUtc;
}

export type CountdownTarget = {
  phase: "before" | "active" | "after";
  label: string;
  targetIso: string | null;
};

export function getCountdownTarget(now = new Date()): CountdownTarget {
  const { dayKey: todayKey } = getZagrebTimeParts(now);
  const nowMs = now.getTime();
  const firstOpen = getFirstQuizOpenMs();
  const quizEnd = getQuizEndDate();
  const quizStart = getQuizStartDate();

  if (nowMs < firstOpen) {
    return {
      phase: todayKey < getCalendarStartDate() ? "before" : "active",
      label: "Do prvog dana kviza (5. 12. u 10:00)",
      targetIso: new Date(firstOpen).toISOString(),
    };
  }

  if (todayKey > adventSeason.endDate) {
    return { phase: "after", label: "Liga je završila", targetIso: null };
  }

  if (todayKey > quizEnd) {
    const listKey = getFinalResultsDate();
    const listMs = getZagrebLocalInstantMs(listKey, 0, 0, 0);
    if (todayKey < listKey || (todayKey === listKey && nowMs < listMs)) {
      return {
        phase: "active",
        label: "Do konačne liste (26. 12.)",
        targetIso: new Date(listMs).toISOString(),
      };
    }
    return { phase: "active", label: "Sezona je završila", targetIso: null };
  }

  const unlockToday = getQuizDayUnlockMs(todayKey);
  if (todayKey >= quizStart && todayKey <= quizEnd && nowMs < unlockToday) {
    return {
      phase: "active",
      label: todayKey === quizStart ? "Do početka kviza danas (10:00)" : "Do ponoći — novi dan",
      targetIso: new Date(unlockToday).toISOString(),
    };
  }

  const nextMidnight = getNextMidnightZagrebMs(now);
  const label =
    todayKey === quizEnd
      ? "Do kraja zadnjeg kviza (ponoć, Zagreb)"
      : "Do novih pitanja (ponoć, Zagreb)";

  return {
    phase: "active",
    label,
    targetIso: new Date(nextMidnight).toISOString(),
  };
}