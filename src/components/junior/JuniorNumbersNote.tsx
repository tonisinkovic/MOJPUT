import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  JUNIOR_CATALOG_NOTE,
  JUNIOR_CATALOG_NOTE_SHORT,
  JUNIOR_NUMBERS_NOTE,
  JUNIOR_NUMBERS_NOTE_SHORT,
  JUNIOR_SCHOOL_COUNT_NOTE,
  JUNIOR_SCHOOL_COUNT_NOTE_SHORT,
} from "@/lib/juniorHonesty";

export default function JuniorNumbersNote({
  compact = false,
  catalog = false,
  counts = false,
  className,
}: {
  compact?: boolean;
  catalog?: boolean;
  counts?: boolean;
  className?: string;
}) {
  const text = counts
    ? compact
      ? JUNIOR_SCHOOL_COUNT_NOTE_SHORT
      : JUNIOR_SCHOOL_COUNT_NOTE
    : catalog
      ? compact
        ? JUNIOR_CATALOG_NOTE_SHORT
        : JUNIOR_CATALOG_NOTE
      : compact
        ? JUNIOR_NUMBERS_NOTE_SHORT
        : JUNIOR_NUMBERS_NOTE;

  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
      <span>{text}</span>
    </p>
  );
}
