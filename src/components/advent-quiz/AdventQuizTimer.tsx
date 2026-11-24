import { AdventCircularTimer } from "@/components/advent/AdventCircularTimer";

type AdventQuizTimerProps = {
  seconds: number;
  bonusHint: string;
  className?: string;
};

export function AdventQuizTimer({ seconds, bonusHint, className }: AdventQuizTimerProps) {
  return <AdventCircularTimer seconds={seconds} bonusHint={bonusHint} className={className} />;
}
