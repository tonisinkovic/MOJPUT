import { describe, expect, it } from "vitest";
import daysFile from "./advent-days.json";

describe("advent-days.json", () => {
  it("ima 20 dana kviza (5.–24. 12.)", () => {
    expect(daysFile.days).toHaveLength(20);
    expect(daysFile.days[0].dayKey).toBe("2026-12-05");
    expect(daysFile.days.at(-1)?.dayKey).toBe("2026-12-24");
  });

  it("svaki dan ima točno 10 pitanja s indeksima 0–9", () => {
    for (const day of daysFile.days) {
      expect(day.questions).toHaveLength(10);
      const indices = day.questions.map((q) => q.index).sort((a, b) => a - b);
      expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const q of day.questions) {
        const type = q.type || "choice";
        if (type === "choice") {
          expect(q.options.length).toBeGreaterThanOrEqual(4);
          expect(q.correctAnswer).toMatch(/^[a-d]$/);
          expect(q.options.some((o) => o.id === q.correctAnswer)).toBe(true);
        } else if (type === "text") {
          expect(q.acceptedAnswers.length).toBeGreaterThan(0);
          expect(q.timeLimitSec).toBeGreaterThanOrEqual(5);
        } else if (type === "distance") {
          expect(q.distanceKm).toBeGreaterThan(0);
          expect(q.timeLimitSec).toBe(30);
        }
      }
      if (day.dayNumber <= 3) {
        expect(day.questions[5].timeLimitSec).toBe(10);
        expect(day.questions[8].type).toBe("distance");
      }
    }
  });

  it("nema placeholder pitanja ni označenog točnog odgovora u tekstu opcije", () => {
    for (const day of daysFile.days) {
      for (const q of day.questions) {
        expect(q.text, day.dayKey).not.toMatch(/Testno pitanje/i);
        for (const option of q.options || []) {
          expect(option.text, `${day.dayKey}#${q.index}`).not.toMatch(/\(tocno\)/i);
        }
      }
    }
  });
});