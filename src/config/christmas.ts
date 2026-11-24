/**
 * Božićna tema — ručni prekidač + automatsko gašenje nakon datuma.
 *
 * `CHRISTMAS_MANUAL_ENABLED = false` → odmah bez vizualnih artefakata.
 * Nakon `CHRISTMAS_THEME_END_YMD` (23:59 Europe/Zagreb) tema se sama isključuje.
 */
export const CHRISTMAS_MANUAL_ENABLED = true;

/** Kraj prikaza (uključuje 6.–7. 1. blagdane). Format YYYY-MM-DD. */
export const CHRISTMAS_THEME_END_YMD = "2027-01-07";

const TZ = "Europe/Zagreb";

/** Je li božićna tema aktivna u danom trenutku (Zagreb). */
export function isChristmasThemeActive(at = new Date()): boolean {
  if (!CHRISTMAS_MANUAL_ENABLED) return false;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(at);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  const todayKey = `${y}-${m}-${d}`;

  return todayKey <= CHRISTMAS_THEME_END_YMD;
}

/**
 * Za uvjetni render u komponentama (pozovi u tijelu komponente, ne kao konstantu pri importu).
 * @deprecated Koristi `isChristmasThemeActive()` — ovo ostaje samo kao alias u starijem kodu.
 */
export const CHRISTMAS_THEME_ENABLED = CHRISTMAS_MANUAL_ENABLED;