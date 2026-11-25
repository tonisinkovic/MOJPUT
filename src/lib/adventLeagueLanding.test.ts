import { describe, expect, it } from "vitest";
import {
  buildAdventCalendarDays,
  getSeasonPhase,
  getZagrebDayKey,
  splitCountdown,
} from "@/lib/adventLeagueLanding";

describe("adventLeagueLanding", () => {
  it("buildAdventCalendarDays — 31 dan u mjesecu, kviz s 10.", () => {
    const days = buildAdventCalendarDays({}, "2026-12-10");
    expect(days).toHaveLength(31);
    expect(days[0].dayNumber).toBe(1);
    expect(days[0].status).toBe("pre_season");
    expect(days[9].dayNumber).toBe(10);
    expect(days[9].status).toBe("available");
    expect(days[8].status).toBe("missed");
    expect(days[23].dayNumber).toBe(24);
    expect(days[24].dayNumber).toBe(25);
    expect(days[24].status).toBe("christmas");
    expect(days[25].dayNumber).toBe(26);
    expect(days[25].status).toBe("locked");
    expect(days[30].status).toBe("after_season");
    const lista = buildAdventCalendarDays({}, "2026-12-26");
    expect(lista[25].status).toBe("final_list");
    expect(days[30].dayNumber).toBe(31);
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
    expect(getSeasonPhase("2026-12-01")).toBe("active");
    expect(getSeasonPhase("2026-12-15")).toBe("active");
    expect(getSeasonPhase("2026-12-31")).toBe("active");
    expect(getSeasonPhase("2027-01-01")).toBe("after");
  });
});