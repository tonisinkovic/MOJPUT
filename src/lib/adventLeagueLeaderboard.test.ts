import { describe, expect, it } from "vitest";
import { hasMoreLeaderboardPage, type AdventLeaderboardPayload } from "@/lib/adventLeagueLeaderboard";

describe("adventLeagueLeaderboard", () => {
  it("hasMoreLeaderboardPage", () => {
    const partial: AdventLeaderboardPayload = {
      scope: "season",
      entries: [{ rank: 1, username: "a", totalScore: 100 }],
      total: 3,
      limit: 20,
      offset: 0,
      self: null,
    };
    expect(hasMoreLeaderboardPage(partial)).toBe(true);

    const full: AdventLeaderboardPayload = { ...partial, entries: [{ rank: 1, username: "a", totalScore: 1 }], total: 1 };
    expect(hasMoreLeaderboardPage(full)).toBe(false);
  });
});