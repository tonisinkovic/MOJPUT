import { describe, it, expect, vi } from "vitest";
import {
  buildAdventShareText,
  buildAdventShareTitle,
  buildAdventShareLinkOnly,
  canUseWebShare,
  shareAdventResult,
} from "./adventLeagueShare";

describe("adventLeagueShare", () => {
  const sample = {
    dayKey: "2026-12-05",
    dayNumber: 5,
    totalScore: 820,
    questionsCorrect: 8,
    questionsAnswered: 10,
  };

  it("buildAdventShareText includes score and correct count, no PII", () => {
    const text = buildAdventShareText(sample);
    expect(text).toContain("8/10");
    expect(text).toContain("820");
    expect(text).toContain("dan 5");
    expect(text).toMatch(/adventska-liga|mojput/i);
    expect(text).not.toMatch(/@/);
    expect(text).not.toMatch(/email/i);
  });

  it("buildAdventShareTitle uses day number", () => {
    expect(buildAdventShareTitle(sample)).toBe("MojPut Adventska liga — Dan 5");
  });

  it("buildAdventShareLinkOnly returns league path", () => {
    const link = buildAdventShareLinkOnly();
    expect(link).toContain("adventska-liga");
    expect(link).not.toContain("?");
    expect(link).not.toContain("user");
  });

  it("canUseWebShare is boolean", () => {
    expect(typeof canUseWebShare()).toBe("boolean");
  });

  it("shareAdventResult falls back to copy when share unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const outcome = await shareAdventResult(sample);
    expect(outcome).toBe("copied");
    expect(writeText).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});