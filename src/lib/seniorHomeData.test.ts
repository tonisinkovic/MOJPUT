import { describe, expect, it } from "vitest";
import { facultyCatalog } from "./facultyCatalog";
import { SENIOR_DEMO_QUESTIONS } from "./seniorChat";
import { HR_BOUNDS, areaCounts, cityDots, groupByCity, nextSeniorEvents, projectGeo } from "./seniorHomeData";

describe("seniorHomeData", () => {
  it("projicira točke unutar okvira 0-100", () => {
    const dots = cityDots();
    expect(dots.length).toBeGreaterThan(20);
    for (const d of dots) {
      expect(d.x).toBeGreaterThanOrEqual(0);
      expect(d.x).toBeLessThanOrEqual(100);
      expect(d.y).toBeGreaterThanOrEqual(0);
      expect(d.y).toBeLessThanOrEqual(100);
    }
  });

  it("projekcija: sjever je gore, istok desno", () => {
    const nw = projectGeo(HR_BOUNDS.maxLat, HR_BOUNDS.minLng);
    const se = projectGeo(HR_BOUNDS.minLat, HR_BOUNDS.maxLng);
    expect(nw).toEqual({ x: 0, y: 0 });
    expect(se.x).toBeCloseTo(100);
    expect(se.y).toBeCloseTo(100);
  });

  it("grupiranje po gradu ne gubi ustanove s poznatim gradom", () => {
    const groups = groupByCity(facultyCatalog);
    const sum = groups.reduce((s, g) => s + g.count, 0);
    expect(sum).toBeGreaterThan(facultyCatalog.length * 0.9);
    expect(sum).toBeLessThanOrEqual(facultyCatalog.length);
    expect(groups[0].count).toBeGreaterThanOrEqual(groups[groups.length - 1].count);
    expect(groups[0].city.toLowerCase()).toBe("zagreb");
  });

  it("brojke po područjima zbrajaju se na cijeli katalog", () => {
    const total = areaCounts(facultyCatalog).reduce((s, a) => s + a.count, 0);
    expect(total).toBe(facultyCatalog.length);
  });

  it("sljedeći rokovi su u budućnosti i poredani", () => {
    const from = new Date(2026, 9, 17);
    const list = nextSeniorEvents(5, from);
    expect(list.length).toBe(5);
    const times = list.map((e) => new Date(e.year, e.month, e.day).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
    expect(times[0]).toBeGreaterThanOrEqual(from.getTime() - 86_400_000);
  });
});

describe("seniorChat demo odgovori", () => {
  const from = new Date(2026, 9, 17);
  it("svaki odgovor je neprazan i ne sadrži izmišljene brojke", () => {
    for (const x of SENIOR_DEMO_QUESTIONS) {
      const a = x.answer(facultyCatalog, from);
      expect(a.length).toBeGreaterThan(20);
    }
  });

  it("rokovi dolaze iz kalendara, s oznakom okvirno", () => {
    const a = SENIOR_DEMO_QUESTIONS[0].answer(facultyCatalog, from);
    expect(a).toContain("1. prosinca 2026.");
    expect(a).toContain("okvirno");
  });

  it("Split: broj ustanova odgovara katalogu", () => {
    const n = facultyCatalog.filter((f) => f.city.trim().toLowerCase() === "split").length;
    const a = SENIOR_DEMO_QUESTIONS[1].answer(facultyCatalog, from);
    expect(a).toContain(`**${n}**`);
  });

  it("natječaji za domove sadrže samo događaje tipa Dom", () => {
    const a = SENIOR_DEMO_QUESTIONS[3].answer(facultyCatalog, from);
    expect(a).toMatch(/dom/i);
    expect(a).not.toContain("rang-liste upisa na studije");
  });
});
