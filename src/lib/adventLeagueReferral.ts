import { apiGet, apiPost } from "@/lib/api";
import { trackAdventReferralArrival } from "@/lib/adventLeagueAnalytics";

const STORAGE_KEY = "mojput_advent_ref";
const TRACKED_SESSION_KEY = "mojput_advent_ref_tracked";
const REF_TTL_MS = 30 * 86_400_000;
const CODE_RE = /^[a-z0-9]{6,16}$/;

type StoredRef = { code: string; at: number };

export function captureAdventReferralFromSearch(search: string) {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const ref = params.get("ref")?.trim().toLowerCase() ?? "";
  if (!CODE_RE.test(ref)) return null;
  const payload: StoredRef = { code: ref, at: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
  return ref;
}

export function getStoredAdventReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredRef;
    if (!parsed?.code || !CODE_RE.test(parsed.code)) return null;
    if (Date.now() - Number(parsed.at) > REF_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

export function clearStoredAdventReferralCode() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function appendAdventReferralToUrl(baseUrl: string, refCode?: string | null) {
  try {
    const u = new URL(baseUrl);
    if (refCode && CODE_RE.test(refCode)) u.searchParams.set("ref", refCode);
    u.searchParams.set("utm_source", "advent_share");
    u.searchParams.set("utm_medium", "referral");
    return u.toString();
  } catch {
    return baseUrl;
  }
}

export async function trackAdventReferralVisit(code: string, landingPath: string) {
  return apiPost<{ recorded: boolean; reason: string | null }>("/api/advent/referral/track-visit", {
    code,
    landingPath,
  });
}

export async function claimAdventReferralAfterAuth() {
  const code = getStoredAdventReferralCode();
  if (!code) return;
  const res = await apiPost<{ attributed?: boolean; code?: string }>("/api/advent/referral/claim", { code });
  if (res.success && res.data?.code === "attributed") {
    clearStoredAdventReferralCode();
  }
}

export async function fetchAdventReferralMe() {
  return apiGet<{ code: string; shareUrl: string; path: string }>("/api/advent/referral/me");
}

/** Jednom po sesiji: pohrani ref iz URL-a i pošalji anonimni visit event. */
export async function runAdventReferralCapture(search: string, pathname: string) {
  const freshFromUrl = captureAdventReferralFromSearch(search);
  const code = freshFromUrl ?? getStoredAdventReferralCode();
  if (!code) return;
  if (typeof sessionStorage !== "undefined") {
    const key = `${TRACKED_SESSION_KEY}:${code}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    if (freshFromUrl) {
      trackAdventReferralArrival(pathname);
    }
  }
  await trackAdventReferralVisit(code, pathname);
}