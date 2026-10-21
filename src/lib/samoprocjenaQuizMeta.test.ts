import { describe, expect, it } from "vitest";
import { matchesQuizSearch, QUIZ_CARDS, QUIZ_GROUPS } from "./samoprocjenaQuizMeta";

const find = (q: string) => QUIZ_CARDS.filter((c) => matchesQuizSearch(c, q)).map((c) => c.id);

describe("samoprocjena: skupine i pretraga", () => {
  it("svaki kviz je u postojećoj skupini", () => {
    const ids = new Set(QUIZ_GROUPS.map((g) => g.id));
    for (const c of QUIZ_CARDS) expect(ids.has(c.group)).toBe(true);
  });

  it("prazna pretraga vraća sve", () => {
    expect(find("  ")).toHaveLength(QUIZ_CARDS.length);
  });

  it("zanemaruje dijakritike i velika slova", () => {
    expect(find("STRUCNJAK")).toContain("therapy_need");
    expect(find("suosjecanje")).toEqual(["empathy"]);
  });

  it("traži i po nazivu skupine", () => {
    expect(find("raspolozenje stres")).toEqual(expect.arrayContaining(["serenity"]));
  });

  it("sve riječi moraju odgovarati", () => {
    expect(find("empatija iq")).toEqual([]);
  });
});
