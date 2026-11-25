import { useEffect, useState } from "react";
import { adventBandHint } from "@/lib/adventLeagueScoring";

/** Odbrojavanje po pitanju. Bodovi se računaju na serveru. */
export function useAdventQuestionTimer(
  active: boolean,
  startedAtMs: number | null,
  timeLimitSec = 30,
  mode: "timed" | "distance" = "timed",
) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const limitMs = Math.max(5, timeLimitSec) * 1000;

  useEffect(() => {
    if (!active || startedAtMs == null) {
      setElapsedMs(0);
      return;
    }
    const tick = () => setElapsedMs(Math.max(0, Date.now() - startedAtMs));
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [active, startedAtMs]);

  const elapsedSec = elapsedMs / 1000;
  const remainingMs = Math.max(0, limitMs - elapsedMs);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const expired = active && startedAtMs != null && remainingMs <= 0;

  return {
    elapsedMs,
    seconds: Math.floor(elapsedSec),
    remainingSeconds,
    expired,
    bonusHint: adventBandHint(elapsedSec, mode),
  };
}
