type QuizEventName =
  | "quiz_started"
  | "quiz_step_viewed"
  | "quiz_question_answered"
  | "quiz_completed"
  | "quiz_passed"
  | "quiz_failed"
  | "quiz_abandoned"
  | "quiz_result_viewed"
  | "recommendation_clicked"
  | "program_opened"
  | "school_opened"
  | "result_shared"
  | "quiz_restarted";

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
    __mojputGaConfigured?: boolean;
  }
}

/** Isti ID kao u index.html — javni GA4 ključ, nije tajna. */
const DEFAULT_MEASUREMENT_ID = "G-9N7061Q2JN";
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_MEASUREMENT_ID;

/** Isti ključ čita inline skripta u index.html. */
export const ANALYTICS_CONSENT_KEY = "mojput_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "mojput:analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

let gaInitialized = false;

export function getAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function hasConsent(): boolean {
  return getAnalyticsConsent() === "granted";
}

export function setAnalyticsConsent(consent: AnalyticsConsent): void {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    /* privatni način rada — odluka vrijedi samo za ovu sesiju */
  }
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: consent });
  }
  if (consent === "granted") initAnalytics();
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }));
}

function isLocalHost(): boolean {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
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
  if (gaInitialized || !measurementId || isLocalHost() || !hasConsent()) return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js prepoznaje samo `arguments` objekt, ne običan niz
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);
    window.gtag("js", new Date());
  }

  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (!window.__mojputGaConfigured) {
    window.gtag("config", measurementId, {
      send_page_view: true,
      page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      page_location: window.location.href,
    });
    window.__mojputGaConfigured = true;
  }

  gaInitialized = true;
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (!measurementId || isLocalHost() || !hasConsent()) return;
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
