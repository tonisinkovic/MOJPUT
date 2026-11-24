import { afterEach, describe, expect, it, vi } from "vitest";
import { setAnalyticsConsent } from "@/lib/analytics";
import {
  adventSignupAnalyticsParams,
  isAdventSignupContext,
  trackAdventCtaClick,
  trackAdventLandingView,
  trackAdventQuizCompleted,
} from "@/lib/adventLeagueAnalytics";

afterEach(() => {
  localStorage.clear();
  delete window.gtag;
});

describe("adventLeagueAnalytics", () => {
  it("isAdventSignupContext prepoznaje next rutu", () => {
    expect(isAdventSignupContext("/adventska-liga/kviz")).toBe(true);
    expect(isAdventSignupContext("/forum")).toBe(false);
    expect(adventSignupAnalyticsParams(null)).toEqual({});
    expect(adventSignupAnalyticsParams("/adventska-liga")).toEqual({ signup_source: "advent_league" });
  });

  it("šalje GA event kad je consent aktivan", () => {
    vi.stubGlobal("location", {
      hostname: "mojput.com",
      pathname: "/adventska-liga",
      href: "https://mojput.com/adventska-liga",
      search: "",
      hash: "",
    });
    const gtag = vi.fn();
    window.gtag = gtag;
    setAnalyticsConsent("granted");

    trackAdventLandingView({ logged_in: false, season_phase: "active" });
    trackAdventCtaClick("play_today");
    trackAdventQuizCompleted({
      day_key: "2026-12-01",
      day_number: 1,
      total_score: 800,
      questions_correct: 8,
      questions_answered: 10,
    });

    expect(gtag).toHaveBeenCalled();
    const events = gtag.mock.calls.filter((c) => c[0] === "event");
    expect(events.some((c) => c[1] === "advent_landing_view")).toBe(true);
    expect(events.some((c) => c[1] === "advent_cta_click")).toBe(true);
    expect(events.some((c) => c[1] === "advent_quiz_completed")).toBe(true);
  });

  it("ne šalje kad je analitika isključena", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    setAnalyticsConsent("denied");
    gtag.mockClear();
    trackAdventCtaClick("register");
    expect(gtag).not.toHaveBeenCalled();
  });
});