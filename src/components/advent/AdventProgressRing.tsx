interface Props {
  /** Number of completed days. */
  completed: number;
  /** Total days in the season (default 24). */
  total?: number;
  /** Ring size in px (default 64). */
  size?: number;
  className?: string;
}

const STROKE = 4;

/**
 * SVG ring showing season completion progress (X/24 days).
 * Gold fill on frost track.
 */
export function AdventProgressRing({ completed, total = 24, size = 64, className = "" }: Props) {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(completed / total, 1);
  const offset = circumference * (1 - fraction);
  const percent = Math.round(fraction * 100);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg width={size} height={size} className="absolute inset-0">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--advent-frost) / 0.1)"
            strokeWidth={STROKE}
          />
        </svg>
        {/* Fill */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--advent-gold))"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold tabular-nums advent-text-gold">
            {completed}
          </span>
          <span className="text-[8px] font-bold advent-text-muted">/ {total}</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold advent-text-muted">{percent}% sezone</span>
    </div>
  );
}
