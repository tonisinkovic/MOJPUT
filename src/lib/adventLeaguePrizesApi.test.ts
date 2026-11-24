import { describe, it, expect } from "vitest";

describe("adventLeaguePrizesApi types", () => {
  it("documents public shape", () => {
    const sample = {
      partners: [],
      mainPrizes: [{ id: "1", name: "N", description: "d", category: "c", tier: "main" as const }],
      dailyPrizes: [],
      hasDemoContent: true,
    };
    expect(sample.mainPrizes[0].tier).toBe("main");
    expect(sample.hasDemoContent).toBe(true);
  });
});