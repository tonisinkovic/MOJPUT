import { describe, expect, it } from "vitest";
import { matchesQuizSearch, QUIZ_CARDS, QUIZ_GROUPS } from "./samoprocjenaQuizMeta";
import { REFLECTION_QUIZZES, reflectionScore } from "@/data/reflection";

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

  it("ima 120 novih samoprocjena u postojećim skupinama", () => {
    expect(REFLECTION_QUIZZES).toHaveLength(120);
    const ids = new Set(REFLECTION_QUIZZES.map((q) => q.id));
    const titles = new Set(REFLECTION_QUIZZES.map((q) => q.title));
    expect(ids.size).toBe(120);
    expect(titles.size).toBe(120);
    const groups = new Set(QUIZ_GROUPS.map((g) => g.id));
    const banned = /know\s*yourself|knowyourself/i;
    for (const quiz of REFLECTION_QUIZZES) {
      expect(groups.has(quiz.group), quiz.title).toBe(true);
      expect(quiz.questions.length).toBeGreaterThanOrEqual(8);
      expect(`${quiz.title} ${quiz.description}`).not.toMatch(banned);
      expect(QUIZ_CARDS.some((c) => c.id === quiz.id)).toBe(true);
    }
    const sample = REFLECTION_QUIZZES[0];
    const high = reflectionScore(Array(sample.questions.length).fill(4), sample.questions);
    const low = reflectionScore(Array(sample.questions.length).fill(0), sample.questions);
    expect(high.percent).toBeGreaterThan(low.percent);
    expect(high.band === "high" || high.band === "mid").toBe(true);
  });
});
