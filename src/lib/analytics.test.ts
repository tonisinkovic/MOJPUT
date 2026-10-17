import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  getAnalyticsConsent,
  isAnalyticsCollectionEnabled,
  setAnalyticsConsent,
  trackEvent,
} from "./analytics";

afterEach(() => {
  localStorage.clear();
  delete window.gtag;
});

describe("analytics consent", () => {
  it("bez odluke vraća null", () => {
    expect(getAnalyticsConsent()).toBeNull();
  });

  it("ignorira nepoznate vrijednosti u storageu", () => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "maybe");
    expect(getAnalyticsConsent()).toBeNull();
  });

  it("sprema odluku, javlja gtagu i šalje event", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    const listener = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);

    setAnalyticsConsent("denied");

    expect(getAnalyticsConsent()).toBe("denied");
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "denied" });
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, listener);
  });

  it("broji posjet dok osoba ne isključi analitiku", () => {
    expect(isAnalyticsCollectionEnabled()).toBe(true);
    setAnalyticsConsent("granted");
    expect(isAnalyticsCollectionEnabled()).toBe(true);
    setAnalyticsConsent("denied");
    expect(isAnalyticsCollectionEnabled()).toBe(false);
  });

  it("ne šalje evente kad je analitika isključena", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    setAnalyticsConsent("denied");
    gtag.mockClear();
    trackEvent("quiz_started");
    expect(gtag).not.toHaveBeenCalled();
  });
});
