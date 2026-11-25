const STORAGE_KEY = "mojput_advent_local_guest";

/** Isključeno: dani su zatvoreni do 5. prosinca, i na localhostu. */
export const LOCAL_QUIZ_TEST_ENABLED = false;

export function isLocalhostBrowser(): boolean {
  if (!LOCAL_QUIZ_TEST_ENABLED) return false;
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

export function getOrCreateLocalGuestKey(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY) || "";
    if (/^[a-z0-9]{8,32}$/.test(existing)) return existing;
    const raw = (globalThis.crypto?.randomUUID?.() || `${Date.now()}${Math.random()}`)
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();
    const next = raw.slice(0, 16).padEnd(8, "a");
    localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return "localguest";
  }
}

export function rotateLocalGuestKey(): string {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return getOrCreateLocalGuestKey();
}

export function localGuestHeaders(): Record<string, string> {
  if (!isLocalhostBrowser()) return {};
  return { "X-Advent-Local-Guest": getOrCreateLocalGuestKey() };
}
