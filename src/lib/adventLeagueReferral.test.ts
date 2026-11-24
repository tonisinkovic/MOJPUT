import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  appendAdventReferralToUrl,
  captureAdventReferralFromSearch,
  getStoredAdventReferralCode,
  clearStoredAdventReferralCode,
} from "./adventLeagueReferral";

describe("adventLeagueReferral", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("window", globalThis);
  });

  it("captures ref query param", () => {
    const code = captureAdventReferralFromSearch("?ref=abc12345&utm=x");
    expect(code).toBe("abc12345");
    expect(getStoredAdventReferralCode()).toBe("abc12345");
  });

  it("rejects invalid ref", () => {
    expect(captureAdventReferralFromSearch("?ref=!!!")).toBeNull();
  });

  it("appendAdventReferralToUrl adds ref and utm", () => {
    const url = appendAdventReferralToUrl("https://mojput.com/adventska-liga", "abc12345");
    expect(url).toContain("ref=abc12345");
    expect(url).toContain("utm_source=advent_share");
    expect(url).not.toContain("email");
  });

  it("clear removes stored code", () => {
    captureAdventReferralFromSearch("?ref=abc12345");
    clearStoredAdventReferralCode();
    expect(getStoredAdventReferralCode()).toBeNull();
  });
});