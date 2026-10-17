import { describe, expect, it } from "vitest";
import raw from "./calendarEvents.json";
import {
  academicYearStart,
  eventDate,
  isArchivedEvent,
  juniorEvents,
  nextUpcomingEvent,
  schoolCalendarEvents,
  seniorEvents,
  upcomingEvents,
} from "./calendarEvents";

const KNOWN_TYPES = new Set(["Ispit", "Rok", "Priprema", "Rezultati", "Upisi", "Škola", "Praznik", "Dom"]);

describe("calendarEvents.json", () => {
  const all = [...raw.senior, ...raw.junior, ...raw.school];

  it("svi datumi su ispravni i postoje u kalendaru", () => {
    for (const e of all) {
      expect(e.date, e.title).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const [y, m, d] = e.date.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      expect(dt.getMonth(), `${e.date} ${e.title}`).toBe(m - 1);
      expect(dt.getDate(), `${e.date} ${e.title}`).toBe(d);
    }
  });

  it("svaki izvor postoji i svaki tip ima boju u kalendaru", () => {
    for (const e of all as { source?: string; type: string; title: string }[]) {
      if (e.source) expect(raw.sources, e.title).toHaveProperty(e.source);
      expect(KNOWN_TYPES.has(e.type), `${e.title}: ${e.type}`).toBe(true);
    }
  });

  it("budući seniorski datumi koji nisu službeni označeni su kao okvirni i imaju izvor", () => {
    const future = seniorEvents.filter((e) => e.year >= 2027);
    expect(future.length).toBeGreaterThan(10);
    for (const e of future) {
      expect(e.estimated, e.title).toBe(true);
      expect(e.source, e.title).toBeDefined();
    }
  });

  it("2027. ima prijave studija, rang-liste, upise i natječaje za domove", () => {
    const titles2027 = seniorEvents.filter((e) => e.year === 2027).map((e) => `${e.type}: ${e.title}`);
    expect(titles2027.some((t) => /prijava studija/i.test(t))).toBe(true);
    expect(titles2027.some((t) => /rang-liste/i.test(t))).toBe(true);
    expect(titles2027.some((t) => /^Upisi: Upisi na fakultetima/.test(t))).toBe(true);
    expect(titles2027.filter((t) => t.startsWith("Dom:")).length).toBeGreaterThanOrEqual(3);
  });
});

describe("arhiva i sljedeći rokovi", () => {
  const oct2026 = new Date(2026, 9, 17);

  it("akademska godina počinje 1. rujna", () => {
    expect(academicYearStart(oct2026)).toEqual(new Date(2026, 8, 1));
    expect(academicYearStart(new Date(2027, 2, 1))).toEqual(new Date(2026, 8, 1));
  });

  it("događaji iz 2025./2026. idu u arhivu, novi ne", () => {
    const archived = seniorEvents.filter((e) => isArchivedEvent(e, oct2026));
    expect(archived.length).toBeGreaterThan(0);
    expect(archived.every((e) => eventDate(e) < new Date(2026, 8, 1))).toBe(true);
    expect(seniorEvents.some((e) => !isArchivedEvent(e, oct2026))).toBe(true);
  });

  it("sljedeći seniorski rok nakon 17. 10. 2026. je prijava ispita mature 2027.", () => {
    expect(nextUpcomingEvent(seniorEvents, oct2026)?.title).toMatch(/prijava ispita mature 2027/);
  });

  it("upcomingEvents vraća sortirano i ograničeno", () => {
    const list = upcomingEvents(seniorEvents, oct2026, 3);
    expect(list).toHaveLength(3);
    expect(eventDate(list[0]) <= eventDate(list[1])).toBe(true);
  });

  it("junior: iduća godina je okvirna kopija, školski kalendar je zaseban", () => {
    expect(juniorEvents.filter((e) => e.year === 2027).every((e) => e.estimated)).toBe(true);
    expect(juniorEvents.some((e) => e.type === "Praznik")).toBe(false);
    expect(schoolCalendarEvents.some((e) => e.type === "Praznik")).toBe(true);
  });
});
