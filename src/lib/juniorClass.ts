/**
 * Kod za 8. razred: tko je riješio kviz, koji smjerovi iskaču.
 * Imena nisu na ploči dok pedagog to ne uključi.
 */

import { apiGet, apiPost } from "@/lib/api";

export const CLASS_CODE_LEN = 6;
export const CLASS_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CLIENT_KEY = "junior-class-client-v1";
const LAST_CODE_KEY = "junior-class-last-code-v1";
const TEACHER_CODES_KEY = "junior-class-teacher-v1";

export type JuniorClassTrack = {
  programId: number;
  name: string;
  count: number;
};

export type JuniorClassEntry = {
  alias: string | null;
  programId: number;
  programName: string;
  pathway: string | null;
  city: string | null;
};

export type JuniorClassBoard = {
  code: string;
  label: string | null;
  doneCount: number;
  tracks: JuniorClassTrack[];
  entries: JuniorClassEntry[];
};

export function makeClassCode(random = Math.random): string {
  let out = "";
  for (let i = 0; i < CLASS_CODE_LEN; i += 1) {
    out += CLASS_ALPHABET[Math.floor(random() * CLASS_ALPHABET.length)];
  }
  return out;
}

export function normalizeClassCode(raw: string): string | null {
  const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== CLASS_CODE_LEN) return null;
  if (![...code].every((ch) => CLASS_ALPHABET.includes(ch))) return null;
  return code;
}

export function aggregateBoard(
  code: string,
  label: string | null,
  entries: JuniorClassEntry[],
): JuniorClassBoard {
  const counts = new Map<number, JuniorClassTrack>();
  for (const entry of entries) {
    const prev = counts.get(entry.programId);
    if (prev) prev.count += 1;
    else counts.set(entry.programId, { programId: entry.programId, name: entry.programName, count: 1 });
  }
  const tracks = [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "hr"));
  return { code, label, doneCount: entries.length, tracks, entries };
}

export function getOrCreateClientKey(): string {
  try {
    const existing = window.localStorage.getItem(CLIENT_KEY);
    if (existing && existing.length >= 8) return existing;
    const next = `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(CLIENT_KEY, next);
    return next;
  } catch {
    return `c${Date.now().toString(36)}anon`;
  }
}

export function loadLastClassCode(): string | null {
  try {
    return normalizeClassCode(window.localStorage.getItem(LAST_CODE_KEY) ?? "") ?? null;
  } catch {
    return null;
  }
}

export function saveLastClassCode(code: string): void {
  try {
    window.localStorage.setItem(LAST_CODE_KEY, code);
  } catch {
    /* ignore */
  }
}

export function rememberTeacherCode(code: string, label: string | null): void {
  try {
    const raw = window.localStorage.getItem(TEACHER_CODES_KEY);
    const list = raw ? (JSON.parse(raw) as Array<{ code: string; label: string | null }>) : [];
    const next = [{ code, label }, ...list.filter((x) => x.code !== code)].slice(0, 8);
    window.localStorage.setItem(TEACHER_CODES_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function loadTeacherCodes(): Array<{ code: string; label: string | null }> {
  try {
    const raw = window.localStorage.getItem(TEACHER_CODES_KEY);
    const list = raw ? (JSON.parse(raw) as Array<{ code: string; label: string | null }>) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function createJuniorClass(label?: string): Promise<
  { ok: true; board: JuniorClassBoard } | { ok: false; message: string }
> {
  const res = await apiPost<{ code: string; label: string | null }>("/api/junior/classes", {
    label: label?.trim() || null,
  });
  if (!res.success || !res.data?.code) {
    return { ok: false, message: res.success === false ? res.message : "Kod nije stvoren." };
  }
  const code = res.data.code;
  rememberTeacherCode(code, res.data.label ?? (label?.trim() || null));
  return {
    ok: true,
    board: { code, label: res.data.label ?? null, doneCount: 0, tracks: [], entries: [] },
  };
}

export async function fetchJuniorClass(code: string): Promise<
  { ok: true; board: JuniorClassBoard } | { ok: false; message: string }
> {
  const normalized = normalizeClassCode(code);
  if (!normalized) return { ok: false, message: "Kod mora imati 6 znakova." };
  const res = await apiGet<JuniorClassBoard>(`/api/junior/classes/${normalized}`);
  if (!res.success || !res.data) {
    return { ok: false, message: res.success === false ? res.message : "Razred nije pronađen." };
  }
  return { ok: true, board: res.data };
}

export async function joinJuniorClass(input: {
  code: string;
  programId: number;
  programName: string;
  pathway?: string | null;
  city?: string | null;
  alias?: string | null;
}): Promise<{ ok: true; already: boolean } | { ok: false; message: string }> {
  const normalized = normalizeClassCode(input.code);
  if (!normalized) return { ok: false, message: "Kod mora imati 6 znakova." };
  const alias = input.alias?.trim() ? input.alias.trim().slice(0, 24) : null;
  const res = await apiPost<{ already?: boolean }>(`/api/junior/classes/${normalized}/join`, {
    clientKey: getOrCreateClientKey(),
    programId: input.programId,
    programName: input.programName,
    pathway: input.pathway ?? null,
    city: input.city ?? null,
    alias,
  });
  if (!res.success) {
    return { ok: false, message: res.message };
  }
  saveLastClassCode(normalized);
  return { ok: true, already: Boolean(res.data?.already) };
}
