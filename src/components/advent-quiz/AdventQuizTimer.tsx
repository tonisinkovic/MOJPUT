import { AdventCircularTimer } from "@/components/advent/AdventCircularTimer";

type AdventQuizTimerProps = {
  seconds: number;
  remainingSeconds: number;
  maxSeconds: number;
  bonusHint: string;
  className?: string;
};

export function AdventQuizTimer({ seconds, remainingSeconds, maxSeconds, bonusHint, className }: AdventQuizTimerProps) {
  return (
    <AdventCircularTimer
      seconds={seconds}
      maxSeconds={maxSeconds}
      displaySeconds={remainingSeconds}
      bonusHint={bonusHint}
      className={className}
    />
  );
}
