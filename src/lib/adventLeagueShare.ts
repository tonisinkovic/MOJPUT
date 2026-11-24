import type { AdventCompletePayload } from "@/lib/adventLeagueApi";

export type AdventShareInput = Pick<
  AdventCompletePayload,
  "dayNumber" | "dayKey" | "totalScore" | "questionsCorrect" | "questionsAnswered"
>;

const PUBLIC_LEAGUE_PATH = "/adventska-liga";
const QUIZ_PATH = "/adventska-liga/kviz";

/** Javna poveznica — opcionalni ref kod (bez emaila ili korisničkog ID-a u URL-u). */
export function getAdventLeagueShareUrl(target: "league" | "quiz" = "league", referralCode?: string | null): string {
  const path = target === "quiz" ? QUIZ_PATH : PUBLIC_LEAGUE_PATH;
  if (typeof window === "undefined") {
    const base = `https://mojput.com${path}`;
    if (!referralCode) return base;
    return `${base}?ref=${encodeURIComponent(referralCode)}&utm_source=advent_share&utm_medium=referral`;
  }
  const base = String(import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const raw = `${window.location.origin}${base}${path}`;
  if (!referralCode) return raw;
  const u = new URL(raw);
  u.searchParams.set("ref", referralCode);
  u.searchParams.set("utm_source", "advent_share");
  u.searchParams.set("utm_medium", "referral");
  return u.toString();
}

export function buildAdventShareTitle(input: AdventShareInput): string {
  const day = input.dayNumber != null ? `Dan ${input.dayNumber}` : "Dnevni kviz";
  return `MojPut Adventska liga — ${day}`;
}

/** Tekst za dijeljenje — samo rezultat kviza, bez imena ili emaila. */
export function buildAdventShareText(input: AdventShareInput, referralCode?: string | null): string {
  const day =
    input.dayNumber != null ? `dan ${input.dayNumber}` : input.dayKey ? `kviz ${input.dayKey}` : "dnevni kviz";
  const correct = input.questionsCorrect;
  const answered = input.questionsAnswered;
  const score = input.totalScore;
  const url = getAdventLeagueShareUrl("league", referralCode);

  return [
    `Upravo sam odigrao/la Adventski kviz na MojPutu (${day})!`,
    `Točno: ${correct}/${answered} · Bodovi: ${score}`,
    `Ti možeš još danas — 10 pitanja, jedan pokušaj dnevno.`,
    `Pridruži se ligi: ${url}`,
  ].join("\n");
}

export function buildAdventShareLinkOnly(referralCode?: string | null): string {
  return getAdventLeagueShareUrl("league", referralCode);
}

export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function shareAdventResult(
  input: AdventShareInput,
  referralCode?: string | null,
): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  const title = buildAdventShareTitle(input);
  const text = buildAdventShareText(input, referralCode);
  const url = getAdventLeagueShareUrl("league", referralCode);

  if (canUseWebShare()) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return "cancelled";
    }
  }

  try {
    await copyTextToClipboard(`${text}`);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  if (typeof document === "undefined") throw new Error("clipboard_unavailable");
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(el);
  if (!ok) throw new Error("copy_failed");
}