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

/** Isti ID kao u index.html — javni GA4 ključ, nije tajna. */
const DEFAULT_MEASUREMENT_ID = "G-9N7061Q2JN";
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_MEASUREMENT_ID;
const CONSENT_KEY = "analytics_consent";

export type AnalyticsConsent = "granted" | "denied";

let gaInitialized = false;

function isLocalHost(): boolean {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function readConsent(): AnalyticsConsent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  return readConsent();
}

function hasConsent(): boolean {
  return readConsent() === "granted";
}

const DENIED_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

const GRANTED_CONSENT = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

function pushConsentUpdate(granted: boolean): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", granted ? GRANTED_CONSENT : DENIED_CONSENT);
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
  if (gaInitialized || !measurementId || isLocalHost()) return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
  }

  gaInitialized = true;
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (!measurementId || !hasConsent() || isLocalHost()) return;
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
  if (!isLocalHost()) {
    if (!gaInitialized) initAnalytics();
    pushConsentUpdate(granted);
  }
  if (granted) {
    trackPageView(`${window.location.pathname}${window.location.search}${window.location.hash}`);
  }
}

