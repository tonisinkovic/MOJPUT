import season from "@/data/advent-league/season.json";

export type AdventSeasonFile = {
  year: number;
  calendarStartDate?: string;
  startDate: string;
  quizEndDate?: string;
  christmasDate?: string;
  finalResultsDate?: string;
  endDate: string;
  timezone: string;
  scoringVersion: number;
};

export const adventSeason = season as AdventSeasonFile;

export function getCalendarStartDate(s = adventSeason): string {
  return s.calendarStartDate || s.startDate;
}

export function getQuizStartDate(s = adventSeason): string {
  return s.startDate;
}

export function getQuizEndDate(s = adventSeason): string {
  return s.quizEndDate || s.endDate;
}

export function getChristmasDate(s = adventSeason): string {
  if (s.christmasDate) return s.christmasDate;
  const end = getQuizEndDate(s);
  const d = new Date(`${end}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function getFinalResultsDate(s = adventSeason): string {
  if (s.finalResultsDate) return s.finalResultsDate;
  const xmas = getChristmasDate(s);
  const d = new Date(`${xmas}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export type AdventCalendarCellKind = "pre" | "quiz" | "badnjak" | "christmas" | "final_list" | "after";

export function getAdventCalendarCellKind(dayKey: string, s = adventSeason): AdventCalendarCellKind {
  const n = calendarDayOfMonth(dayKey);
  if (n >= 1 && n <= 4) return "pre";
  if (n >= 27) return "after";
  if (dayKey === getChristmasDate(s)) return "christmas";
  if (dayKey === getFinalResultsDate(s)) return "final_list";
  if (dayKey === getQuizEndDate(s)) return "badnjak";
  return "quiz";
}

export function getCalendarEndDate(s = adventSeason): string {
  return s.endDate;
}

export function calendarDayOfMonth(dayKey: string): number {
  return Number(dayKey.slice(8, 10)) || 0;
}

export function isDayKeyQuizDay(dayKey: string, s = adventSeason): boolean {
  return dayKey >= getQuizStartDate(s) && dayKey <= getQuizEndDate(s);
}

export function isDayKeyInCalendar(dayKey: string, s = adventSeason): boolean {
  return dayKey >= getCalendarStartDate(s) && dayKey <= getCalendarEndDate(s);
}

export function isChristmasCalendarDay(dayKey: string, s = adventSeason): boolean {
  return dayKey === getChristmasDate(s);
}

export function isBadnjakCalendarDay(dayKey: string, s = adventSeason): boolean {
  return dayKey === getQuizEndDate(s);
}

/** @deprecated */
export function isFinaleCalendarDay(dayKey: string, s = adventSeason): boolean {
  return isChristmasCalendarDay(dayKey, s);
}

export function isPreSeasonCalendarDay(dayKey: string, s = adventSeason): boolean {
  return dayKey >= getCalendarStartDate(s) && dayKey < getQuizStartDate(s);
}

export function isFinalListCalendarDay(dayKey: string, s = adventSeason): boolean {
  return dayKey === getFinalResultsDate(s);
}

export function isAfterSeasonCalendarDay(dayKey: string, s = adventSeason): boolean {
  return dayKey > getFinalResultsDate(s) && dayKey <= getCalendarEndDate(s);
}

/** @deprecated */
export function isPostChristmasCalendarDay(dayKey: string, s = adventSeason): boolean {
  return isAfterSeasonCalendarDay(dayKey, s);
}

export function listQuizDayKeys(s = adventSeason): string[] {
  const keys: string[] = [];
  const end = getQuizEndDate(s);
  let cursor = getQuizStartDate(s);
  while (cursor <= end) {
    keys.push(cursor);
    const d = new Date(`${cursor}T12:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return keys;
}

export function listCalendarDayKeys(s = adventSeason): string[] {
  const keys: string[] = [];
  const end = getCalendarEndDate(s);
  let cursor = getCalendarStartDate(s);
  while (cursor <= end) {
    keys.push(cursor);
    const d = new Date(`${cursor}T12:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return keys;
}

export const ADVENT_QUIZ_DAYS = listQuizDayKeys().length;