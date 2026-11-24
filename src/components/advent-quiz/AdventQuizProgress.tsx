import { cn } from "@/lib/utils";

type AdventQuizProgressProps = {
  current: number;
  total: number;
  className?: string;
};

export function AdventQuizProgress({ current, total, className }: AdventQuizProgressProps) {
  return (
    <div
      className={cn("flex flex-col items-center gap-1", className)}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-3 w-3 rounded-full transition-all duration-300",
              i < current
                ? "bg-[hsl(var(--advent-gold))]"
                : i === current
                  ? "bg-[hsl(var(--advent-gold))] animate-advent-glow-pulse ring-2 ring-[hsl(var(--advent-gold)/0.3)]"
                  : "bg-[hsl(var(--advent-frost)/0.15)]",
            )}
          />
        ))}
      </div>
      <p className="text-xs font-semibold advent-text-muted mt-1.5">
        Pitanje {Math.min(current + 1, total)}/{total}
      </p>
    </div>
  );
}
