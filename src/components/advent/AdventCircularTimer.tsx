interface Props {
  /** Elapsed seconds, used to fill the ring. */
  seconds: number;
  /** Max seconds for the ring (default 120). */
  maxSeconds?: number;
  /** When set, the center shows this countdown instead of elapsed time. */
  displaySeconds?: number;
  /** Client-side bonus hint text. */
  bonusHint?: string;
  className?: string;
}

const SIZE = 80;
const STROKE = 5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Circular SVG timer ring for the quiz experience.
 * Gold fill that transitions to cranberry in the final 15s.
 */
export function AdventCircularTimer({ seconds, maxSeconds = 120, displaySeconds, bonusHint, className = "" }: Props) {
  const fraction = Math.min(seconds / maxSeconds, 1);
  const offset = CIRCUMFERENCE * (1 - fraction);
  const shown = displaySeconds ?? seconds;
  const isCritical = displaySeconds != null ? displaySeconds <= 5 : seconds >= maxSeconds - 15;

  const mm = String(Math.floor(shown / 60)).padStart(2, "0");
  const ss = String(shown % 60).padStart(2, "0");

  const strokeColor = isCritical
    ? "hsl(var(--advent-cranberry))"
    : "hsl(var(--advent-gold))";

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Background ring */}
        <svg width={SIZE} height={SIZE} className="absolute inset-0">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="hsl(var(--advent-frost) / 0.1)"
            strokeWidth={STROKE}
          />
        </svg>
        {/* Progress ring */}
        <svg
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 -rotate-90"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.25s ease, stroke 0.5s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-lg font-extrabold tabular-nums"
            style={{ color: strokeColor, transition: "color 0.5s ease" }}
          >
            {mm}:{ss}
          </span>
        </div>
      </div>
      {bonusHint ? (
        <span className="text-[10px] font-semibold advent-text-muted text-center max-w-[120px]">
          {bonusHint}
        </span>
      ) : null}
    </div>
  );
}
