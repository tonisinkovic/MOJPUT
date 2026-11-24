import { useEffect, useState } from "react";

/** Prikaz timera po pitanju (klijent samo za UI — bodovi idu preko servera). */
export function useAdventQuestionTimer(active: boolean, startedAtMs: number | null) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!active || startedAtMs == null) {
      setElapsedMs(0);
      return;
    }
    const tick = () => setElapsedMs(Math.max(0, Date.now() - startedAtMs));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [active, startedAtMs]);

  const seconds = Math.floor(elapsedMs / 1000);
  
  let bonusHint: string;
  if (seconds <= 5) bonusHint = "100 bodova";
  else if (seconds <= 15) bonusHint = "95-100 bodova";
  else if (seconds <= 30) bonusHint = "85-95 bodova";
  else if (seconds <= 60) bonusHint = "75-85 bodova";
  else bonusHint = "70 bodova (min)";

  return { elapsedMs, seconds, bonusHint };
}