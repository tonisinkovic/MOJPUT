import { describe, expect, it } from "vitest";
import daysFile from "./advent-days.json";

describe("advent-days.json", () => {
  it("svaki dan ima točno 10 pitanja s indeksima 0–9", () => {
    for (const day of daysFile.days) {
      expect(day.questions).toHaveLength(10);
      const indices = day.questions.map((q) => q.index).sort((a, b) => a - b);
      expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const q of day.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(4);
        expect(q.correctAnswer).toMatch(/^[a-d]$/);
        expect(q.options.some((o) => o.id === q.correctAnswer)).toBe(true);
      }
    }
  });
});