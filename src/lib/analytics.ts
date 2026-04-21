type QuizEventName =
  | "quiz_started"
  | "quiz_step_viewed"
  | "quiz_question_answered"
  | "quiz_completed"
  | "quiz_passed"
  | "quiz_failed"
  | "quiz_abandoned";

type AuthEventName =
  | "sign_up_started"
  | "sign_up_completed"
  | "signup_step_viewed"
  | "signup_abandoned"
  | "login_started"
  | "login_completed"
  | "login_failed";

type AnalyticsEventName = QuizEventName | AuthEventName | "page_view";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const requireConsent = import.meta.env.VITE_ANALYTICS_REQUIRE_CONSENT === "true";
const CONSENT_KEY = "analytics_consent";

let gaInitialized = false;

function hasConsent(): boolean {
  if (!requireConsent) return true;
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

function normalizeParams(params: AnalyticsParams = {}): Record<string, string | number | boolean> {
  const normalized: Record<string, string | number | boolean> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    normalized[key] = value;
  });
  return normalized;
}

export function initAnalytics(): void {
  if (gaInitialized || !measurementId || !hasConsent()) return;

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  gaInitialized = true;
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (!measurementId || !hasConsent()) return;
  if (!gaInitialized) initAnalytics();
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, normalizeParams(params));
}

export function trackPageView(path: string): void {
  trackEvent("page_view", {
    page_path: path,
    page_location: window.location.href,
  });
}

export function setAnalyticsConsent(granted: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    /* ignore storage issues */
  }
  if (granted) initAnalytics();
}

