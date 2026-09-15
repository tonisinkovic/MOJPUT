import { describe, expect, it } from "vitest";
import { pickJuniorCloudAction } from "@/lib/juniorCloud";
import type { JuniorCloudState } from "@/lib/juniorPath";

const empty = (): JuniorCloudState => ({
  updatedAt: "1970-01-01T00:00:00.000Z",
  snapshot: null,
  shortlist: [],
  grades: null,
  quickPoints: null,
});

const withSnap = (at: string): JuniorCloudState => ({
  ...empty(),
  updatedAt: at,
  snapshot: {
    savedAt: at,
    city: "Zagreb",
    confidence: { level: "medium", score: 50, explanation: "ok" },
    pathway: {
      academicScore: 50,
      practicalScore: 50,
      direction: "balanced",
      title: "Put",
      explanation: "x",
    },
    topInterests: [],
    topSubjects: [],
    recommendations: [
      {
        id: 1,
        name: "Opća gimnazija",
        type: "gimnazija",
        duration: 4,
        matchPercentage: 80,
        afterSchool: "faks",
        entryBar: "visok",
      },
    ],
  },
});

describe("pickJuniorCloudAction", () => {
  it("gura lokalno kad oblaka nema", () => {
    expect(pickJuniorCloudAction(withSnap("2026-03-01T00:00:00.000Z"), null)).toBe("push");
  });

  it("povlači oblak kad je lokal prazan", () => {
    expect(pickJuniorCloudAction(empty(), withSnap("2026-03-01T00:00:00.000Z"))).toBe("apply");
  });

  it("noviji oblak pobjeđuje", () => {
    expect(
      pickJuniorCloudAction(withSnap("2026-03-01T00:00:00.000Z"), withSnap("2026-04-01T00:00:00.000Z")),
    ).toBe("apply");
  });

  it("noviji lokal pobjeđuje", () => {
    expect(
      pickJuniorCloudAction(withSnap("2026-04-01T00:00:00.000Z"), withSnap("2026-03-01T00:00:00.000Z")),
    ).toBe("push");
  });
});
