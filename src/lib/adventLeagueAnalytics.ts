import { trackEvent } from "@/lib/analytics";

/** Bez PII — samo feature flag, faza sezone i agregati kviza. */
const FEATURE = "advent_league";

export type AdventCtaId =
  | "play_today"
  | "participate_hero"
  | "calendar_day"
  | "login"
  | "register"
  | "register_motivation"
  | "leaderboard_full";

export type AdventShareChannel = "native" | "copy_text" | "copy_link";

export function trackAdventLandingView(params: {
  logged_in: boolean;
  season_phase: "before" | "active" | "after";
}): void {
  trackEvent("advent_landing_view", {
    feature: FEATURE,
    logged_in: params.logged_in,
    season_phase: params.season_phase,
  });
}

export function trackAdventCtaClick(cta_id: AdventCtaId): void {
  trackEvent("advent_cta_click", { feature: FEATURE, cta_id });
}

export function trackAdventQuizStarted(day_key: string, day_number: number): void {
  trackEvent("advent_quiz_started", {
    feature: FEATURE,
    day_key,
    day_number,
  });
}

export function trackAdventQuizCompleted(params: {
  day_key: string;
  day_number: number;
  total_score: number;
  questions_correct: number;
  questions_answered: number;
}): void {
  trackEvent("advent_quiz_completed", {
    feature: FEATURE,
    day_key: params.day_key,
    day_number: params.day_number,
    total_score: params.total_score,
    questions_correct: params.questions_correct,
    questions_answered: params.questions_answered,
  });
}

export function trackAdventLeaderboardView(params: {
  scope: "season" | "day";
  variant: "compact" | "full";
}): void {
  trackEvent("advent_leaderboard_view", {
    feature: FEATURE,
    scope: params.scope,
    variant: params.variant,
  });
}

export function trackAdventShareClick(channel: AdventShareChannel): void {
  trackEvent("advent_share_click", { feature: FEATURE, channel });
}

/** Samo činjenica da je došao referral (bez koda u GA). */
export function trackAdventReferralArrival(landing_path: string): void {
  const path = landing_path.split("?")[0] || "/adventska-liga";
  trackEvent("advent_referral_arrival", {
    feature: FEATURE,
    landing_path: path,
  });
}

/** `next` parametar sadrži adventsku rutu — atribucija registracije bez emaila. */
export function isAdventSignupContext(nextParam: string | null): boolean {
  if (!nextParam) return false;
  return nextParam.includes("/adventska-liga");
}

export function adventSignupAnalyticsParams(nextParam: string | null): Record<string, string> {
  return isAdventSignupContext(nextParam) ? { signup_source: "advent_league" } : {};
}