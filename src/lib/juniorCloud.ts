/**
 * Sinkronizacija junior kviza i liste škola s računom.
 * Isti rezultat na mobitelu i kod kuće.
 */

import { AUTH_CHANGED } from "@/lib/auth";
import { apiGet, apiPost } from "@/lib/api";
import {
  JUNIOR_CLOUD_PUSH_EVENT,
  applyJuniorRemoteState,
  collectJuniorLocalState,
  juniorLocalHasData,
  type JuniorCloudState,
} from "@/lib/juniorPath";

export function newestJuniorTimestamp(state: JuniorCloudState): number {
  const candidates = [
    state.updatedAt,
    state.snapshot?.savedAt,
    ...state.shortlist.map((item) => item.savedAt),
  ].filter((value): value is string => Boolean(value));
  return candidates.reduce((max, value) => {
    const n = Date.parse(value);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
}

export function pickJuniorCloudAction(
  local: JuniorCloudState,
  remote: JuniorCloudState | null,
): "push" | "apply" | "noop" {
  const localHas = juniorLocalHasData(local);
  if (!remote) return localHas ? "push" : "noop";
  const remoteHas = juniorLocalHasData(remote);
  if (!localHas && remoteHas) return "apply";
  if (localHas && !remoteHas) return "push";
  const localTs = newestJuniorTimestamp(local);
  const remoteTs = newestJuniorTimestamp(remote);
  if (remoteTs > localTs) return "apply";
  if (localTs > remoteTs) return "push";
  return "noop";
}

async function fetchRemoteState(): Promise<JuniorCloudState | null | "skip"> {
  const res = await apiGet<JuniorCloudState>("/api/junior/me");
  if (!res.success) return "skip";
  const payload = res.data ?? (res as { payload?: JuniorCloudState }).payload;
  if (!payload || typeof payload !== "object") return null;
  return payload;
}

async function pushLocalState(local: JuniorCloudState): Promise<void> {
  if (!juniorLocalHasData(local)) return;
  await apiPost("/api/junior/me", { payload: local });
}

export async function syncJuniorCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const local = collectJuniorLocalState();
  const remote = await fetchRemoteState();
  if (remote === "skip") return;
  const action = pickJuniorCloudAction(local, remote);
  if (action === "apply" && remote) applyJuniorRemoteState(remote);
  if (action === "push") await pushLocalState(local);
}

let started = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void syncJuniorCloud();
  }, 450);
}

export function startJuniorCloudSync(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  window.addEventListener(JUNIOR_CLOUD_PUSH_EVENT, schedulePush);
  window.addEventListener(AUTH_CHANGED, () => {
    void syncJuniorCloud();
  });
  void syncJuniorCloud();
}
