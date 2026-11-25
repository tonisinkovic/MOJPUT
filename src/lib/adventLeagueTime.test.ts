import { describe, expect, it } from "vitest";
import {
  getCountdownTarget,
  getFirstQuizOpenMs,
  getQuizDayUnlockMs,
  getZagrebLocalInstantMs,
} from "@/lib/adventLeagueTime";

describe("adventLeagueTime", () => {
  it("prvi kviz otvara 5. 12. u 10:00 Zagreb", () => {
    const ms = getFirstQuizOpenMs();
    const d = new Date(ms);
    expect(getQuizDayUnlockMs("2026-12-05")).toBe(ms);
    expect(d.toISOString()).toMatch(/2026-12-05T09:00:00\.000Z/);
  });

  it("drugi dan kviza otvara u ponoć 6. 12.", () => {
    const ms = getQuizDayUnlockMs("2026-12-06");
    expect(new Date(ms).toISOString()).toMatch(/2026-12-05T23:00:00\.000Z/);
  });

  it("prije 5. 12. countdown ide na 10:00", () => {
    const target = getCountdownTarget(new Date(getZagrebLocalInstantMs("2026-11-25", 12, 0, 0)));
    expect(target.label).toContain("5. 12. u 10:00");
    expect(target.targetIso).toBe(new Date(getFirstQuizOpenMs()).toISOString());
  });

  it("tijekom kviza countdown ide na ponoć", () => {
    const now = new Date(getZagrebLocalInstantMs("2026-12-10", 15, 0, 0));
    const target = getCountdownTarget(now);
    expect(target.label).toContain("ponoć");
    expect(target.targetIso).toBeTruthy();
  });
});