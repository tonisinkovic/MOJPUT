import { describe, expect, it } from "vitest";
import season from "./season.json";
import questionsFile from "./questions.json";
import type { AdventQuestionsFile } from "@/lib/adventLeagueTypes";

const data = questionsFile as AdventQuestionsFile;

describe("advent-league JSON", () => {
  it("season.json ima potrebna polja", () => {
    expect(season.year).toBeGreaterThan(2020);
    expect(season.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(season.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(season.timezone).toBe("Europe/Zagreb");
  });

  it("questions.json ima 24 pitanja s kljucevima", () => {
    expect(data.questions).toHaveLength(24);
    for (const q of data.questions) {
      expect(q.dayKey).toMatch(/^2026-12-\d{2}$/);
      expect(q.questionText.length).toBeGreaterThan(5);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctAnswer).toBeTruthy();
      expect(q.options.some((o) => o.id === q.correctAnswer)).toBe(true);
    }
  });
});