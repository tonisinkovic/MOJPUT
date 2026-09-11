import { describe, expect, it } from "vitest";
import {
  CLASS_CODE_LEN,
  aggregateBoard,
  arrivalLabel,
  makeClassCode,
  normalizeClassCode,
  studentQuizPath,
} from "@/lib/juniorClass";

describe("junior razred", () => {
  it("generira kod od 6 čitljivih znakova", () => {
    let i = 0;
    const code = makeClassCode(() => {
      i += 0.13;
      return i % 1;
    });
    expect(code).toHaveLength(CLASS_CODE_LEN);
    expect(normalizeClassCode(code)).toBe(code);
  });

  it("normalizira razmake i mala slova", () => {
    expect(normalizeClassCode("ab 23 cd")).toBe("AB23CD");
    expect(normalizeClassCode("krivo")).toBeNull();
  });

  it("zbraja smjerove bez imena", () => {
    const board = aggregateBoard("AB23CD", "8.a", [
      { alias: "Ana", programId: 1, programName: "Opća gimnazija", pathway: "gimnazija", city: "Zagreb" },
      { alias: null, programId: 1, programName: "Opća gimnazija", pathway: "gimnazija", city: "Zagreb" },
      { alias: "Iva", programId: 12, programName: "Medicinska", pathway: "strukovna", city: "Zagreb" },
    ]);
    expect(board.doneCount).toBe(3);
    expect(board.tracks[0]).toMatchObject({ name: "Opća gimnazija", count: 2 });
    expect(board.tracks[1]?.count).toBe(1);
    expect(board.entries.map((e) => e.programId)).toEqual([1, 1, 12]);
  });

  it("link za učenike nosi kod razreda", () => {
    expect(studentQuizPath("AB23CD")).toBe("/kviz-srednja?razred=AB23CD");
  });

  it("oznaka dolaska razlikuje upravo i starije", () => {
    const now = Date.parse("2026-09-12T10:00:00Z");
    expect(arrivalLabel("2026-09-12T09:59:55Z", now)).toBe("upravo");
    expect(arrivalLabel("2026-09-12T09:58:00Z", now)).toMatch(/prije/);
  });
});
