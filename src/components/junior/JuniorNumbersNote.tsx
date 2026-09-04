import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { JUNIOR_NUMBERS_NOTE, JUNIOR_NUMBERS_NOTE_SHORT } from "@/lib/juniorHonesty";

export default function JuniorNumbersNote({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
      <span>{compact ? JUNIOR_NUMBERS_NOTE_SHORT : JUNIOR_NUMBERS_NOTE}</span>
    </p>
  );
}
