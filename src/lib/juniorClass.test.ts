import { describe, expect, it } from "vitest";
import { aggregateBoard, makeClassCode, normalizeClassCode, CLASS_CODE_LEN } from "@/lib/juniorClass";

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
  });
});
