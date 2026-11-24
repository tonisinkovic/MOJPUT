import { apiGet, type ApiResponse } from "@/lib/api";
import { isAdventApiUnavailableMessage } from "@/lib/adventOfflineFallback";

export type AdventLeaderboardScope = "season" | "day";

export type AdventLeaderboardEntry = {
  rank: number;
  username: string;
  totalScore: number;
  daysPlayed?: number;
  isYou?: boolean;
};

export type AdventLeaderboardSelf = {
  rank: number;
  username: string;
  totalScore: number;
  daysPlayed?: number;
  isYou: true;
};

export type AdventLeaderboardPayload = {
  scope: AdventLeaderboardScope;
  dayKey?: string;
  entries: AdventLeaderboardEntry[];
  total: number;
  limit: number;
  offset: number;
  self: AdventLeaderboardSelf | null;
};

export async function adventFetchLeaderboard(params: {
  scope: AdventLeaderboardScope;
  dayKey?: string;
  limit?: number;
  offset?: number;
}) {
  const q = new URLSearchParams();
  q.set("scope", params.scope);
  if (params.dayKey) q.set("dayKey", params.dayKey);
  if (params.limit != null) q.set("limit", String(params.limit));
  if (params.offset != null) q.set("offset", String(params.offset));
  const res = await apiGet<AdventLeaderboardPayload>(`/api/advent/leaderboard?${q.toString()}`);
  if (res.success && res.data) return res;
  if (isAdventApiUnavailableMessage(res.message)) {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;
    return {
      success: true,
      data: {
        scope: params.scope,
        dayKey: params.scope === "day" ? params.dayKey : undefined,
        entries: [],
        total: 0,
        limit,
        offset,
        self: null,
      },
    };
  }
  return res;
}

export function hasMoreLeaderboardPage(data: AdventLeaderboardPayload): boolean {
  return data.offset + data.entries.length < data.total;
}