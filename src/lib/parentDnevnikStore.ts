/**
 * Dnevnik razgovora — mini localStorage store za Junior roditeljski kutak.
 *
 * Namjena: roditelj zapisuje što je razgovarao s djetetom o odabiru srednje,
 * što je dijete reklo i koji je sljedeći korak. Export kao tekst služi za
 * razgovor s pedagogom.
 *
 * Podaci žive samo u pregledniku (ključ `mojput_parent_dnevnik_junior`).
 */

export type DnevnikEntry = {
  id: string;
  /** ISO datum (YYYY-MM-DD). */
  dateIso: string;
  teme: string;
  djeteKaze: string;
  sljedeciKorak: string;
};

const KEY = "mojput_parent_dnevnik_junior";

function safeRead(): DnevnikEntry[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is DnevnikEntry =>
        !!e &&
        typeof e.id === "string" &&
        typeof e.dateIso === "string" &&
        typeof e.teme === "string" &&
        typeof e.djeteKaze === "string" &&
        typeof e.sljedeciKorak === "string",
    );
  } catch {
    return [];
  }
}

function safeWrite(entries: DnevnikEntry[]) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* ignore quota / privacy mode */
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Vrati sve zapise, sortirane po datumu silazno (najnoviji prvi). */
export function loadEntries(): DnevnikEntry[] {
  return safeRead().sort((a, b) => (a.dateIso < b.dateIso ? 1 : a.dateIso > b.dateIso ? -1 : 0));
}

export function addEntry(partial: Omit<DnevnikEntry, "id">): DnevnikEntry {
  const entry: DnevnikEntry = { id: newId(), ...partial };
  const next = [entry, ...safeRead()];
  safeWrite(next);
  return entry;
}

export function removeEntry(id: string): void {
  const next = safeRead().filter((e) => e.id !== id);
  safeWrite(next);
}

export function updateEntry(id: string, patch: Partial<Omit<DnevnikEntry, "id">>): void {
  const next = safeRead().map((e) => (e.id === id ? { ...e, ...patch } : e));
  safeWrite(next);
}

/** Formatiraj zapise u čitljiv tekst (za copy-to-clipboard i razgovor s pedagogom). */
export function formatEntriesForExport(entries: DnevnikEntry[]): string {
  if (entries.length === 0) return "Dnevnik razgovora — nema zapisa.";
  const lines: string[] = ["Dnevnik razgovora s djetetom o srednjoj školi", "=".repeat(50), ""];
  for (const e of entries) {
    const d = new Date(`${e.dateIso}T00:00:00`);
    const dateStr = Number.isNaN(d.getTime())
      ? e.dateIso
      : d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
    lines.push(`• ${dateStr}`);
    if (e.teme.trim()) lines.push(`  Teme: ${e.teme.trim()}`);
    if (e.djeteKaze.trim()) lines.push(`  Dijete kaže: ${e.djeteKaze.trim()}`);
    if (e.sljedeciKorak.trim()) lines.push(`  Sljedeći korak: ${e.sljedeciKorak.trim()}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}

export function clearLocalEntries(): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Vrati zapise iz zadnjih N dana. */
export function filterEntriesWithinDays(entries: DnevnikEntry[], days: number): DnevnikEntry[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => {
    const t = new Date(`${e.dateIso}T00:00:00`).getTime();
    return Number.isFinite(t) && t >= cutoff;
  });
}

/** Vrati lokalne zapise iz zadnjih N dana. */
export function entriesWithinDays(days: number): DnevnikEntry[] {
  return filterEntriesWithinDays(loadEntries(), days);
}
