import scoringConfig from "@/data/advent-league/scoring.json";

export const ADVENT_DURATION_CAP_MS = 120_000;
export const ADVENT_MIN_DURATION_MS = 500;
export const ADVENT_MAX_START_AGE_MS = 15 * 60 * 1000;

export type TimeBand = { maxSeconds: number; points: number };

export const ADVENT_TIME_BANDS: TimeBand[] = scoringConfig.timeBands;

export type ScoringInput = {
  correct: boolean;
  durationMs: number;
  timeLimitSec?: number;
};

export type ScoringResult = {
  baseScore: number;
  timeBonus: number;
  totalScore: number;
};

export function capAdventDurationMs(durationMs: number): number {
  if (!Number.isFinite(durationMs)) return ADVENT_DURATION_CAP_MS;
  if (durationMs < 0) return 0;
  return Math.min(durationMs, ADVENT_DURATION_CAP_MS);
}

function zeroScore(): ScoringResult {
  return { baseScore: 0, timeBonus: 0, totalScore: 0 };
}

/**
 * Bodovanje točnog odgovora po pojasevima:
 * 0–5 s = 100, 6–10 = 90, 11–15 = 80, 16–20 = 70, 21–25 = 60, 26–30 = 50.
 * Netočan odgovor i odgovor nakon vremenskog limita daju 0.
 */
export function computeAdventDayScore(input: ScoringInput): ScoringResult {
  if (!input.correct) return zeroScore();

  const durationSec = capAdventDurationMs(input.durationMs) / 1000;
  const limit = input.timeLimitSec;
  if (Number.isFinite(limit) && (limit as number) > 0 && durationSec > (limit as number)) return zeroScore();

  for (const band of ADVENT_TIME_BANDS) {
    if (durationSec <= band.maxSeconds) {
      return { baseScore: band.points, timeBonus: 0, totalScore: band.points };
    }
  }
  return zeroScore();
}

export function adventBandHint(elapsedSec: number, mode: "timed" | "distance" = "timed"): string {
  if (mode === "distance") return "do 100 bodova prema preciznosti";
  for (const band of ADVENT_TIME_BANDS) {
    if (elapsedSec <= band.maxSeconds) return `${band.points} ako je točno`;
  }
  return "vrijeme je isteklo";
}

export function validateAdventSubmitTiming(startedAtMs: number, submittedAtMs: number): string | null {
  const durationMs = submittedAtMs - startedAtMs;
  if (durationMs < ADVENT_MIN_DURATION_MS) {
    return "Odgovor je prebrz (sumnja na automatizirani unos).";
  }
  if (durationMs > ADVENT_MAX_START_AGE_MS) {
    return "Pitanje je isteklo — otvori ga ponovo.";
  }
  if (startedAtMs > submittedAtMs) {
    return "Nevaljano vrijeme početka.";
  }
  return null;
}
