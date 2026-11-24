import { describe, expect, it } from "vitest";
import {
  buildAdventCalendarDays,
  getSeasonPhase,
  getZagrebDayKey,
  splitCountdown,
} from "@/lib/adventLeagueLanding";

describe("adventLeagueLanding", () => {
  it("buildAdventCalendarDays oznacava danas i prosle dane", () => {
    const days = buildAdventCalendarDays({}, "2026-12-10");
    expect(days).toHaveLength(24);
    expect(days[9].status).toBe("available");
    expect(days[8].status).toBe("missed");
    expect(days[10].status).toBe("locked");
  });

  it("played daje status played", () => {
    const days = buildAdventCalendarDays({ "2026-12-05": 120 }, "2026-12-10");
    expect(days[4].status).toBe("played");
    expect(days[4].score).toBe(120);
  });

  it("splitCountdown", () => {
    expect(splitCountdown(90_061_000)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  it("getZagrebDayKey format", () => {
    expect(getZagrebDayKey(new Date("2026-06-15T12:00:00Z"))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("getSeasonPhase", () => {
    expect(getSeasonPhase("2026-11-30")).toBe("before");
    expect(getSeasonPhase("2026-12-15")).toBe("active");
    expect(getSeasonPhase("2026-12-25")).toBe("after");
  });
});